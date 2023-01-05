import { LinkedList, LLNode } from "../data_structures/linked_list/LinkedList";

describe("basic usage", () => {
    it("supports array initialization", () => {
        const my_array = [1,2,3];
        const my_ll = new LinkedList(my_array);

        expect(my_ll.head.next.value).toBe(2);
    });

    it("supports singleton initialization", () => {
        const my_ll = new LinkedList(3);

        expect(my_ll.head.value).toBe(3);
        expect(my_ll.head.next).toBe(null);
    });

    it("supports traversal w/ array initialization", () => {
        const my_ll = new LinkedList([1,2,3]);
        console.log(my_ll.traverse());

        expect(my_ll.traverse()).toEqual([1,2,3]);
    });
});