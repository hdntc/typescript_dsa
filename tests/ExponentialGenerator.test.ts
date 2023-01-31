import { ExponentialGenerator, ExponentialGeneratorConfig } from "../algorithms/statistics/ExponentialGenerator";

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
});