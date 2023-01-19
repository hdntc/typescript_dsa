import { LLNode, LinkedList, notLLNode } from "../linked_list/LinkedList";

/**
 * This inherits from {@link LinkedList} with two extra properties for a {@link Queue.rear rear node} and {@link Queue.maxLength max length}.
 * 
 * It also implements common actions on queues such as {@link Queue.enqueue enqueue} and {@link Queue.dequeue dequeue}.
 * 
 * @template T The type of the satellite data.
 */
class Queue<T> extends LinkedList<T> {
    /**
     * Represents the last item in the queue.
     * 
     * This value changes when {@link Queue.enqueue enqueue} is called.
     */
    rear: LLNode<T>;
    /**
     * The maximum number of items in the queue at any given time.
     * 
     * If `null`, there will be no restriction to the number of items.
     */
    maxLength: null | number;
    /**
     * @constructor
     * @param initial The initial value(s) with which to initialize the queue. See {@link LinkedList}.
     * @param maxLength The maximum number of items in the queue. If not provided, there will be no limit.
     * @throws When an invalid value for maxLength is provided.
     */
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

        this.rear = this.access(this.length-1);
    }

    /**
     * Places a new value in the queue. 
     * 
     * This inserts a new {@link LLNode} after the current rear.
     * 
     * To enqueue at an arbitrary position in the queue, see {@link LinkedList.insert}
     * @param value The value to enqueue.
     * @throws Throws when trying to add to a full queue.
     */
    enqueue(value: T): void {
        if(this.length === this.maxLength) {
            throw Error("Queue at maximum capacity");
        } else {
            const newRear = new LLNode(value);
            this.rear.next = newRear;
            newRear.prev = this.rear;
            this.rear = newRear;
        }
    };

    /**
     * Dequeues the head of the queue.
     * 
     * @throws When the queue is already empty.
     */
    dequeue(): void {
        if(!this.head) {
            throw Error("dequeueing empty queue");
        }

        if(this.head.next) {
            this.head.next.prev = null;
        } 

        this.head = this.head.next;
    }
};

export { Queue };