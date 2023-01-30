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
        const average = avg(values);
        const standard_dev = std(values);

        expect(average).toBeGreaterThan(9.5);
        expect(average).toBeLessThan(10.5);
        expect(standard_dev).toBeGreaterThan(2.5);
        expect(standard_dev).toBeLessThan(3.5);
    });

    it("generates values that are somewhat reasonable wrt config (irwin-hall)", () => {
        const generator = new NormalGenerator({std: 3, mean: 10, methodID: NormalGeneratorMethod.IRWIN_HALL });

        const values: number[] = generator.generate(10000);

        const average = avg(values);
        const standard_dev = std(values);

        expect(average).toBeGreaterThan(9.5);
        expect(average).toBeLessThan(10.5);
        expect(standard_dev).toBeGreaterThan(2.5);
        expect(standard_dev).toBeLessThan(3.5);
    });

    it("throws error w/ invalid std config", () => {
        expect(()=> new NormalGenerator({std: -3, mean: 100, methodID: NormalGeneratorMethod.BOX_MULLER })).toThrow(NormalGeneratorErrors.NONPOSITIVE_STD);
    });
});