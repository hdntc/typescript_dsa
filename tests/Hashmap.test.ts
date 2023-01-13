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
});