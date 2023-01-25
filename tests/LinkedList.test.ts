import { LinkedList, LLNode } from "../data_structures/linked_list/LinkedList";

describe("basic usage", () => {
    it("supports array initialization", () => {
        const my_array = [1,2,3];
        const my_ll = new LinkedList<number>(my_array);

        expect(my_ll?.head?.next?.value).toBe(2);
    });

    it("supports singleton initialization", () => {
        const my_ll = new LinkedList<number>(3);

        expect(my_ll?.head?.value).toBe(3);
        expect(my_ll?.head?.next).toBe(null);
    });

    it("supports traversal w/ array initialization", () => {
        const my_ll = new LinkedList<number>([1,2,3]);

        expect(my_ll.traverse()).toEqual([1,2,3]);
    });

    it("supports insertion", () => {
        const my_ll = new LinkedList<number>([1,2,3]);
        
        my_ll.insert(10, <LLNode<number>>my_ll.head);
        expect(my_ll.traverse()).toEqual([1,10,2,3]);
    });

    it("supports removal", () => {
        const my_ll = new LinkedList<string>(["hi","hello","goodbye"]);

        my_ll.remove((my_ll.head as LLNode<string>).next as LLNode<string>); // this is the "hello" node
        expect(my_ll.traverse()).toEqual(["hi","goodbye"])
    });

    it("supports index access", () => {
        const my_ll = new LinkedList<string>(["hello","goodbye","okay"]);

        expect(my_ll.access(2).value).toBe("okay");
    });

    it("throws error when trying to access large index", () => {
        const my_ll = new LinkedList<string>(["hi"]);

        expect(() => my_ll.access(3)).toThrow(Error("index out of range"));
    });

    it("throws error when trying to remove node not in LL", () => {
        const my_ll_A = new LinkedList<number>([1,2,3,4,5]);
        const my_ll_B = new LinkedList<number>([1,2,3]);

        my_ll_B.access(2).next = my_ll_A.access(0);
        expect(() => my_ll_A.remove(my_ll_B.access(0))).toThrow(Error("Node not present in linked list"));
    });

    it("correctly calculates length", () => {
        const my_ll = new LinkedList<number>([10,9,8]);

        expect(my_ll.length).toBe(3);
        my_ll.remove(my_ll.head as LLNode<number>);
        expect(my_ll.length).toBe(2);
        my_ll.insert(10, (my_ll.head as LLNode<number>).next as LLNode<number>);
        expect(my_ll.length).toBe(3);
    });

    it("actually correctly calculates length", () => {
        const my_ll = new LinkedList<number>(new LLNode(5, new LLNode(10)));

        expect(my_ll.length).toBe(2);
    });
});