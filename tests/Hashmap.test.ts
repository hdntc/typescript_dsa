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

    it("supports access w/ number-key", () => {
        const my_hashmap = new Hashmap<string>(["jeremy", "davis", "paul"], [10,9,5]);

        my_hashmap.buckets.forEach((x) => {
            if(x) {console.log(x.traverse())}
        });

        expect(my_hashmap.access(10)).toBe("jeremy");
        expect(my_hashmap.access(9)).toBe("davis");
        expect(my_hashmap.access(5)).toBe("paul");
    });

    it("supports deletion w/ number key", () => {
        const my_hashmap = new Hashmap<{name: string}>([{name: "jerry"}, {name: "jack"}], [4,3]);

        my_hashmap.delete(4);
        expect(my_hashmap.elements).toBe(1);
    })

    it("supports insertion w/ number key", () => {
        const my_hashmap = new Hashmap<string>(["jeremy", "davis", "paul"], [10,9,5]);

        my_hashmap.insert("jackson", 11);

        my_hashmap.buckets.forEach((b) => {
            if(b) {
                console.log(b.traverse())
            }
        });

        expect(my_hashmap.access(11)).toBe("jackson");
    });

    it("supports rehashing", () => {
        const my_hashmap = new Hashmap<string>(["jeremy", "davis", "paul"], [10,9,5]);
        my_hashmap.rehash(1);
        expect(my_hashmap.load_factor).toBe(1);
    });

    it("supports dynamic rehashing", () => {
        const my_hashmap = new Hashmap<number>([1,2,3], [4,5,6],undefined,undefined,true,0.6,0.75);

        console.log(my_hashmap.valid_elements_range, my_hashmap.buckets)
    });
});