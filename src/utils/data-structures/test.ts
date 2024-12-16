import assert from "node:assert";
import { describe, it, beforeEach } from "node:test";

import { MinPriorityQueue, NaiveMinPriorityQueue } from "./index";

describe("Data structures", () => {
  describe("MinPriorityQueue", () => {
    type Node = { value: number };
    let queue: MinPriorityQueue<Node>;

    beforeEach(() => {
      queue = new NaiveMinPriorityQueue((v: Node) => v.value, (v: Node) => String(v.value));
    });

    it("add, add and pop should return lowest value", () => {
      queue.add({ value: 1 });
      queue.add({ value: 2 });

      const node = queue.pop();

      assert.deepStrictEqual(node, { value: 1 });
    });

    it("pop on empty queue should throw", () => {
      assert.throws(() => queue.pop());
    });

    it("size should be correct", () => {
      queue.add({ value: 1 });
      queue.add({ value: 2 });
      queue.add({ value: 2 });
      queue.add({ value: 2 });
      queue.add({ value: 2 });

      assert.strictEqual(queue.size, 5);

      queue.pop();

      assert.strictEqual(queue.size, 4);
    });
  });
});
