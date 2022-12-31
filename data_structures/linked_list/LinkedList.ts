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
    }
};

export { LinkedList, LLNode };