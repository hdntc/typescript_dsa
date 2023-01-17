import { LinkedList, notLLNode, LLNode } from "../linked_list/LinkedList";

export enum HashmapErrors {
    INIT_ARRAY_LENGTH_MISMATCH="The array of initial_keys must be the same length as the array of initial_values",
    INIT_BUCKETS_INVALID="Number of buckets must be a positive integer",
    NONEXISTANT_KEY="Key does not exist in hashmap"
};

/**
 * Hashmap class
 * 
 * Currently only supports keys of type string
 * 
 * @template T - The type of the values in the hashmap.
 * @todo Add support other types of key
 * @todo Add load-factor based rehashing
 * @todo Add hashing by multiplication option
 */
export class Hashmap<T> {
    buckets: LinkedList<[string, T]>[] = []; // supports chaining
    keys: string[] = [];
    elements: number = 0;
    #hash_function: (key: string) => number;

    /**
     * Default hash function used when user does not specify their own
     * 
     * Based on Java's `hashCode`
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
     * Passes hash digest of key through modulo operation to get bucket index
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