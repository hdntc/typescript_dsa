/**
 * Stack class.
 * 
 * Implements {@link Stack.push push} and {@link Stack.pop pop}.
 * 
 * @template T The type of the satellite data.
 */
class Stack<T> {
    /**
     * The content of the stack. 
     * 
     * The last element is the the top of the stack.
     */
    content: T[] = [];
    /**
     * Pops off of the stack.
     * 
     * @returns The former top of the stack.
     */
    pop(): T {
        if(this.content.length === 0) {
            throw Error("Stack is empty");
        } else {
            return this.content.pop() as T; // this as is safe b.c. pop() only returns undefined when array is empty
        }
    };
    /**
     * Pushes onto the stack.
     * 
     * @param top The new top of the stack.
     */
    push(top: T): void {
        this.content.push(top);
    };
    /**
     * @constructor
     * @param initial The value(s) with which to initialize the stack. An array will create a stack w/ the last element being the top of the stack. If no value provided, creates an empty stack.
     */
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