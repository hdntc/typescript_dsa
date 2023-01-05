import { isNamedExportBindings } from "typescript";

class LLNode<T> {
    next: LLNode<T> | null;
    value: T;
    constructor(value: T, next: LLNode<T> | null = null) {
        this.value = value;
        this.next = next;
    };
};

// the use of notLLNode in the LinkedList constructor ensures that user doesnt
// erroneously try to construct LL with an array of nodes (the head suffices)
type notLLNode<T> = T extends LLNode<any> ? never : T; 

class LinkedList<T> {
    head: LLNode<T>;
    constructor(initial: notLLNode<T>[] | notLLNode<T> | LLNode<T>) {
        if(initial instanceof Array) {
            const nodification = initial.map(element => new LLNode(element));
            
            for(var i=0; i<nodification.length-1; i++) {
                nodification[i].next = nodification[i+1];
            }

            this.head = nodification[0];
        } else if(initial instanceof LLNode) {
            this.head = {...initial};
        } else {
            this.head = new LLNode(initial);
        }
    };

    traverse(): T[] {
        const result = [this.head.value];
        let current = this.head;

        while(current.next) {
            result.push(current.next.value);
            current = current.next;
        };
        
        return result;
    };

    insert(nodeValue: T, insertAfter: LLNode<T>): void {
        // places new node w/ value nodeValue after insertAfter node
        const oldAfter: LLNode<T> | null = insertAfter.next;
        insertAfter.next = new LLNode(nodeValue, oldAfter);
    };

    remove(node: LLNode<T>): void {
        // node must be the exact object and not a copy or other
        if(node === this.head) {
            this.head = this.head.next;
            return;
        };

        let current = this.head;

        while(current.next) {
            if(current.next === node) {
                current.next = node.next;
                return;
            }
            current = current.next;
        }

        throw Error("Node not present in linked list");
    };

    length(): number {
        return this.traverse().length;
    };

    access(index: number) {
        let current = this.head;

        for(let i=0; i<index;i++) {
            if(current.next) {
                current = current.next;
            } else {
                throw Error("index out of range");
            }
        }

        return current;
    }
};

export { LinkedList, LLNode };