import { Hashmap, HashmapErrors } from "../data_structures/hashmap/Hashmap";

describe("basic usage", () => {
    it("supports initialization", () => {
        expect(() => {
            const my_hashmap = new Hashmap<number>({
                initial_values: [1,2,3],
                initial_keys: ["a","b","c"]
            })
        }).not.toThrow(Error);
    });

    it("does not support initialization w/ mismatched length of initial value & initial keys", () => {
        expect(() => {
            const my_hashmap = new Hashmap<string>({
                initial_keys: ["a","b"],
                initial_values: ["b","d","e"]
            });
        }).toThrow(Error(HashmapErrors.INIT_ARRAY_LENGTH_MISMATCH));
    });

    it("supports accessing", () => {
        const my_hashmap = new Hashmap<number>({
            initial_values: [1,2,3],
            initial_keys: ["jerry", "broxley", "jomble"]
        });

        expect(my_hashmap.access("jerry")).toEqual(1);
    });

    it("supports deletion", () => {
        const my_hashmap = new Hashmap<number>({
            initial_values: [10,9,8],
            initial_keys: ["archibald","jordan","jerome"]
        });
        
        expect(my_hashmap.access("jordan")).toBe(9);
        expect(my_hashmap.access("archibald")).toBe(10);
        expect(my_hashmap.access("jerome")).toBe(8);
        my_hashmap.delete("jordan");
        expect(() => my_hashmap.access("jordan")).toThrow(HashmapErrors.NONEXISTANT_KEY);
        expect(my_hashmap.access("archibald")).toBe(10);
        expect(my_hashmap.access("jerome")).toBe(8);
    });

    it("has 0 load factor when empty", () => {
        const my_hashmap = new Hashmap<number>({
            initial_keys: ["a"],
            initial_values: [1]
        });

        my_hashmap.delete("a");
        expect(my_hashmap.load_factor).toBe(0);
    });

    it("supports access w/ number-key", () => {
        const my_hashmap = new Hashmap<string>({
            initial_values: ["jeremy", "davis", "paul"],
            initial_keys: [10,9,5]
        })

        expect(my_hashmap.access(10)).toBe("jeremy");
        expect(my_hashmap.access(9)).toBe("davis");
        expect(my_hashmap.access(5)).toBe("paul");
    });

    it("supports deletion w/ number key", () => {
        const my_hashmap = new Hashmap({
            initial_values: [{name: "jerry"}, {name: "jack"}],
            initial_keys: [4,3]
        })

        my_hashmap.delete(4);
        expect(my_hashmap.elements).toBe(1);
    })

    it("supports insertion w/ number key", () => {
        const my_hashmap = new Hashmap<string>({
            initial_values: ["jeremy", "davis", "paul"],
            initial_keys: [10,9,5]
        })

        my_hashmap.insert("jackson", 11);

        expect(my_hashmap.access(11)).toBe("jackson");
    });

    it("supports rehashing", () => {
        const my_hashmap = new Hashmap<string>({
            initial_values: ["jeremy", "davis", "paul"],
            initial_keys: [10,9,5]
        })

        my_hashmap.rehash(1);
        expect(my_hashmap.load_factor).toBe(1);
    });

    it("supports dynamic rehashing", () => {
        const my_hashmap = new Hashmap<number>({
            initial_values: [1,2,3], 
            initial_keys: [4,5,6],
            enable_dynamic_rehashing: true,
            min_load_factor: 0.6,
            max_load_factor: 0.75
        });
        my_hashmap.insert(10, 3);
        my_hashmap.insert(15, 19);
        my_hashmap.insert(12, 30);
        my_hashmap.insert(10, 35);
    });
});