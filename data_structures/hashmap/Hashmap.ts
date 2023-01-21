import { LinkedList, notLLNode, LLNode } from "../linked_list/LinkedList";

export enum HashmapErrors {
    INIT_ARRAY_LENGTH_MISMATCH="The array of initial_keys must be the same length as the array of initial_values.",
    INIT_BUCKETS_INVALID="Number of buckets must be a positive integer.",
    NONEXISTANT_KEY="Key does not exist in hashmap.",
    DYNAMIC_HASHING_NOT_ENABLED="Dynamic hashing is not enabled.",
    LOAD_FACTOR_BOUND_INVALID="The load factor bound must satisfy 0 <= min < max.",
    DESIRED_LOAD_FACTOR_OUT_OF_BOUNDS="The provided value for the desired load factor is not within the min/max bounds.",
    LOAD_FACTOR_BOUNDS_PROVIDED_WITHOUT_DYNAMIC_REHASHING="Dynamic rehashing must be enabled to set min/max load factor bounds.",
    UNBOUNDED_DYNAMIC_REHASH="min_load_factor and max_load_factor must both be non-null to dynamically rehash."
};

/**
 * Acceptable types for hashmap key
 * 
 * Both `number` and `string` implement `.toString()`
 */
type Key = number | string;

/**
 * Hashmap class
 * 
 * Currently supports collision resolution by chaining, hashing by modulo and string keys
 * 
 * @template T - The type of the values in the hashmap.
 * @todo Add load-factor based rehashing
 * @todo Add hashing by multiplication option
 */
export class Hashmap<T> {
    /**
     * The buckets of the hashmap
     * 
     * This is an array of {@link LinkedList}s of entries which represented as a tuples of `[string, T]`
     * 
     * When an entry is inserted, it will become the head of the corresponding LL
     * 
     * When all entries in an LL bucket are removed, the corresponding entry in the array becomes `null`; see {@link Hashmap.delete delete}
     */
    buckets: (LinkedList<[string, T]>|null)[] = [];
    /**
     * The keys used in the hashmap
     */
    keys: string[] = [];
    /**
     * The number of entries present in the hashmap
     * 
     * Used to calculate {@link Hashmap.load_factor load factor}
     */
    elements: number = 0;
    /**
     * Number of times the hashmap was dynamically rehashed (i.e. the number of buckets changed.)
     */
    rehashes: number = 0;
    /**
     * The hash function used
     * 
     * User can specify their own, else defaults to {@link Hashmap._default_hash_function _default_hash_function}
     * 
     * The hash digest returned by this function is combined with the number of {@link Hashmap.buckets buckets} to {@link Hashmap._get_bucket_index get the corresponding bucket index for the entry}
     */
    #hash_function: (key: string) => number;
    /**
     * Minimum load factor for dynamic rehashing.
     * 
     * This value is compared with the new {@link Hashmap.load_factor load factor} after insert/delete operations to determine whether or not to increase the # of buckets.
     */
    #min_load_factor: number | null;
    /**
     * Maximum load factor for dynamic rehashing.
     * 
     * This value is compared with the new {@link Hashmap.load_factor load factor} after insert/delete operations to determine whether or not to decrease the # of buckets.
     */
    #max_load_factor: number | null;
    /**
     * Whether or not to use dynamic rehashing.
     */
    #dynamic_rehashing_enabled: boolean = false;

    /**
     * Default hash function used when user does not specify their own
     * 
     * Based on Java's `hashCode`
     * @private
     * @param key
     * @returns The hash digest of `key`
     */
    private _default_hash_function(key: Key): number {
        var hash = 0;
        var i = 0;

        key = key.toString(); 

        var len = key.length;

        while(i < len) {
            hash = ((hash << 5) - hash + key.charCodeAt(i++)) << 0; // hash <- 31 * hash + (current character code)
        }

        return hash;
    };

    /**
     * Passes hash digest of key through modulo operation to get bucket index.
     * @private
     * @param key - The key
     * @returns The index of the corresponding bucket in {@link Hashmap.buckets this.buckets}
     */
    private _get_bucket_index(key: Key): number {
        const hash = this.#hash_function(key.toString());
        const n = this.buckets.length;

        return ((hash % n) + n) % n;
    };

    /**
     * Rehashes the hash table if the {@link Hashmap.load_factor load factor} falls outside the min/max bounds.
     * @returns `true` if rehashed, `false` otherwise
     * @throws When dynamic hashing is not enabled.
     */
    private _dynamic_rehash_if_needed(): boolean {
        if(!this.#dynamic_rehashing_enabled) {
            throw Error(HashmapErrors.DYNAMIC_HASHING_NOT_ENABLED);
        }

        if(this.#min_load_factor === null || this.#max_load_factor === null) {
            throw Error(HashmapErrors.UNBOUNDED_DYNAMIC_REHASH);
        }

        const alpha = this.load_factor;

        if(!(this.#min_load_factor <= alpha && alpha <= this.#max_load_factor)) {
            this.rehash((this.#min_load_factor + this.#max_load_factor) / 2);
            return true;
        }

        return false;
    }

    /**
     * @todo Allow for revert if there is too large of a difference between desired and actual
     */
    rehash(desired_load_factor: number): void {
        // Only do bounds check if bounds are actually set
        if(!(this.#min_load_factor === null || this.#max_load_factor === null)) {
            if(!(this.#min_load_factor <= desired_load_factor && desired_load_factor <= this.#max_load_factor)) {
                throw Error(HashmapErrors.DESIRED_LOAD_FACTOR_OUT_OF_BOUNDS);
            }
        }

        const all_entries: [string, T][] = this.buckets.map((x) => { return x ? x.traverse() : [] }).flat();
        const former_num_buckets: number = this.buckets.length;
        const entries: number = this.elements;

        // desired load factor = # entries / # buckets
        // # new buckets  = ceil(# entires / desired load factor)
        // new load factor = # entries / ceil(# entries / load factor)

        const wanted_num_buckets: number = Math.ceil(entries / desired_load_factor);

        this.buckets = new Array(wanted_num_buckets);
        this.buckets.fill(null);
        this.elements = 0; // reset elements since insert() method increases it

        all_entries.forEach(([key, val]: [string, T]) => {
            this.insert(val, key);
        })
        
        this.rehashes++;
    }

    /**
     * Computed property for the {@link https://en.wikipedia.org/wiki/Hash_table#Load_factor load factor} of the hashmap.
     * 
     * Target value for optimal performance is around 0.60 - 0.75
     * @returns The load factor
     */
    get load_factor(): number {
        return this.elements / this.buckets.length;
    };

    get length(): number {
        return this.keys.length;
    };

    /**
     * Removes the entry with the specified `key`. This is an in-place operation.
     * 
     * If the result of this operation would lead to an empty LL the LL will become `null`
     * 
     * @throws {@link HashmapErrors.NONEXISTANT_KEY NONEXISTANT_KEY}
     * @param key 
     */
    delete(key: Key): void {
        key = key.toString();
        const bucket_index = this._get_bucket_index(key);
        const resulstant_bucket: LinkedList<[string, T]> | null = this.buckets[bucket_index];

        if(resulstant_bucket === null) {
            throw Error(HashmapErrors.NONEXISTANT_KEY);
        }

        let current: LLNode<[string, T]> = resulstant_bucket.head as LLNode<[string, T]>; // safe
        if(current.value[0] === key) {
            if(current.next) {
                this.buckets[bucket_index] = new LinkedList<[string, T]>(current.next);
                current.next.prev = null;
            } else {
                this.buckets[bucket_index] = null;
            }
            this.elements--;
            return;
        }
        
        while(current.next !== null) {
            current = current.next;
            if(current.value[0] === key) {
                (current.prev as LLNode<[string, T]>).next = current.next;
                (current.next as LLNode<[string, T]>).prev = current.prev;
                this.elements--;
            }
        }

        throw Error(HashmapErrors.NONEXISTANT_KEY);
    }

    /**
     * Accesses the hashmap to get the value with the corresponding `key`
     * 
     * @param key 
     * @throws {@link HashmapErrors.NONEXISTANT_KEY NONEXISTANT_KEY}
     * @returns The corresponding value
     */
    access(key: Key): T {
        key = key.toString();
        const bucket_index = this._get_bucket_index(key);
        const resulstant_bucket: LinkedList<[string, T]> | null = this.buckets[bucket_index];

        if(resulstant_bucket === null) {
            throw Error(HashmapErrors.NONEXISTANT_KEY);
        }

        let current: LLNode<[string, T]> = resulstant_bucket.head as LLNode<[string, T]>;
        if(current.value[0] === key) return current.value[1];
        
        while(current.next !== null) {
            current = current.next;
            if(current.value[0] === key) return current.value[1];
        }

        throw Error(HashmapErrors.NONEXISTANT_KEY);
    }

    /**
     * @returns a tuple `[min, max]` of two integers, representing the (inclusive) range of allowed number of elements/entries before dynamic rehashing.
     * If an insertion or deletion operation would cause the number of elements to fall outside of this range, the number of buckets will be adjusted before the insertion/deletion.
     * @returns `null` if dynamic rehashing is not enabled.
     */
    get valid_elements_range(): [number, number] | null {
        if(!this.#dynamic_rehashing_enabled) {
            return null;
        };

        return [
            Math.ceil(this.buckets.length * <number>this.#min_load_factor),
            Math.floor(this.buckets.length * <number>this.#max_load_factor)
        ];

    }

    /**
     * Inserts the entry into the hashmap
     * @param value 
     * @param key
     * @todo check for pre-existence
     */
    insert(value: T, key: Key) {
        key = key.toString();
        const bucket_index = this._get_bucket_index(key);
        let resulstant_bucket: LinkedList<[string, T]> | null = this.buckets[bucket_index];

        if(this.#min_load_factor !== null && this.#max_load_factor !== null) {
            // calculate what the load factor would be after insert w/ same # buckets
            const would_be_load_factor = this.load_factor + 1 / this.buckets.length; // (this.elements + 1) / this.buckets.length
            // could also save from performing reciprocal operation by comparing would_be * this.buckets.length to min*buckets.length etc
            if(!(this.#min_load_factor < would_be_load_factor && would_be_load_factor < this.#max_load_factor)) {
                // if the would-be load factor is out of bounds, instead do a rehash and THEN insert (this saves 1 insertion overall
                // when compared to the alternative of rehashing if needed after performing insert)
            }
        } else {
            if(resulstant_bucket === null) {
                this.buckets[bucket_index] = new LinkedList<[string, T]>(new LLNode<[string,T]>([key, value]));
            } else {
                const new_list = new LinkedList<[string, T]>(new LLNode<[string,T]>([key, value]));
                (<LLNode<[string, T]>>resulstant_bucket.head).prev = new_list.head; // safe b.c. would only be null if resultant_bucket were null
                (<LLNode<[string, T]>>new_list.head).next = resulstant_bucket.head; // safe b.c. new_list is initialized with an LLNode
                
                this.buckets[bucket_index] = new_list;
            }
        }

        this.elements++;
    }
    
    /**
     * @constructor
     * @param initial_values An array of initial values for the hashmap. 
     * Must be the same length as `initial_keys`.
     * @param initial_keys An array of initial keys for the hashmap. 
     * Must be the same length as `initial_values`.
     * @param [hash_function] The hash function to use. 
     * If not specified, uses an {@link Hashmap._default_hash_function internal default} equivalent to Java's `hashCode` function.
     * @param [buckets] The number of initial buckets. 
     * If not specified when not using dynamic rehashing, uses `ceil(1.5 * initial_keys.length)`.
     * If not specified when using dynamic rehashing, uses `ceil(2 * initial_keys.length / (min_load_factor + max_load_factor))`; this means the load factor will be close to the average of `min_load_factor` and `max_load_factor`.
     * @param [enable_dynamic_rehashing] Whether or not to enable dynamic rehashing. 
     * When enabled, the hashmap will automatically scale in/out the number of buckets if the load factor falls outside the bounds provided by `min_load_factor`, `max_load_factor`. 
     * `false` if not provided.
     * @param [min_load_factor] Minimum acceptable load factor. 
     * If not provided when `enable_dynamic_rehashing` is `true`, defaults to `0.60`.
     * Otherwise, defaults to `null`.
     * @param [max_load_factor] Maximum acceptable load factor. 
     * If not provided when `enable_dynamic_rehashing` is `true`, defaults to `0.75`.
     * Otherwise, defaults to `null`.
     * 
     */
    constructor(initial_values: T[],
        initial_keys: Key[],
        hash_function?: (key: string) => number,
        buckets?: number,
        enable_dynamic_rehashing: boolean = false,
        min_load_factor?: number,
        max_load_factor?: number) {
        if(initial_values.length !== initial_keys.length) {
            throw Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH);
        }

        if(enable_dynamic_rehashing) {
            if(typeof min_load_factor === "undefined") min_load_factor = 0.6;
            if(typeof max_load_factor === "undefined") max_load_factor = 0.75;

            if(!(0 <= min_load_factor && min_load_factor < max_load_factor)) {
                throw Error(HashmapErrors.LOAD_FACTOR_BOUND_INVALID);
            }

            this.#min_load_factor = min_load_factor;
            this.#max_load_factor = max_load_factor;
        } else {
            if(!(typeof min_load_factor === "undefined" && typeof max_load_factor === "undefined")) {
                throw Error(HashmapErrors.LOAD_FACTOR_BOUNDS_PROVIDED_WITHOUT_DYNAMIC_REHASHING);
            }

            this.#min_load_factor = null;
            this.#max_load_factor = null;
        }

        this.#dynamic_rehashing_enabled = enable_dynamic_rehashing;

        if(typeof hash_function === "undefined") {
            this.#hash_function = this._default_hash_function;
        } else {
            this.#hash_function = hash_function;
        }

        if(typeof buckets === "undefined") {
            if(enable_dynamic_rehashing) {
                // This type assertion is safe because earlier we said that min, max_load_factor will have defaults 0.6, 0.75 if not already defined.
                buckets = Math.ceil(2 * initial_keys.length / (<number>min_load_factor + <number>max_load_factor));
            } else {
                buckets = Math.ceil(initial_keys.length * 1.5);
            }
        } else {
            if(!Number.isInteger(buckets) || buckets < 1) {
                throw Error(HashmapErrors.INIT_BUCKETS_INVALID);
            }
        }

        this.buckets = new Array(buckets);
        this.buckets.fill(null);

        for(let i=0;i<initial_values.length;i++) {
            this.insert(initial_values[i], initial_keys[i]);
        }
    };
};