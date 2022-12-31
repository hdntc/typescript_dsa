class Stack<T> {
    content: T[];
    pop(): T {
        return this.content.pop();
    };
    push(top: T): void {
        this.content.push(top);
    };
    constructor(initial: T[] | T | undefined) {
        if(initial instanceof Array) {
            this.content = initial;
        } else if (typeof initial === "undefined") {
            this.content = [  ];
        } else {
            this.content = [ initial ];
        }
    };
};

export { Stack };