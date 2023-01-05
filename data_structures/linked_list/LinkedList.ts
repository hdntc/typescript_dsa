class LLNode {
    next: LLNode | null;
    value: any;
    constructor(value: any, next: LLNode | null = null) {
        this.value = value;
        this.next = next;
    };
};

class LinkedList {
    head: LLNode;
    constructor(initial: any[] | any | LLNode) {
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

    traverse(): any[] {
        const result = [this.head.value];
        let current = this.head;

        while(current.next) {
            result.push(current.next.value);
            current = current.next;
        };
        
        return result;
    };

    insert(nodeValue: any, insertAfter: LLNode): void {
        // places new node w/ value nodeValue after insertAfter node
        const oldAfter: LLNode | null = insertAfter.next;
        insertAfter.next = new LLNode(nodeValue, oldAfter);
    };
};

export { LinkedList, LLNode };