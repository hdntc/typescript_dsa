import { LLNode, LinkedList, notLLNode } from "../linked_list/LinkedList";

class Queue<T> extends LinkedList<T> {
    // head -> head.next -> ... -> rear.prev -> rear
    rear: LLNode<T>;
    maxLength: null | number;
    constructor(initial: notLLNode<T>[] | notLLNode<T> | LLNode<T>, maxLength?: number) {
        super(initial);

        if(maxLength !== undefined) {
            if(!Number.isInteger(maxLength)) {
                throw Error("maxLength must be a positive integer or undefined");
            } 
            if(maxLength < 1) {
                throw Error("maxLength must be a positive integer or undefined");
            }
            if(initial instanceof Array && maxLength < initial.length) {
                throw Error("maxLength must be greater than the length of the provided initial array");
            }
            this.maxLength = maxLength;
        } else {
            this.maxLength = null;
        }

        this.rear = this.access(this.length()-1);
    }

    enqueue(value: T): void {
        if(this.length() === this.maxLength) {
            throw Error("Queue at maximum capacity");
        } else {
            const newRear = new LLNode(value);
            this.rear.next = newRear;
            newRear.prev = this.rear;
            this.rear = newRear;
        }
    };

    dequeue(): void {
        this.head.prev.next = null;
        this.head = this.head.prev;
    }
};

export { Queue };