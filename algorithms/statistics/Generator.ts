export abstract class Generator { 
    abstract _generate_one(): number
 
    generate(num_samples: number): number[]
    generate(): number

    generate<T extends number>(num_samples?: T): T extends number ? number[] : number  {
        if(typeof num_samples !== "undefined") {
            return Array(num_samples).fill(undefined).map(_=>this._generate_one()) as any; // apparently the type assertion is needed?
        }

        return this._generate_one() as any;
    }

    constructor() {
        
    }
};