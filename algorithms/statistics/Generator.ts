export type GeneratorConfig = {
    shouldLogValues?: boolean
};

/**
 * Abstract class for random number generators.
 */
export abstract class Generator { 
    /**
     * Whether or not to automatically log generated values.
     * 
     * If `true`, the history of generated values can be accessed with the `log` property. `false` by default.
     */
    #shouldLogValues: boolean;
    /**
     * When `shouldLogValues` is `true`, this contains all generated values. `null` otherwise.
     */
    #log: number[] | null;

    /**
     * Generates a single random sample. The implementation is distribution-specific. 
     */
    abstract generate_one(): number

    get log() {
        return this.#log;
    };
 
    /**
     * Generates an arbitrary number of samples.
     * @param num_samples The number of samples to generate. If not provided, generates one sample and returns a `number`.
     */
    generate(num_samples: number): number[]
    generate(): number

    generate<T extends number>(num_samples?: T): T extends number ? number[] : number  {
        if(typeof num_samples !== "undefined") {
            const result = Array(num_samples).fill(undefined).map(_=>this.generate_one()); // apparently the type assertion is needed?
            if(this.#shouldLogValues) this.#log = [...this.#log as number[], ...result];
            return result as any;
        }

        const result = this.generate_one();
        if(this.#shouldLogValues) this.#log = [...this.#log as number[], result];
        return result as any;
    }

    constructor({ shouldLogValues }: GeneratorConfig) {
        this.#shouldLogValues = !!shouldLogValues;
        this.#log = shouldLogValues ? [] : null;
    }
};