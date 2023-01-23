enum TreeErrors {
    NO_TREENODE_GIVEN="If not removing by node value, must provide a TreeNode as to_remove argument"
}

export class TreeNode<T> {
    value: T;
    #children: TreeNode<T>[] = [];

    get children(): TreeNode<T>[] {
        return this.#children;
    }

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

    depth_first_search(value: T, strict: boolean=true): TreeNode<T>[] {
        let result: TreeNode<T>[] = [];

        if(strict) {
            if(value === this.value) result.push(this);
        } else {
            if(value == this.value) result.push(this);
        }

        this.#children.forEach(child => {
            result = [...result, ...child.depth_first_search(value, strict)];
        });

        return result;
    }

    // probably suboptimal
    breadth_first_search(value: T, strict: boolean=true): TreeNode<T>[] {
        let result: TreeNode<T>[] = [];

        if(strict) {
            if(value === this.value) result.push(this);
        } else {
            if(value == this.value) result.push(this);
        }

        this.children.forEach(child => {
            if(strict) {
                if(child.value === value) result.push(child);
            } else {
                if(child.value == value) result.push(child);
            }
        });

        this.children.forEach(child => {
            let child_res = child.breadth_first_search(value, strict);

            if(strict) {
                if(child.value === value) child_res = child_res.slice(1)
            } else {
                if(child.value == value) child_res = child_res.slice(1)
            }

            result = [...result, ...child_res];
        });

        return result;
    }

    constructor(initial_value: T, children: (TreeNode<T> | T)[]=[]) {
        this.value = initial_value;
        this.children = children;
    }
};

export class Tree<T> {
    root: TreeNode<T>;
    num_nodes: number = 0;

    constructor(root: T | TreeNode<T>) {
        if(root instanceof TreeNode) {
            this.root = root;
        } else {
            this.root = new TreeNode<T>(root);
        }

        this.num_nodes = 1 + this.root.children.length;
    }
};