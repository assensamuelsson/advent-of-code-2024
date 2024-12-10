import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, nHikingTrails } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day10", () => {
  it("parses correctly", () => {
    const map = parse(example);

    assert.strictEqual(map.rows, 8);
    assert.strictEqual(map.cols, 8);
    assert.deepStrictEqual(map.trailHeads, [
      [ 2, 0 ],
      [ 4, 0 ],
      [ 4, 2 ],
      [ 6, 4 ],
      [ 2, 5 ],
      [ 5, 5 ],
      [ 0, 6 ],
      [ 6, 6 ],
      [ 1, 7 ],
    ]);
  });

  it("finds number of hiking trails correctly trivial", () => {
    const heightMap = [
      [ 9 ],
    ];
    const rows = 1;
    const cols = 1;
    assert.strictEqual(nHikingTrails([ 0, 0 ], { heightMap, rows, cols }, false), 1);
  });

  it("finds number of hiking trails from example correctly", () => {
    const map = parse(example);

    assert.strictEqual(nHikingTrails(map.trailHeads[0], map, false), 5);
  });

  it("finds number of distinct hiking trails correctly 2", () => {
    const heightMap = [
      [ 7, 8 ],
      [ 8, 9 ],
    ];
    const rows = 2;
    const cols = 2;
    assert.strictEqual(nHikingTrails([ 0, 0 ], { heightMap, rows, cols }, true), 2);
  });

  it("finds number of distinct hiking trails from example correctly", () => {
    const map = parse(example);

    assert.strictEqual(nHikingTrails(map.trailHeads[0], map, true), 20);
  });

  it("finds number of distinct hiking trails from mega example correctly", () => {
    const heightMap = [
      [ 0, 1, 2, 3, 4, 5 ],
      [ 1, 2, 3, 4, 5, 6 ],
      [ 2, 3, 4, 5, 6, 7 ],
      [ 3, 4, 5, 6, 7, 8 ],
      [ 4, 0, 6, 7, 8, 9 ],
      [ 5, 6, 7, 8, 9, 0 ],
    ];
    const rows = 6;
    const cols = 6;

    assert.strictEqual(nHikingTrails([ 0, 0 ], { heightMap, rows, cols }, true), 227);
  });
});
