class TreeNode<T> {
    value: T;
    children: TreeNode<T>[] = [];

    constructor(initial_value: T, children: TreeNode<T>[]=[]) {
        this.value = initial_value;
        this.children = children;
    }
};

class Tree<T> {
    root: TreeNode<T>;
    
    constructor(initial: T | TreeNode<T>) {
        if(initial instanceof TreeNode) {
            this.root = initial;
        } else {
            this.root = new TreeNode<T>(initial);
        }
    }
};