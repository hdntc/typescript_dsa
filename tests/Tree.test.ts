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

    it("supports dfs (nodes found)", () => {
        const my_node = new TreeNode<number>(5, [5, 7, new TreeNode(10, [5, 7, 2, 5])]);

        const dfs_result: TreeNode<number>[] = my_node.depth_first_search(5, true);

        expect([
            my_node === dfs_result[0],
            my_node.children[0] === dfs_result[1],
            my_node.children[2].children[0] === dfs_result[2],
            my_node.children[2].children[3] === dfs_result[3]
        ].every(x => x===true)).toBe(true);
    })

    it("supports dfs (node not found)", () => {
        const my_node = new TreeNode<number>(5);

        const dfs_result: TreeNode<number>[] = my_node.depth_first_search(3);

        expect(dfs_result).toEqual([]);
    });

    it("supports bfs (found)", () => {
        const my_node = new TreeNode<string>("a", [new TreeNode<string>("a", ["b", "d"]), "a", "c"]);

        const bfs_result = my_node.breadth_first_search("a");

        expect([
            my_node === bfs_result[0],
            my_node.children[0] === bfs_result[1],
            my_node.children[1] === bfs_result[2]
        ].every(x=>x===true)).toBe(true);
    });

    it("supports bfs (not found)", () => {
        const my_node = new TreeNode<string>("a", [new TreeNode<string>("a", ["b", "d"]), "a", "c"]);

        const bfs_result = my_node.breadth_first_search("e");

        expect(bfs_result).toEqual([]);
    });
});