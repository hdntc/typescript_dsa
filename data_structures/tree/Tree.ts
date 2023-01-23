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

    constructor(initial_value: T, children: (TreeNode<T> | T)[]=[]) {
        this.value = initial_value;
        this.children = children;
    }
};

export class Tree<T> {
    root: TreeNode<T>;

    constructor(root: T | TreeNode<T>) {
        if(root instanceof TreeNode) {
            this.root = root;
        } else {
            this.root = new TreeNode<T>(root);
        }
    }
};