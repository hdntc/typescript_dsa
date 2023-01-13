export enum HashmapErrors {
    INIT_ARRAY_LENGTH_MISMATCH="The array of initial_keys must be the same length as the array of initial_values",
    INIT_ARRAY_TYPE_MISMATCH="If initial_keys is an array, then initial_values must also be an array"
};

export class Hashmap<T> {
    //currently only supports strings for keys
    values: T[] = [];
    keys: string[] = [];
    #hash_function: (key: string) => number;

    private _default_hash_function(key: string): number {
        // return hashed representation of key parameter
        // the return value is NOT the array index of the value, (return value) % this.values.length is
        // based on Java's hashCode
        var hash = 0;
        var i = 0;
        var len = key.length;

        while(i < len) {
            hash = ((hash << 5) - hash + key.charCodeAt(i++)) << 0; // hash <- 31 * hash + (current character code)
        }

        return hash;
    }
    
    constructor(initial_values: T[], initial_keys: string[], hash_function?: (string) => number) {
        if(!(initial_values instanceof Array)) {
            throw Error(HashmapErrors.INIT_ARRAY_TYPE_MISMATCH);
        } 
        
        if(initial_values.length !== initial_keys.length) {
            throw Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH);
        }
        
        this.values = [...initial_values];
        this.keys = [...initial_keys];

        if(typeof hash_function === "undefined") {
            this.#hash_function = this._default_hash_function;
        } else {
            this.#hash_function = hash_function;
        }
    };
};