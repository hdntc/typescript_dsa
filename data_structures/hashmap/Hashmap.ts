import { LinkedList, notLLNode, LLNode } from "../linked_list/LinkedList";

export enum HashmapErrors {
    INIT_ARRAY_LENGTH_MISMATCH="The array of initial_keys must be the same length as the array of initial_values.",
    INIT_BUCKETS_INVALID="Number of buckets must be a positive integer.",
    NONEXISTANT_KEY="Key does not exist in hashmap.",
    DYNAMIC_HASHING_NOT_ENABLED="Dynamic hashing is not enabled.",
    LOAD_FACTOR_BOUND_INVALID="The load factor bound must satisfy 0 <= min < max.",
    DESIRED_LOAD_FACTOR_OUT_OF_BOUNDS="The provided value for the desired load factor is not within the min/max bounds.",
    LOAD_FACTOR_BOUNDS_PROVIDED_WITHOUT_DYNAMIC_REHASHING="Dynamic rehashing must be enabled to set min/max load factor bounds.",
    UNBOUNDED_DYNAMIC_REHASH="min_load_factor and max_load_factor must both be non-null to dynamically rehash.",
    NO_BUCKETS="There are no buckets.",
    MULTIPLICATION_FACTOR_PROVIDED_MODULO="hashing_method must be 'MULTIPLICATION' in order to use a multiplication factor."
};

/**
 * Acceptable types for hashmap key
 * 
 * Both `number` and `string` implement `.toString()`
 */
type Key = number | string;

export function default_hash_function(key: Key): number {
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
 * The parameters with which to instantiate the hashmap.
 * 
 * Only `initial_values` and `initial_keys` are required.
 */
type HashmapConfig<T> =  {
    /**
     * An array of initial values for the hashmap. Must be the same length as `initial_keys`.
     */
    initial_values: T[],
    /**
     * An array of initial keys for the hashmap. Must be the same length as `initial_values`.
     */
    initial_keys: Key[],
    /**
     * The hash function to use. If not specified, uses {@link default_hash_function a default} equivalent to Java's `hashCode`.
     */
    hash_function?: (key: string) => number,
    /**
     * Initial number of buckets to use.
     * - If not specified when not using dynamic rehashing, uses `ceil(1.5 * initial_keys.length)`.
     * - If not specified when using dynamic rehashing, uses `ceil(2 * initial_keys.length / (min_load_factor + max_load_factor))`; this means the load factor will be close to the average of `min_load_factor` and `max_load_factor`.
     */
    buckets?: number,
    /**
     * Whether or not to enable dynamic rehashing. 
     * When enabled, the hashmap will automatically scale in/out the number of buckets if the load factor falls outside the bounds provided by `min_load_factor`, `max_load_factor`. 
     * `false` if not provided.
     */
    enable_dynamic_rehashing?: boolean,
    /**
     * Minimum acceptable load factor. 
     * If not provided when `enable_dynamic_rehashing` is `true`, defaults to `0.60`.
     */
    min_load_factor?: number,
    /**
     * Maximum acceptable load factor. 
     * If not provided when `enable_dynamic_rehashing` is `true`, defaults to `0.75`.
     */
    max_load_factor?: number,
    /**
     * The method of hashing to use.
     * If not provided, defaults to `MODULO`.
     * @see {@link https://en.wikipedia.org/wiki/Hash_table#Hashing_by_division Wikipedia}
     */
    hashing_method?: "MODULO" | "MULTIPLICATION"
    /**
     * The multiplication factor to use when using hashing by multiplication.
     * - Must be between `0` and `1`.
     * - When not provided when `hashing_method` is `MULTIPLICATION`, defaults to `0.618` (the reciprocal of the golden ratio). 
     */
    multiplication_factor?: number
};

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
     * When this is `true`, `insert` and `delete` operations will not check for dynamic rehashing.
     * This is done to prevent a rehash causing another rehash.
     */
    #stop_rehash_loop: boolean = true;
    /**
     * The hashing method to use.
     */
    #hashing_method: "MODULO" | "MULTIPLICATION";
    /**
     * Multiplication factor for hashing by multiplication (if used.)
     */
    #multiplication_factor: number | null = null;

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
        const n = this.buckets.length;
        if(n === 0) throw Error(HashmapErrors.NO_BUCKETS);

        const digest = this.#hash_function(key.toString());

        return this.#hashing_method === "MODULO" ? 
            this._hash_by_modulo(digest, n) : 
            this._hash_by_multiplication(digest, n);
    };

    private _hash_by_modulo(digest: number, buckets: number): number {
        return ((digest % buckets) + buckets) % buckets;
    }

    private _hash_by_multiplication(digest: number, buckets: number): number {
        return Math.floor(buckets * Math.trunc(digest * (this.#multiplication_factor as number)));
    }

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
     * Resizes the number of buckets of the hashmap and rehashes pre-existing elements to the new buckets.
     * @param desired The desired new value for the parameter.
     * @param on_buckets Whether to rehash based on load factor or number of buckets.
     * If `true`, `desired` will be interpreted as the new number of buckets.
     * If `false`, `desired` will be interpreted as the new desired load factor.
     * `false` by default.
     * 
     * When `on_buckets` is `false`, the new number of buckets is set to `ceil(entries / desired)`.
     */
    rehash(desired: number, on_buckets: boolean = false): void {
        let wanted_num_buckets: number;

        if(!on_buckets) {
            if(!(this.#min_load_factor === null || this.#max_load_factor === null)) {
                if(!(this.#min_load_factor <= desired && desired <= this.#max_load_factor)) {
                    throw Error(HashmapErrors.DESIRED_LOAD_FACTOR_OUT_OF_BOUNDS);
                }
            }

            wanted_num_buckets = Math.ceil(this.elements / desired);
            console.log("DESIRED IS",desired);
        } else {
            wanted_num_buckets = desired;
        }

        const all_entries: [string, T][] = this.buckets.map((x) => { return x ? x.traverse() : [] }).flat();

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

        if(this.#dynamic_rehashing_enabled && !this.#stop_rehash_loop) {
            this.#stop_rehash_loop = true;
            // Check what the outcome bucket size would be if doing lf-based rehash
            const current_num_buckets = this.buckets.length;
            const new_buckets = Math.ceil(2 * this.elements/ (<number>this.#max_load_factor + <number>this.#min_load_factor));

            // This might happen when the hm is small
            // Namely, when 2E/B <== m+M < 2E/(B-1) where E is # elements, B is current # buckets, m is min LF, M is max LF
            if(new_buckets === current_num_buckets) {
                console.log("Equals condition")
                if(this.elements - 1 < (<[number, number]>this.valid_elements_range)[1]) {
                    this.rehash(current_num_buckets - 1, true);
                }
            } else {
                this.rehash((<number>this.#max_load_factor + <number>this.#min_load_factor) / 2, false)
            }

            this.#stop_rehash_loop = false;
        }

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
     * @returns a tuple `[min, max]` of two integers, representing the inclusive range of allowed number of elements/entries before dynamic rehashing.
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

        if(this.#dynamic_rehashing_enabled && !this.#stop_rehash_loop) {
            this.#stop_rehash_loop = true;
            // Check what the outcome bucket size would be if doing lf-based rehash
            const current_num_buckets = this.buckets.length;
            const new_buckets = Math.ceil(2 * this.elements / (<number>this.#max_load_factor + <number>this.#min_load_factor));

            // This might happen when the hm is small
            // Namely, when 2E/B <== m+M < 2E/(B-1) where E is # elements, B is current # buckets, m is min LF, M is max LF
            if(new_buckets === current_num_buckets) {
                console.log("Equals condition")
                if(this.elements + 1 > (<[number, number]>this.valid_elements_range)[1]) {
                    this.rehash(current_num_buckets + 1, true);
                }
            } else {
                this.rehash((<number>this.#max_load_factor + <number>this.#min_load_factor) / 2, false)
            }

            this.#stop_rehash_loop = false;
        }

        const bucket_index = this._get_bucket_index(key);
        let resulstant_bucket: LinkedList<[string, T]> | null = this.buckets[bucket_index];

        if(resulstant_bucket === null) {
            this.buckets[bucket_index] = new LinkedList<[string, T]>(new LLNode<[string,T]>([key, value]));
        } else {
            const new_list = new LinkedList<[string, T]>(new LLNode<[string,T]>([key, value]));
            (<LLNode<[string, T]>>resulstant_bucket.head).prev = new_list.head; // safe b.c. would only be null if resultant_bucket were null
            (<LLNode<[string, T]>>new_list.head).next = resulstant_bucket.head; // safe b.c. new_list is initialized with an LLNode
            
            this.buckets[bucket_index] = new_list;
        }
        

        this.elements++;
    }

    /**
     * @param config See {@link HashmapConfig}.
     */
    constructor(config: HashmapConfig<T>) {
        if(config.initial_values.length !== config.initial_keys.length) {
            throw Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH);
        }

        const hashing_method: "MODULO" | "MULTIPLICATION" = config.hashing_method ? config.hashing_method : "MODULO";
        this.#hashing_method = hashing_method;

        if(hashing_method === "MODULO") {
            if(typeof config.multiplication_factor !== "undefined") throw Error(HashmapErrors.MULTIPLICATION_FACTOR_PROVIDED_MODULO);
        } else {
            if(typeof config.multiplication_factor !== "undefined") {
                this.#multiplication_factor = 0.618;
            }
        }

        if(config.enable_dynamic_rehashing) {
            let min = typeof config.min_load_factor === "undefined" ? 0.6 : config.min_load_factor;
            let max = typeof config.max_load_factor === "undefined" ? 0.75 : config.max_load_factor;

            if(!(0 <= min && min < max)) {
                throw Error(HashmapErrors.LOAD_FACTOR_BOUND_INVALID);
            }

            this.#min_load_factor = min;
            this.#max_load_factor = max;
        } else {
            if(!(typeof config.min_load_factor === "undefined" && typeof config.max_load_factor === "undefined")) {
                throw Error(HashmapErrors.LOAD_FACTOR_BOUNDS_PROVIDED_WITHOUT_DYNAMIC_REHASHING);
            }

            this.#min_load_factor = null;
            this.#max_load_factor = null;
        }

        this.#dynamic_rehashing_enabled = !!config.enable_dynamic_rehashing; // true if true, false if false, false if undefined

        if(typeof config.hash_function === "undefined") {
            this.#hash_function = this._default_hash_function;
        } else {
            this.#hash_function = config.hash_function;
        }

        let buckets: number | undefined = config.buckets;
        if(typeof buckets === "undefined") {
            if(config.enable_dynamic_rehashing) {
                // This type assertion is safe because earlier we said that min, max_load_factor will have defaults 0.6, 0.75 if not already defined.
                buckets = Math.ceil(2 * config.initial_keys.length / (<number>config.min_load_factor + <number>config.max_load_factor));
            } else {
                buckets = Math.ceil(config.initial_keys.length * 1.5);
            }
        } else {
            if(!Number.isInteger(buckets) || buckets < 1) {
                throw Error(HashmapErrors.INIT_BUCKETS_INVALID);
            }
        }

        this.buckets = new Array(buckets);
        this.buckets.fill(null);

        for(let i=0;i<config.initial_values.length;i++) {
            this.insert(config.initial_values[i], config.initial_keys[i]);
        }

        this.#stop_rehash_loop = false;
    };
};