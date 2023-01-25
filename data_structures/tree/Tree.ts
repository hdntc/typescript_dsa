enum TreeErrors {
    NO_TREENODE_GIVEN="If not removing by node value, must provide a TreeNode as to_remove argument"
}

/**
 * A node of a Tree.
 */
export class TreeNode<T> {
    value: T;
    #children: TreeNode<T>[] = [];
    
    get children(): TreeNode<T>[] {
        return this.#children;
    }

    /**
     * - You can specify a list of TreeNodes or raw values or a mix of both.
     * - Raw values will be converted to leaf nodes.
     */
    set children(new_children: (TreeNode<T> | T)[]) {
        this.#children = new_children.map(child => {
            if(child instanceof TreeNode) return child;
            return new TreeNode<T>(child);
        });
    }

    /**
     * Removes one or more child nodes. Does not recurse.
     * @param to_remove The value or node to remove.
     * 
     * - Specify a `TreeNode` when wanting to remove a specific node. 
     * 
     * - Specify a value of the generic type to remove any first-level children with the given value.
     * @param by_value Whether to remove children by value or by strict comparison between TreeNode objects. 
     * `to_remove` must be a TreeNode if false. When `to_remove` is a TreeNode and this is `true`, removes first-level children based on the value of the given node.
     * @returns The new list of children.
     */
    remove(to_remove: TreeNode<T> | T, by_value: boolean=false): TreeNode<T>[] {
        if(by_value) {
            if(to_remove instanceof TreeNode) {
                this.children = this.children.filter(x => x.value !== to_remove.value);
            } else {
                this.children = this.children.filter(x => x.value !== to_remove);
            }
        } else {
            if(!(to_remove instanceof TreeNode)) {
                throw Error(TreeErrors.NO_TREENODE_GIVEN);
            }

            this.children = this.children.filter(x => x !== to_remove);
        }

        return this.children;
    }

    /**
     * Performs a depth-first filter on the tree generated by the node.
     * @param filter The filter function to use. 
     * @returns An array of TreeNodes that match the filter function provided in DFS order.
     */
    depth_first_filter(filter: (_: TreeNode<T>) => boolean): TreeNode<T>[] {
        let result: TreeNode<T>[] = [];

        if(filter(this)) result.push(this);

        this.#children.forEach(child => {
            result = [...result, ...child.depth_first_filter(filter)];
        });

        return result;
    }

    /**
     * Performs a breadth-first filter on the tree generated by the node.
     * @param filter The filter function to use. 
     * @returns An array of TreeNodes that match the filter function provided in BFS order.
     * @todo The implementation is probably suboptimal.
     */
     breadth_first_filter(filter: (_: TreeNode<T>) => boolean): TreeNode<T>[] {
        let result: TreeNode<T>[] = [];

        if(filter(this)) result.push(this);

        this.children.forEach(child => {
            if(filter(child)) result.push(child);
        });

        this.children.forEach(child => {
            let child_res = child.breadth_first_filter(filter);

            if(filter(this)) child_res = child_res.slice(1);

            result = [...result, ...child_res];
        });

        return result;
    }

    /**
     * Performs a {@link https://en.wikipedia.org/wiki/Depth-first_search depth-first search} for the given value.
     * @param value The value to compare against.
     * @param strict Whether to do strict (===) or loose (==) comparsion. Defaults to `true` (strict).
     * @returns An array of tree nodes with the given `value`, appearing in order they were found in the depth-first search.
     */
    depth_first_search(value: T, strict: boolean=true): TreeNode<T>[] {
        if(strict) {
            return this.depth_first_filter(node => value === node.value);
        } else {
            return this.depth_first_filter(node => value == node.value);
        }
    }

    /**
     * Performs a {@link https://en.wikipedia.org/wiki/Breadth-first_search breadth-first search} for the given value.
     * @param value The value to compare against.
     * @param strict Whether to do strict (===) or loose (==) comparsion. Defaults to `true` (strict).
     * @returns An array of tree nodes with the given `value`, appearing in order they were found in the breadth-first search.
     */
    breadth_first_search(value: T, strict: boolean=true): TreeNode<T>[] {
        if(strict) {
            return this.depth_first_filter(node => value === node.value);
        } else {
            return this.depth_first_filter(node => value == node.value);
        }
    }

    /**
     * @param initial_value Satellite data of the node.
     * @param children An array of children of the node.
     * `children` can be an array of nodes or raw values or both. Raw values will be converted to leaves.
     */
    constructor(initial_value: T, children: (TreeNode<T> | T)[]=[]) {
        this.value = initial_value;
        this.children = children;
    }
};