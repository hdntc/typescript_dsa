export class TreeNode<T> {
    value: T;
    children: TreeNode<T>[] = [];

    constructor(initial_value: T, children: TreeNode<T>[]=[]) {
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