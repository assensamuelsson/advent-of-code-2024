import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, isCorrectOrder, middleValue, sort } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day5", () => {
  it("parses correctly", () => {
    const { rules, updates } = parse(example);

    assert.deepStrictEqual(rules[0], [ 47, 53 ]);
    assert.deepStrictEqual(rules[20], [ 53, 13 ]);
    assert.deepStrictEqual(updates[0], [ 75, 47, 61, 53, 29 ]);
    assert.deepStrictEqual(updates[5], [ 97, 13, 75, 29, 47 ]);
  });

  it("determines is order correctly", () => {
    const { rules, updates } = parse(example);

    assert(isCorrectOrder(updates[0], rules));
    assert(isCorrectOrder(updates[1], rules));
    assert(isCorrectOrder(updates[2], rules));
    assert(!isCorrectOrder(updates[3], rules));
    assert(!isCorrectOrder(updates[4], rules));
    assert(!isCorrectOrder(updates[5], rules));
  });

  it("extracts middle value correctly", () => {
    const { updates } = parse(example);

    assert.strictEqual(middleValue(updates[0]), 61);
    assert.strictEqual(middleValue(updates[1]), 53);
    assert.strictEqual(middleValue(updates[2]), 29);
  });

  it("sorts correctly", () => {
    const { rules, updates } = parse(example);

    assert.deepStrictEqual(sort(updates[3], rules), [ 97, 75, 47, 61, 53 ]);
    assert.deepStrictEqual(sort(updates[4], rules), [ 61, 29, 13 ]);
    assert.deepStrictEqual(sort(updates[5], rules), [ 97, 75, 47, 29, 13 ]);
  });
});
