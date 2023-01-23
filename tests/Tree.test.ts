import { Tree, TreeNode } from "../data_structures/tree/Tree";

describe("basic usage", () => {
    it("supports initialzation", () => {
        const my_tree = new Tree<number>(5);

        expect(my_tree.root.value).toBe(5);
        expect(my_tree.root.children.length).toBe(0);
    });

    it("supports children", () => {
        const my_node = new TreeNode<number>(5, [1, 3, 5, new TreeNode(2), new TreeNode(5)]);
        const my_tree = new Tree<number>(my_node);

        expect(my_tree.root.children.map(child => child.value)).toEqual([1,3,5,2,5]);
    });
});