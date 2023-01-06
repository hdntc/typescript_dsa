import { Queue } from "../data_structures/queue/Queue";

describe("basic usage", () => {
    it("supports singleton initialization", () => {
        const my_queue = new Queue(5);

        expect(my_queue.head.value).toBe(5);
        expect(my_queue.rear.value).toBe(5);
    }); 
});