import { Generator, GeneratorConfig } from "./Generator";

export enum ExponentialGeneratorErrors {
    INVALID_RATE="The rate must be positive."
};

export type ExponentialGeneratorConfig = {
    rate: number
} & GeneratorConfig;

export class ExponentialGenerator extends Generator {
    #rate: number;

    generate_one() {
        return -Math.log(Math.random())/this.#rate;
    }

    constructor({ rate, shouldLogValues }: ExponentialGeneratorConfig) {
        if(rate <= 0) throw Error(ExponentialGeneratorErrors.INVALID_RATE);

        super({ shouldLogValues });
        this.#rate = rate;
    }
};