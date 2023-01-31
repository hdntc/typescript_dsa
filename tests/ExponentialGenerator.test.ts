import { ExponentialGenerator, ExponentialGeneratorConfig, ExponentialGeneratorErrors } from "../algorithms/statistics/ExponentialGenerator";

describe("Basic usage", () => {
    it("Supports initialization (shouldLogValues false)", () => {
        expect(() => { const my_generator = new ExponentialGenerator({ rate: 3, shouldLogValues: false }) }).not.toThrow(Error);
    });

    it("Supports initialization (shouldLogValues true)", () => {
        expect(() => { const my_generator = new ExponentialGenerator({ rate: 3, shouldLogValues: true }) }).not.toThrow(Error);
    });

    it("Supports initialization (shouldLogValues not specified)", () => {
        expect(() => { const my_generator = new ExponentialGenerator({ rate: 3 }) }).not.toThrow(Error);
    });

    it("Does not support negative or zero rate", () => {
        expect(() => { const my_generator = new ExponentialGenerator({ rate: -2 }) }).toThrow(Error(ExponentialGeneratorErrors.INVALID_RATE));
        expect(() => { const my_generator = new ExponentialGenerator({ rate: 0 }) }).toThrow(Error(ExponentialGeneratorErrors.INVALID_RATE));
    });
});