export enum NormalGeneratorErrors {
    NONPOSITIVE_STD="You must supply a positive value for the standard deviation."
}

export enum NormalGeneratorMethod {
    BOX_MULLER,
};

export type NormalGeneratorConfig = {
    std: number;
    mean: number;
    methodID?: NormalGeneratorMethod
};

/**
 * A class for generating samples from a normally distributed RV.
 */
export class NormalGenerator {
    /**
     * Standard deviation.
     */
    #std: number;
    /**
     * The mean of the normal distribution.
     */
    #mean: number;
    /**
     * The method to use to generate the sample.
     */
    #methodID: NormalGeneratorMethod;

    private _generate_one(): number {
        if(this.#methodID === NormalGeneratorMethod.BOX_MULLER) {
            return this._box_muller_generate()
        } else {
            return 0;
        }
    }

    generate(num_samples: number): number[]
    generate(): number

    generate<T extends number>(num_samples?: T): T extends number ? number[] : number  {
        if(typeof num_samples !== "undefined") {
            return Array(num_samples).fill(undefined).map(_=>this._generate_one()) as any; // apparently the type assertion is needed
        }

        return this._generate_one() as any;
    }

    private _box_muller_generate() {
        const unif1 = Math.random();
        const unif2 = Math.random();

        return this.#mean + this.#std * Math.sqrt(-2 * Math.log(unif1)) * Math.cos(2 * Math.PI * unif2);
    };

    constructor({ std, mean, methodID }: NormalGeneratorConfig) {
        if(std < 0) throw Error(NormalGeneratorErrors.NONPOSITIVE_STD);

        this.#std = std;
        this.#mean = mean;
        this.#methodID = methodID ? methodID : NormalGeneratorMethod.BOX_MULLER;
    }
};