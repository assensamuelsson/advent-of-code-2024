import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { program, numericKeypad, generatePermutations, directionalKeypad, finalProgramLength } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day21", () => {
  it("generates permutations correctly", () => {
    assert.deepStrictEqual(generatePermutations([ "<", "^" ]), [ [ "<", "^" ], [ "^", "<" ] ]);
    assert.deepStrictEqual(generatePermutations([ "<", "^", "^" ]), [ [ "<", "^", "^" ], [ "^", "<", "^" ], [ "^", "^", "<" ] ]);
  });

  it("programs sequence correctly", () => {
    assert.deepStrictEqual(program("0", numericKeypad), [ "<A" ]);
    assert.deepStrictEqual(program("2", numericKeypad), [ "<^A", "^<A" ]);
    assert.deepStrictEqual(program("8", numericKeypad), [ "<^^^A", "^<^^A", "^^<^A", "^^^<A" ]);
    assert.deepStrictEqual(program("1", numericKeypad), [ "<^<A", "^<<A" ]);

    assert.deepStrictEqual(program("0", numericKeypad), [ "<A" ]);
    assert.deepStrictEqual(program("02", numericKeypad), [ "<A^A" ]);
    assert.deepStrictEqual(program("029", numericKeypad), [ "<A^A>^^A", "<A^A^>^A", "<A^A^^>A" ]);
    assert.deepStrictEqual(program("029A", numericKeypad), [ "<A^A>^^AvvvA", "<A^A^>^AvvvA", "<A^A^^>AvvvA" ]);

    assert.deepStrictEqual(program("<", directionalKeypad), [ "<v<A", "v<<A" ]);
    assert.deepStrictEqual(program("<A", directionalKeypad), [ "<v<A>>^A", "<v<A>^>A", "v<<A>>^A", "v<<A>^>A" ]);

    assert(program("<A^A>^^AvvvA", directionalKeypad).includes("v<<A>>^A<A>AvA<^AA>A<vAAA>^A"));
    assert(program("v<<A>>^A<A>AvA<^AA>A<vAAA>^A", directionalKeypad).includes("<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A"));
  });

  it("programs finalProgram correctly", () => {
    assert.strictEqual(finalProgramLength("029A"), "<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A".length);
  });
});
