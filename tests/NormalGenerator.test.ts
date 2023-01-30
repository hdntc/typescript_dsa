import { NormalGenerator, NormalGeneratorErrors, NormalGeneratorMethod } from "../algorithms/statistics/NormalGenerator";

const avg = (nums: number[]) => {
    return nums.reduce((acc, curr) => acc + curr) / nums.length;
}

const std = (nums: number[]) => {
    return Math.sqrt(nums.map(x => Math.pow(x - avg(nums), 2)).reduce((a, b) => a + b) / nums.length);
}

describe("basic usage", () => {
    it("generates values that are somewhat reasonable wrt config (box muller)", () => {
        const generator = new NormalGenerator({std: 3, mean: 10, methodID: NormalGeneratorMethod.BOX_MULLER });

        const values: number[] = generator.generate(1000);

        expect(avg(values)).toBeGreaterThan(9.5);
        expect(avg(values)).toBeLessThan(10.5);
        expect(std(values)).toBeGreaterThan(2.5);
        expect(std(values)).toBeLessThan(3.5);
    });

    it("throws error w/ invalid std config", () => {
        expect(()=> new NormalGenerator({std: -3, mean: 100, methodID: NormalGeneratorMethod.BOX_MULLER })).toThrow(NormalGeneratorErrors.NONPOSITIVE_STD);
    });
});