import { Generator, GeneratorConfig } from "./Generator";

type ExponentialGeneratorConfig = {
    rate: number
} & GeneratorConfig;

class ExponentialGenerator extends Generator {
    #rate: number;

    generate_one() {
        return -Math.log(Math.random())/this.#rate;
    }

    constructor({ rate, shouldLogValues }: ExponentialGeneratorConfig) {
        super({ shouldLogValues });
        this.#rate = rate;
    }
};