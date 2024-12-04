import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, allValidDirections, createWord, allCrossValidDirections } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });
const matrix = example.split("\n");

describe("Day4", () => {
  it("parses correctly", () => {
    assert.deepStrictEqual(parse(example), {
      matrix,
      rows: 10,
      cols: 10,
    });
  });

  it("finds all valid directions from upper left corner", () => {
    const wordSearch = parse(example);

    assert.deepStrictEqual(allValidDirections([ 0, 0 ], wordSearch), [
      [ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ],
      [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ],
      [ [ 0, 0 ], [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ],
    ]);
  });

  it("finds all valid directions from upper right corner", () => {
    const wordSearch = parse(example);

    assert.deepStrictEqual(allValidDirections([ 9, 0 ], wordSearch), [
      [ [ 9, 0 ], [ 8, 0 ], [ 7, 0 ], [ 6, 0 ] ],
      [ [ 9, 0 ], [ 8, 1 ], [ 7, 2 ], [ 6, 3 ] ],
      [ [ 9, 0 ], [ 9, 1 ], [ 9, 2 ], [ 9, 3 ] ],
    ]);
  });

  it("creates words from paths correctly", () => {
    const wordSearch = parse(example);

    assert.strictEqual(createWord([ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], wordSearch), "MMMS");
    assert.strictEqual(createWord([ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ], wordSearch), "MMAM");
  });

  it("finds all cross valid directions from upper left corner correctly", () => {
    const wordSearch = parse(example);
    assert.deepStrictEqual(allCrossValidDirections([ 0, 0 ], wordSearch), []);
  });

  it("finds all cross valid directions from middle point correctly", () => {
    const wordSearch = parse(example);
    assert.deepStrictEqual(allCrossValidDirections([ 1, 1 ], wordSearch), [
      [ [ 0, 0 ], [ 1, 1 ], [ 2, 2 ] ],
      [ [ 2, 0 ], [ 1, 1 ], [ 0, 2 ] ],
      [ [ 2, 2 ], [ 1, 1 ], [ 0, 0 ] ],
      [ [ 0, 2 ], [ 1, 1 ], [ 2, 0 ] ],
    ]);
  });
});
