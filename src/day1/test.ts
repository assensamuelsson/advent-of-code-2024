import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, sort, diff, occurrences } from "./src";

const input = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day1", () => {
  it("parses correctly", () => {
    assert.deepStrictEqual(parse(input), [
      [ 3, 4, 2, 1, 3, 3 ],
      [ 4, 3, 5, 3, 9, 3 ],
    ]);
  });

  it("sorts correctlt", () => {
    const parsed = parse(input);
    assert.deepStrictEqual(sort(parsed), [
      [ 1, 2, 3, 3, 3, 4 ],
      [ 3, 3, 3, 4, 5, 9 ],
    ]);
  });

  it("calculates diffs correctly", () => {
    const parsed = parse(input);
    const sorted = sort(parsed);

    assert.deepStrictEqual(diff(sorted), [
      2, 1, 0, 1, 2, 5,
    ]);
  });

  it("calculates occurrence correctly", () => {
    const parsed = parse(input);

    assert.deepStrictEqual(occurrences(parsed[1]), {
      3: 3,
      4: 1,
      5: 1,
      9: 1,
    });
  });
});
