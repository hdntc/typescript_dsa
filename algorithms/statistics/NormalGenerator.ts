export enum NormalGeneratorMethod {
    BOX_MULLER,
};

export type NormalGeneratorConfig = {
    std: number;
    mean: number;
    methodID?: NormalGeneratorMethod
};

export class NormalGenerator {
    #std: number;
    #mean: number;
    #methodID: NormalGeneratorMethod;

    generate() {
        switch(this.#methodID) {
            case NormalGeneratorMethod.BOX_MULLER: return this._box_muller_generate();
            default: break;
        }
    }

    private _box_muller_generate() {
        const unif1 = Math.random();
        const unif2 = Math.random();

        return this.#mean + this.#std * Math.sqrt(-2 * Math.log(unif1)) * Math.cos(2 * Math.PI * unif2);
    };

    constructor({ std, mean, methodID }: NormalGeneratorConfig) {
        this.#std = std;
        this.#mean = mean;
        this.#methodID = methodID ? methodID : NormalGeneratorMethod.BOX_MULLER;
    }
};