class Stack<T> {
    content: T[] = [];
    pop(): T {
        if(this.content.length === 0) {
            throw Error("Stack is empty");
        } else {
            return this.content.pop();
        }
    };
    push(top: T): void {
        this.content.push(top);
    };
    constructor(initial?: T[] | T ) {
        if(initial instanceof Array) {
            this.content = initial;
        } else if(typeof initial !== "undefined") {
            this.content = [ initial ];
        } else {
            this.content = [  ];
        }
    };
};

export { Stack };