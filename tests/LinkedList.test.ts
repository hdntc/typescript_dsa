import { LinkedList, LLNode } from "../data_structures/linked_list/LinkedList";

describe("basic usage", () => {
    it("supports array initialization", () => {
        const my_array = [1,2,3];
        const my_ll = new LinkedList<number>(my_array);

        expect(my_ll.head.next.value).toBe(2);
    });

    it("supports singleton initialization", () => {
        const my_ll = new LinkedList<number>(3);

        expect(my_ll.head.value).toBe(3);
        expect(my_ll.head.next).toBe(null);
    });

    it("supports traversal w/ array initialization", () => {
        const my_ll = new LinkedList<number>([1,2,3]);

        expect(my_ll.traverse()).toEqual([1,2,3]);
    });

    it("supports insertion", () => {
        const my_ll = new LinkedList<number>([1,2,3]);
        
        my_ll.insert(10, my_ll.head);
        expect(my_ll.traverse()).toEqual([1,10,2,3]);
    });
});