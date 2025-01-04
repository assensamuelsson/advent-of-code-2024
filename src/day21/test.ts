import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { program, numericKeypad, generatePermutations, directionalKeypad, finalProgramLength, toState, stateLength, evolve } from "./src";

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
    assert.strictEqual(finalProgramLength("029A").v, "<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A".length);
  });

  it("calculates to state correctly", () => {
    const result = toState("<<vA>>^A<A>AvA<^AA>A<vAAA>^A");

    assert.deepStrictEqual(result, { "<<vA": 1, ">>^A": 1, "<A": 1, ">A": 2, vA: 1, "<^A": 1, A: 3, "<vA": 1, ">^A": 1 });
  });

  it("calculates state length correctly", () => {
    const p = "<<vA>>^A<A>AvA<^AA>A<vAAA>^A";
    const len = stateLength(toState(p));

    assert.strictEqual(len, p.length);
  });

  it("evolves state correctly", () => {
    assert.deepStrictEqual(evolve({ A: 1 }), { A: 1 });
    assert.deepStrictEqual(evolve({ ">A": 1 }), { vA: 1, "^A": 1 });
    assert.deepStrictEqual(evolve({ ">^A": 1 }), { vA: 1, "<^A": 1, ">A": 1 });
    assert.deepStrictEqual(evolve({ ">>^A": 1 }), { vA: 1, A: 1, "<^A": 1, ">A": 1 });
    assert.deepStrictEqual(evolve({ "^A": 1 }), { "<A": 1, ">A": 1 });
    assert.deepStrictEqual(evolve({ "<A": 1 }), { "v<<A": 1, ">>^A": 1 });
    assert.deepStrictEqual(evolve({ "<^A": 1 }), { "v<<A": 1, ">^A": 1, ">A": 1 });
    assert.deepStrictEqual(evolve({ "<vA": 1 }), { "v<<A": 1, ">A": 1, ">^A": 1 });
    assert.deepStrictEqual(evolve({ vA: 1 }), { "<vA": 1, ">^A": 1 });
    assert.deepStrictEqual(evolve({ "v<<A": 1 }), { "<vA": 1, "<A": 1, A: 1, ">>^A": 1 });
    assert.deepStrictEqual(evolve({ "<<A": 1 }), { "v<<A": 1, A: 1, ">>^A": 1 });
    assert.deepStrictEqual(evolve({ "v>A": 1 }), { "<vA": 1, ">A": 1, "^A": 1 });
    assert.deepStrictEqual(evolve({ ">>A": 1 }), { vA: 1, A: 1, "^A": 1 });
  });
});
