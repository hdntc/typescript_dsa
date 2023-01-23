export class TreeNode<T> {
    value: T;
    children: TreeNode<T>[] = [];

    constructor(initial_value: T, children: (TreeNode<T> | T)[]=[]) {
        this.value = initial_value;

        const new_children = children.map(child => {
            if(child instanceof TreeNode) return child;
            return new TreeNode<T>(child);
        })

        this.children = new_children;
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