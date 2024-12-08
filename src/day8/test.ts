import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, antinodes, antinodesResonantHarmonics } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day8", () => {
  it("parses correctly", () => {
    const parsed = parse(example);

    assert.deepStrictEqual(parsed, {
      rows: 12,
      cols: 12,
      antennas: {
        0: [ [ 8, 1, 0 ], [ 5, 2, 0 ], [ 7, 3, 0 ], [ 4, 4, 0 ] ],
        A: [ [ 6, 5, 0 ], [ 8, 8, 0 ], [ 9, 9, 0 ] ],
      },
    });
  });

  it("finds antinodes correctly", () => {
    assert.deepStrictEqual(antinodes([ 4, 3, 0 ], [ 5, 5, 0 ]), [
      [ 3, 1, 0 ],
      [ 6, 7, 0 ],
    ]);
  });

  it("finds antinodes correctly", () => {
    assert.deepStrictEqual(antinodesResonantHarmonics([ 0, 0, 0 ], [ 1, 2, 0 ], { rows: 10, cols: 10 }), [
      [ 0, 0, 0 ],
      [ 1, 2, 0 ],
      [ 2, 4, 0 ],
      [ 3, 6, 0 ],
      [ 4, 8, 0 ],
    ]);
  });
});
