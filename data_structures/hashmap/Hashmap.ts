import { LinkedList, notLLNode, LLNode } from "../linked_list/LinkedList";

export enum HashmapErrors {
    INIT_ARRAY_LENGTH_MISMATCH="The array of initial_keys must be the same length as the array of initial_values",
    INIT_BUCKETS_INVALID="Number of buckets must be a positive integer",
    NONEXISTANT_KEY="Key does not exist in hashmap"
};

/**
 * Hashmap class
 * 
 * Currently supports collision resolution by chaining, hashing by modulo and string keys
 * 
 * @template T - The type of the values in the hashmap.
 * @todo Add support for other types of key
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
    buckets: LinkedList<[string, T]>[] = [];
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
     * The hash function used
     * 
     * User can specify their own, else defaults to {@link Hashmap._default_hash_function _default_hash_function}
     * 
     * The hash digest returned by this function is combined with the number of {@link Hashmap.buckets buckets} to {@link Hashmap._get_bucket_index get the corresponding bucket index for the entry}
     */
    #hash_function: (key: string) => number;

    /**
     * Default hash function used when user does not specify their own
     * 
     * Based on Java's `hashCode`
     * @private
     * @param key
     * @returns The hash digest of `key`
     */
    private _default_hash_function(key: string): number {
        var hash = 0;
        var i = 0;
        var len = key.length;

        while(i < len) {
            hash = ((hash << 5) - hash + key.charCodeAt(i++)) << 0; // hash <- 31 * hash + (current character code)
        }

        return hash;
    };

    /**
     * 
     * Passes hash digest of key through modulo operation to get bucket index
     * @private
     * @param key - The key
     * @returns The index of the corresponding bucket in {@link Hashmap.buckets this.buckets}
     */
    private _get_bucket_index(key): number {
        const hash = this.#hash_function(key);
        const n = this.buckets.length;

        return ((hash % n) + n) % n;
    };

    /**
     * Computed property for the {@link https://en.wikipedia.org/wiki/Hash_table#Load_factor load factor} of the hashmap
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
    delete(key: string): void {
        const bucket_index = this._get_bucket_index(key);

        if(this.buckets[bucket_index] === null) {
            throw Error(HashmapErrors.NONEXISTANT_KEY);
        }

        let current: LLNode<[string, T]> = this.buckets[bucket_index].head;
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
                current.prev.next = current.next;
                current.next.prev = current.prev;
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
    access(key: string): T {
        const bucket_index = this._get_bucket_index(key);

        if(this.buckets[bucket_index] === null) {
            throw Error(HashmapErrors.NONEXISTANT_KEY);
        }

        let current: LLNode<[string, T]> = this.buckets[bucket_index].head;
        if(current.value[0] === key) return current.value[1];
        
        while(current.next !== null) {
            current = current.next;
            if(current.value[0] === key) return current.value[1];
        }

        throw Error(HashmapErrors.NONEXISTANT_KEY);
    }

    /**
     * Inserts the entry into the hashmap
     * @param value 
     * @param key
     * @todo check for pre-existence
     */
    insert(value: T, key: string) {
        const bucket_index = this._get_bucket_index(key);

        if(this.buckets[bucket_index] === null) {
            this.buckets[bucket_index] = new LinkedList<[string, T]>(new LLNode<[string,T]>([key, value]));
        } else {
            const new_list = new LinkedList<[string, T]>(new LLNode<[string,T]>([key, value]));
            this.buckets[bucket_index].head.prev = new_list.head;
            new_list.head.next = this.buckets[bucket_index].head;
            this.buckets[bucket_index] = new_list;
        }

        this.elements++;
    }
    
    /**
     * @constructor
     * @param initial_values An array of initial values for the hashmap. Must be the same length as `initial_keys`
     * @param initial_keys An array of initial keys for the hashmap. Must be the same length as `initial_values`
     * @param [hash_function] The hash function to use. If not specified, uses an {@link Hashmap._default_hash_function internal default} equivalent to Java's `hashCode` function
     * @param [buckets] The number of initial buckets. If not specified, uses `ceil(1.5 * initial_keys.length)`
     */
    constructor(initial_values: T[], initial_keys: string[], hash_function?: (string) => number, buckets?: number) {
        if(initial_values.length !== initial_keys.length) {
            throw Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH);
        }

        if(typeof hash_function === "undefined") {
            this.#hash_function = this._default_hash_function;
        } else {
            this.#hash_function = hash_function;
        }

        if(typeof buckets === "undefined") {
            buckets = Math.ceil(initial_keys.length * 1.5);
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

        this.buckets.forEach(b => {
            if(b) console.log(b.traverse());
        });
    };
};