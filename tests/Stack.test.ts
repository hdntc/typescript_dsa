import { Stack } from "../data_structures/stack/Stack";

describe("basic stack usage", () => {
    it("works with strings", () => {
        const my_stack = new Stack("initial top");
        my_stack.push("hello");
        expect(my_stack.pop()).toBe("hello");
    });

    it("works with undefined initial value", () => {
        const my_stack = new Stack<number>();
        expect(() => my_stack.pop()).toThrow(Error);
    });

    it("generates reversed array by repeated popping", () => {
        const content: any[] = [1, 2, 3, "hi", "hello", 3, 3];
        let new_array = [];
        const my_stack = new Stack<any>([1, 2, 3, "hi", "hello", 3, 3]);
        
        while(my_stack.content.length > 0) {
            new_array.push(my_stack.pop());
        };
        
        expect(new_array).toEqual(content.reverse());
    });
});