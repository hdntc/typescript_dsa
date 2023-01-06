import { Queue } from "../data_structures/queue/Queue";

describe("basic usage", () => {
    it("supports singleton initialization", () => {
        const my_queue = new Queue(5);

        expect(my_queue.head.value).toBe(5);
        expect(my_queue.rear.value).toBe(5);
    });

    it("supports enqueueing", () => {
        const my_queue = new Queue<string>(["Jeremy", "John", "Jackson"]);

        my_queue.enqueue("Jimbly");
        expect(my_queue.traverse()).toEqual(["Jeremy", "John", "Jackson", "Jimbly"]);
    });

    it("supports maximum length", () => {
        const my_queue = new Queue<number>([1,2,3,4], 4);

        expect(() => my_queue.enqueue(5)).toThrow(Error("Queue at maximum capacity"));
    });

    it("supports dequeueing", () => {
        const my_queue = new Queue<number>([10,5,3,2]);

        my_queue.dequeue();
        expect(my_queue.traverse()).toEqual([5,3,2]);
    });

    it("does not support creation w/ invalid maximum length", () => {
        // maxLength argument that isnt type number | undefined will be caught by ts 
        expect(() => { const my_failed_queue_A = new Queue<number>(5, 0) })
        .toThrow(Error("maxLength must be a positive integer or undefined"));

        expect(() => { const my_failed_queue_B = new Queue<number>([5,2], 0.7) })
        .toThrow(Error("maxLength must be a positive integer or undefined"));

        expect(() => { const my_failed_queue_C = new Queue<number>([5,2], -15) })
        .toThrow(Error("maxLength must be a positive integer or undefined"));

        expect(() => { const my_failed_queue_D = new Queue<number>([5,2,10,5], 2) })
        .toThrow(Error("maxLength must be greater than the length of the provided initial array"));
    });
});