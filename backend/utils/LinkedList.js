/**
 * @template T
 */
export default class LinkedList {
    #size = 0
    #head = new Node(null);// head will always be a empty node
    #tail = this.#head;
    /**
     * @param {Iterable<T>} values 
     */
    constructor(values = []){
        for(const value of values)
            this.add(value);
        
    }

    /**
     * @param {T} value 
     */
    add(value){
        this.#head.next = new Node(value, this.#head.next);
        if(this.#size == 0)
            this.#tail = this.#head.next;
        this.#size++;
    }

    clear(){
        this.#head.next = null;
        this.#size = 0;
    }

    // copy(){
    // }

    /** 
     * @param {Node} prevNode // this is the previous node of the node to be deleted
     * @returns {void}
     */
    static delete(prevNode){
        prevNode.next = prevNode.next?.next;
    }

    /**
     * @description deletes the next node in the iteration and decrements the size of the node ie prevNode.next witll be removed
     * @param {Node} prevNode 
     * @returns {void}
     */
    #delete(prevNode){
        if(!prevNode) return;
        if(prevNode?.next === this.#tail) 
            this.#tail = prevNode;
        LinkedList.delete(prevNode);
        this.#size--;
    }

    
    /**
     * @param {T} value 
     * @returns {boolean}
     */
    contains(value){
        return this.indexOf(value) != -1;
    }

    /**
     * @param {(value: T, index: number) => boolean} filter 
     * @returns {void}
     */
    filter(filter){
        let prevNode = this.#head, index = 0;
        while(prevNode && prevNode.next){
            if(!filter(prevNode.next.value, index))
                this.#delete(prevNode);
            else index++;
            prevNode = prevNode.next;
        }
    }

    /**
     * @param {(value: T, index: number) => boolean} callbackfn 
     * @returns {T | undefined}
     */
    findAndDelete(callbackfn){
        let prevNode = this.#head, index = 0;
        while(prevNode.next && !callbackfn(prevNode.next.value, index)){
            prevNode = prevNode.next;
            index++;
        }
        const value = prevNode.next?.value;
        this.#delete(prevNode);
        return value;
    }

    /**
     * @param {LinkedList} head 
     * @param {(value: T, index: number) => boolean} callbackfn 
     * @returns {T | null}
     */
    find(callbackfn){
        let prevNode = this.#head, index = 0;
        while(prevNode.next && !callbackfn(prevNode.next.value, index)){
            prevNode = prevNode.next;
            index++;
        }
        return prevNode.next.value ?? null;
    }

    /**
     * @param {(value: T, index: number) => void} callbackfn 
     * @returns {void}
     */
    forEach(callbackfn){
        let prevNode = this.#head, index = 0;
        while(prevNode.next){
            callbackfn(prevNode.next.value, index);
            prevNode = prevNode.next;
            index++;
        }
    }

    /**
     * @param {(value: Node<T>, index: number) => void} callbackfn 
     * @returns {void}
     */
    forEachNode(callbackfn){
        LinkedList.forEachNode(this.#head, callbackfn);
    }

    /**
     * @template T
     * @param {Node<T>} head
     * @param {(value: Node<T>, index: number) => void} callbackfn 
     * @returns {void}
     */
    static forEachNode(head, callbackfn){
        if(!head) return;
        let prevNode = head, index = 0;
        while(prevNode.next){
            callbackfn(prevNode.next, index);
            prevNode = prevNode.next;
            index++;
        }
    }

    /**
     * @param {T} value 
     * @returns {boolean}
     */
    indexOf(value){
        let prevNode = this.#head, index = 0;
        while(prevNode.next){
            if(prevNode.next.value === value) return index;
            prevNode = prevNode.next;
            index++;
        }
        return -1;
    }

    /**
     * @template T
     * @returns {LinkedList<T>}
     * @param {LinkedList<T>} linkedList1 
     * @param {LinkedList<T>} linkedList2 
     */
    static link(linkedList1, linkedList2){
        linkedList1.#tail.next = linkedList2.#head.next;
        return linkedList1;
    }

    /**
     * 
     * @returns {number}
     */
    size(){
        return this.#size;
    }

    /**
     * @template R
     * @param {(value: T, index: number) => R} modifier
     * @returns {R[]}
     */
    toArray(modifier = null){
        /**@type {R[]} */
        const arr = new Array(this.#size);
        if(modifier !== null)
            for(let i = 0, prevNode = this.#head; i < this.#size; i++, prevNode = prevNode.next)
                arr[i] = modifier(prevNode.next.value, i);
        else
            for(let i = 0, prevNode = this.#head; i < this.#size; i++, prevNode = prevNode.next)
                arr[i] = prevNode.next.value;

        return arr;
    }

    unlink(){
        this.#tail.next = null;
    }
}
/**
 * @template T
 */
class Node {
    /**@type {T}*/
    value;
    /**@type {Node | null}*/
    next;
    /**
     * @param {T} value 
     * @param {Node} next 
     */
    constructor(value, next = null){
        this.value = value;
        this.next = next;
    }
}