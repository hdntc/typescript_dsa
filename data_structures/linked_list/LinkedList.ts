/**
 * A node in a {@link LinkedList}.
 * 
 * The nodes are doubly-linked.
 * @template T The type of the satellite data.
 */
class LLNode<T> {
    next: LLNode<T> | null = null;
    prev: LLNode<T> | null = null;
    value: T;
    /**
     * @constructor
     * This will initialize the values of {@link LLNode.next next}, {@link LLNode.value value} and also update `next`'s {@link LLNode.prev prev} to `this` (unless `next` is `null`).
     * @param value The satellite data of the node.
     * @param next The next node in the {@link LinkedList linked list}.
     */
    constructor(value: T, next: LLNode<T> | null = null) {
        this.value = value;
        this.next = next;
        if(next) next.prev = this;
    };
};

/**
 * This helper type matches against anything that is not an LLNode.
 * 
 * This is used to prevent the user from initializing the {@link LinkedList} with an array of {@link LLNode}s as this 
 * would probably lead to an unexpected result.
 * @template T Accepts any type so long as it does not extend {@link LLNode}.
 */

export type notLLNode<T> = T extends LLNode<any> ? never : T; 

/**
 * A linked list.
 * 
 * The {@link LLNode nodes} are doubly-linked.
 * @template T The type of the satellite data for each {@link LLNode}
 * @see {@link https://en.wikipedia.org/wiki/Linked_list Wikipedia}
 */
class LinkedList<T> {
    /**
     * The head (first {@link LLNode node}) of the linked list. 
     * This node is the first node encountered in {@link LinkedList.traverse traversals}.
     */
    head: LLNode<T> | null;
    /**
     * The number of nodes in the linked list.
     */
    length: number = 0;
    /**
     * @constructor
     * @param initial A single {@link notLLNode value}, array of {@link notLLNode values} or single {@link LLNode} with which to initialize the LL.
     * You can not pass an array of {@link LLNode}s as an `initial` because it can be interpreted ambiguously; see {@link notLLNode}
     */
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

        this.length = this.traverse().length;
    };

    /**
     * Traverses the linked list, returning an array representation of the LL, starting from the {@link LinkedList.head head}. 
     * 
     * Returns an empty array when {@link LinkedList.head head} is `null`.
     * @returns The traversal of the linked list.
     */
    traverse(): T[] {
        if(!this.head) {
            return [];
        }

        const result = [this.head.value];
        let current = this.head;

        while(current.next) {
            result.push(current.next.value);
            current = current.next;
        };
        
        return result;
    };

    /**
     * Inserts a value into the linked list.
     * @param nodeValue The satellite data of the new node to be inserted.
     * @param insertAfter The {@link LLNode} after which to insert the new value.
     * @todo Implement default behaviour to create set the new node as the new head as default behaviour when no `insertAfter` is specified.
     */
    insert(nodeValue: T, insertAfter: LLNode<T>): void {
        // places new node w/ value nodeValue after insertAfter node
        const oldAfter: LLNode<T> | null = insertAfter.next;
        const newNode = new LLNode(nodeValue, oldAfter);
        insertAfter.next = newNode;
        newNode.prev = insertAfter;
        this.length++;
    };

    /**
     * Removes the specified node from the linked list.
     * @param node The {@link LLNode node} to remove. It must be the **exact object**; it does not suffice for it to be a deep copy.
     * @throws When the node is not present.
     */
    remove(node: LLNode<T>): void {
        if(!this.head) {
            throw Error("Node not present in linked list");
        }

        if(node === this.head) {
            this.head = this.head.next;
            this.length--;
            return;
        };

        let current = this.head;

        while(current.next) {
            if(current.next === node) {
                current.next = node.next;
                this.length--;
                return;
            }
            current = current.next;
        }

        throw Error("Node not present in linked list");
    };

    /**
     * Accesses a node by index.
     * 
     * Note that this operation is `O(n)`.
     * @param index The index (0 is head, 1 is head.next) of the node.
     * @returns The {@link LLNode} at that index.
     * @throws When the index is out of range.
     */
    access(index: number): LLNode<T> {
        if(!this.head) {
            throw Error("index out of range");
        }

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