import { Generator } from "./Generator";

type ExponentialGeneratorConfig = {
    rate: number
};

class ExponentialGenerator extends Generator {
    #rate: number;

    generate_one() {
        return -Math.log(Math.random())/this.#rate;
    }

    constructor({ rate }: ExponentialGeneratorConfig) {
        super();
        this.#rate = rate;
    }
};