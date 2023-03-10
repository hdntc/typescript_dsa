import { NormalGenerator, NormalGeneratorErrors, NormalGeneratorMethod } from "../algorithms/statistics/NormalGenerator";
import { std, avg } from "../algorithms/statistics/Essential";

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
        const generator = new NormalGenerator({std: 3, mean: 10, methodID: NormalGeneratorMethod.IRWIN_HALL, irwin_hall_samples: 15 });

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

    it("throws error when supplying invalid # of irwin-hall samples", () => {
        expect(()=> new NormalGenerator({
            std: 12, 
            mean: 10, 
            methodID: NormalGeneratorMethod.IRWIN_HALL, 
            irwin_hall_samples: -3 
        })).toThrow(NormalGeneratorErrors.INVALID_IH_SAMPLES_NUMBER);

        expect(()=> new NormalGenerator({
            std: 16, 
            mean: -100, 
            methodID: NormalGeneratorMethod.IRWIN_HALL, 
            irwin_hall_samples: 0
        })).toThrow(NormalGeneratorErrors.INVALID_IH_SAMPLES_NUMBER);

        expect(()=> new NormalGenerator({
            std: 1, 
            mean: 0, 
            methodID: NormalGeneratorMethod.IRWIN_HALL, 
            irwin_hall_samples: 1.7
        })).toThrow(NormalGeneratorErrors.INVALID_IH_SAMPLES_NUMBER);
    });

    it("throws error when supplying # of irwin-hall samples when irwin-hall method is not selected", () => {
        expect(()=> new NormalGenerator({
            std: 52, 
            mean: 100, 
            irwin_hall_samples: 10
        })).toThrow(NormalGeneratorErrors.SPECIFIED_SAMPLES_WHEN_NOT_USING_IH);
    });
});