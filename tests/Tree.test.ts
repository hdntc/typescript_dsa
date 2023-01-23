import { Tree, TreeNode } from "../data_structures/tree/Tree";

describe("basic usage", () => {
    it("supports initialzation", () => {
        const my_tree = new Tree<number>(5);

        expect(my_tree.root.value).toBe(5);
        expect(my_tree.root.children.length).toBe(0);
    });
});