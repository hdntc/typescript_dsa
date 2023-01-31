import { Generator, GeneratorConfig } from "./Generator";

export type ExponentialGeneratorConfig = {
    rate: number
} & GeneratorConfig;

export class ExponentialGenerator extends Generator {
    #rate: number;

    generate_one() {
        return -Math.log(Math.random())/this.#rate;
    }

    constructor({ rate, shouldLogValues }: ExponentialGeneratorConfig) {
        super({ shouldLogValues });
        this.#rate = rate;
    }
};