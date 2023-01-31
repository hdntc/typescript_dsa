import { avg, std, vnc } from "../algorithms/statistics/Essential";

describe("basic usage", () => {
    it("computes avg correctly", () => {
        expect(avg([1,2,3])).toBe(2);
        expect(avg([])).toBe(0);
        expect(avg([1,1,1])).toBe(1);
        expect(avg([1.5,2.5,3.5])).toBe(2.5);
    }); 

    it("computes std correctly", () => {
        expect(std([1,2,3])).toBeCloseTo(0.8164);
        expect(std([1,2,3], false)).toBeCloseTo(0.8164);
        expect(std([1,2,3], true)).toBeCloseTo(1);
        expect(std([])).toBe(0);
        expect(std([], false)).toBe(0);
        expect(std([], true)).toBe(0);
        expect(std([-1023, 32409, 592])).toBeCloseTo(15393.46304);
        expect(std([-100000, -2302, 95052934], false)).toBeCloseTo(44832513.36);
        expect(std([1], true)).toBeCloseTo(0);
    });

    it("computes vriance correctly", () => {
        expect(vnc([1,2,3])).toBeCloseTo(0.667);
        expect(vnc([1,2,3], false)).toBeCloseTo(0.667);
        expect(vnc([1,2,3], true)).toBeCloseTo(1);
        expect(vnc([])).toBe(0);
        expect(vnc([], false)).toBe(0);
        expect(vnc([], true)).toBe(0);
        expect(vnc([100, 300, -500], true)).toBeCloseTo(173333.333);
        expect(vnc([1], true)).toBeCloseTo(0);
    });
});