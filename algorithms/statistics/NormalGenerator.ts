export enum NormalGeneratorErrors {
    NONPOSITIVE_STD="You must supply a positive value for the standard deviation.",
    SPECIFIED_SAMPLES_WHEN_NOT_USING_IH="You must set methodID to 'IRWIN_HALL' to specify the # of uniform samples.",
    INVALID_IH_SAMPLES_NUMBER="The number of uniform samples for the Irwin-Hall method must be a positive integer."
}

export enum NormalGeneratorMethod {
    BOX_MULLER="BOX_MULLER",
    IRWIN_HALL="IRWIN_HALL"
};

export type NormalGeneratorConfig = {
    std: number;
    mean: number;
    methodID?: NormalGeneratorMethod;
    irwin_hall_samples?: number;
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
    /**
     * When using the Irwin-Hall generation method, this is the number of uniform samples taken.
     * `null` when not using the method.
     */
    #irwin_hall_samples: number | null;

    private _generate_one(): number {
        if(this.#methodID === NormalGeneratorMethod.BOX_MULLER) {
            return this._box_muller_generate();
        } if(this.#methodID === NormalGeneratorMethod.IRWIN_HALL) {
            return this._irwin_hall_generate();
        } else {
            return 0;
        }
    }

    generate(num_samples: number): number[]
    generate(): number

    generate<T extends number>(num_samples?: T): T extends number ? number[] : number  {
        if(typeof num_samples !== "undefined") {
            return Array(num_samples).fill(undefined).map(_=>this._generate_one()) as any; // apparently the type assertion is needed?
        }

        return this._generate_one() as any;
    }

    private _box_muller_generate() {
        const unif1 = Math.random();
        const unif2 = Math.random();

        return this.#mean + this.#std * Math.sqrt(-2 * Math.log(unif1)) * Math.cos(2 * Math.PI * unif2);
    };

    private _irwin_hall_generate() {
        const n: number = <number>this.#irwin_hall_samples;
        const samples_sum = Array(n).fill(null).map(_=>Math.random()).reduce((acc, curr) => acc+curr);

        return this.#std * Math.sqrt(3*n) * (2 * samples_sum / n - 1) + this.#mean;
    }

    constructor({ std, mean, methodID, irwin_hall_samples }: NormalGeneratorConfig) {
        if(std < 0) throw Error(NormalGeneratorErrors.NONPOSITIVE_STD);

        if(typeof irwin_hall_samples !== "undefined") {
            if(methodID !== "IRWIN_HALL") throw Error(NormalGeneratorErrors.SPECIFIED_SAMPLES_WHEN_NOT_USING_IH);
            if(!Number.isInteger(irwin_hall_samples) || irwin_hall_samples < 1) throw Error(NormalGeneratorErrors.INVALID_IH_SAMPLES_NUMBER);
        }

        this.#std = std;
        this.#mean = mean;
        this.#methodID = methodID ? methodID : NormalGeneratorMethod.BOX_MULLER;
        this.#irwin_hall_samples = (this.#methodID === NormalGeneratorMethod.IRWIN_HALL) ? ( irwin_hall_samples ? irwin_hall_samples : 12 ) : null
    }
};