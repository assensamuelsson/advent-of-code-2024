import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { aStar, parse, posKey } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day18", () => {
  it("parses correctly", () => {
    const parsed = parse(example);

    assert.deepStrictEqual(parsed, [
      [ 5, 4 ],
      [ 4, 2 ],
      [ 4, 5 ],
      [ 3, 0 ],
      [ 2, 1 ],
      [ 6, 3 ],
      [ 2, 4 ],
      [ 1, 5 ],
      [ 0, 6 ],
      [ 3, 3 ],
      [ 2, 6 ],
      [ 5, 1 ],
      [ 1, 2 ],
      [ 5, 5 ],
      [ 2, 5 ],
      [ 6, 5 ],
      [ 1, 4 ],
      [ 0, 4 ],
      [ 6, 4 ],
      [ 1, 1 ],
      [ 6, 1 ],
      [ 1, 0 ],
      [ 0, 5 ],
      [ 1, 6 ],
      [ 2, 0 ],
    ]);
  });

  it("simulates example correctly", () => {
    const parsed = parse(example);
    const obstacles = new Set(parsed.slice(0, 12).map((p) => posKey(p)));

    const path = aStar([ 0, 0 ], [ 6, 6 ], obstacles);

    assert.strictEqual(path.length - 1, 22);
  });
});
