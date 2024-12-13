import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, minWinTokens } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day13", () => {
  it("parses correctly", () => {
    const parsed = parse(example);

    assert.deepStrictEqual(parsed[0], { A: [ 94, 34 ], B: [ 22, 67 ], P: [ 8400, 5400 ] });
    assert.deepStrictEqual(parsed[1], { A: [ 26, 66 ], B: [ 67, 21 ], P: [ 12748, 12176 ] });
  });

  it("calculates minWinTokens correctly", () => {
    const parsed = parse(example);

    assert.strictEqual(minWinTokens(parsed[0]), 280);
    assert.strictEqual(minWinTokens(parsed[1]), null);
    assert.strictEqual(minWinTokens(parsed[2]), 200);
    assert.strictEqual(minWinTokens(parsed[3]), null);
  });

  it("parses part2 correctly", () => {
    const parsed = parse(example, 10000000000000);

    assert.deepStrictEqual(parsed[0], { A: [ 94, 34 ], B: [ 22, 67 ], P: [ 10000000008400, 10000000005400 ] });
  });

  it("calculates part2 minWinTokens correctly", () => {
    const parsed = parse(example, 10000000000000);

    assert.strictEqual(minWinTokens(parsed[0]), null);
    assert(minWinTokens(parsed[1]) !== null);
    assert.strictEqual(minWinTokens(parsed[2]), null);
    assert(minWinTokens(parsed[3]) !== null);
  });
});
