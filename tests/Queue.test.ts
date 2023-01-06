import { Queue } from "../data_structures/queue/Queue";

describe("basic usage", () => {
    it("supports singleton initialization", () => {
        const my_queue = new Queue(5);

        expect(my_queue.head.value).toBe(5);
        expect(my_queue.rear.value).toBe(5);
    });

    it("supports maximum length", () => {
        const my_queue = new Queue<number>([1,2,3,4], 4);

        expect(() => my_queue.enqueue(5)).toThrow(Error("Queue at maximum capacity"));
    });
});