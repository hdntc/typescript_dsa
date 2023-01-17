import { Hashmap, HashmapErrors } from "../data_structures/hashmap/Hashmap";

describe("basic usage", () => {
    it("supports initialization", () => {
        expect(() => {
            const my_hashmap = new Hashmap<number>([1,2,3], ["a", "b", "c"]);
        }).not.toThrow(Error);
    });

    it("does not support initialization w/ mismatched length of initial value & initial keys", () => {
        expect(() => {
            const my_hashmap = new Hashmap<string>(["a","b"], ["z", "y", "x"]);
        }).toThrow(Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH));
    });

    it("supports accessing", () => {
        const my_hashmap = new Hashmap<number>([1,2,3], ["jerry", "broxley", "jomble"]);

        expect(my_hashmap.access("jerry")).toEqual(1);
    });

    it("supports deletion", () => {
        const my_hashmap = new Hashmap<number>([10,9,8], ["archibald", "jordan", "jerome"]);
        
        expect(my_hashmap.access("jordan")).toBe(9);
        expect(my_hashmap.access("archibald")).toBe(10);
        expect(my_hashmap.access("jerome")).toBe(8);
        my_hashmap.delete("jordan");
        expect(() => my_hashmap.access("jordan")).toThrow(HashmapErrors.NONEXISTANT_KEY);
        expect(my_hashmap.access("archibald")).toBe(10);
        expect(my_hashmap.access("jerome")).toBe(8);
    });

    it("has 0 load factor when empty", () => {
        const my_hashmap = new Hashmap<number>([1], ["a"]);

        my_hashmap.delete("a");
        expect(my_hashmap.load_factor).toBe(0);
    });
});