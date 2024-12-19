export interface MinPriorityQueue<T> {
  add(node: T): void;
  pop(): T;
  has(key: string): boolean;
  get(key: string): T | undefined;
  size: number;
}

export class NaiveMinPriorityQueue<T> implements MinPriorityQueue<T> {
  #sortOn: (node: T) => number;
  #key: (node: T) => string;
  #nodes: T[];

  constructor(sortOn: (node: T) => number, key: (node: T) => string) {
    this.#sortOn = sortOn;
    this.#key = key;
    this.#nodes = [];
  }

  add(node: T): void {
    this.#nodes.push(node);
  }

  pop(): T {
    this.#nodes.sort((a, b) => this.#sortOn(b) - this.#sortOn(a));
    const node = this.#nodes.pop();
    if (!node) {
      throw new Error("Underflow - no nodes to pop");
    }
    return node;
  }

  has(key: string): boolean {
    return !!this.#nodes.find((node) => this.#key(node) === key);
  }

  get(key: string): T | undefined {
    return this.#nodes.find((node) => this.#key(node) === key);
  }

  get size(): number {
    return this.#nodes.length;
  }
}

export class MinHeapPriorityQueue<T> implements MinPriorityQueue<T> {
  #heap: T[];
  #sortOn: (node: T) => number;
  #key: (node: T) => string;
  #keys: Set<string>;

  constructor(sortOn: (node: T) => number, key: (node: T) => string) {
    this.#sortOn = sortOn;
    this.#key = key;
    this.#heap = [];
    this.#keys = new Set();
  }

  add(node: T): void {
    this.#heap.push(node);
    this.#keys.add(this.#key(node));
    this.#bubbleUp();
  }

  pop(): T {
    if (this.#heap.length === 0) {
      throw new Error("Underflow - no nodes to pop");
    }
    const min = this.#heap[0];
    const end = this.#heap.pop();
    if (this.#heap.length > 0 && end !== undefined) {
      this.#heap[0] = end;
      this.#sinkDown(0);
    }
    this.#keys.delete(this.#key(min));
    return min;
  }

  has(key: string): boolean {
    return this.#keys.has(key);
  }

  get(key: string): T | undefined {
    return this.#heap.find((node) => this.#key(node) === key);
  }

  get size(): number {
    return this.#heap.length;
  }

  #bubbleUp(): void {
    let index = this.#heap.length - 1;
    const element = this.#heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.#heap[parentIndex];
      if (this.#sortOn(element) >= this.#sortOn(parent)) break;
      this.#heap[index] = parent;
      index = parentIndex;
    }
    this.#heap[index] = element;
  }

  #sinkDown(index: number): void {
    const length = this.#heap.length;
    const element = this.#heap[index];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild: T, rightChild: T;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.#heap[leftChildIndex];
        if (this.#sortOn(leftChild) < this.#sortOn(element)) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.#heap[rightChildIndex];
        if (
          (swap === null && this.#sortOn(rightChild) < this.#sortOn(element)) ||
          (swap !== null && this.#sortOn(rightChild) < this.#sortOn(leftChild!))
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.#heap[index] = this.#heap[swap];
      index = swap;
    }
    this.#heap[index] = element;
  }
}
