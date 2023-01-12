export enum HashmapErrors {
    INIT_ARRAY_LENGTH_MISMATCH="The array of initial_keys must be the same length as the array of initial_values",
    INIT_ARRAY_TYPE_MISMATCH="If initial_keys is an array, then initial_values must also be an array"
};

type PossibleInitialKeys = string | string[];
type PossibleInitialValues<T, IK> = IK extends Array<string> ? T[] | T[][] : T | T[];

export class Hashmap<T> {
    values: T[] = [];
    keys: string[] = [];
    
    constructor(initial_values: T[], initial_keys: string[], hash_function: (string) => number) {
        if(!(initial_values instanceof Array)) {
            throw Error(HashmapErrors.INIT_ARRAY_TYPE_MISMATCH);
        } 
        
        if(initial_values.length !== initial_keys.length) {
            throw Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH);
        }
        
        this.values = [...initial_values];
        this.keys = [...initial_keys];
    };
};