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
