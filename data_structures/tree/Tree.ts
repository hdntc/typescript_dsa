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

    depth_first_search(value: T, strict: boolean=true): TreeNode<T>[] {
        let result: TreeNode<T>[] = [];

        if(strict) {
            if(value === this.value) result.push(this);
        } else {
            if(value == this.value) result.push(this);
        }

        this.#children.forEach(child => {
            result = [...result, ...child.depth_first_search(value, true)];
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