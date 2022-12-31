const { Stack } = require("../data_structures/stack/Stack");

describe("basic usage", () => {
    it("works with strings", () => {
        const my_stack = new Stack("initial top");
        my_stack.push("hello");
        expect(my_stack.pop()).toBe("hello");
    })
});