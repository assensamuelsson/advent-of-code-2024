import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, walk, visitedPositions, isLoop, numberOfLoops } from "./src";
import { Vec } from "../utils/math";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day6", () => {
  it("parses correctly", () => {
    const { guard, map } = parse(example);

    assert.deepStrictEqual(guard, {
      p: [ 4, 6, 0 ],
      v: [ 0, -1, 0 ],
    });

    assert.deepStrictEqual(map, {
      rows: 10,
      cols: 10,
      obstacles: new Set([
        "4,0",
        "9,1",
        "2,3",
        "7,4",
        "1,6",
        "8,7",
        "0,8",
        "6,9",
      ]),
    });
  });

  it("guard walks correctly", () => {
    let { guard, map } = parse(example);

    guard = walk(guard, map.obstacles);
    assert.deepStrictEqual(guard, {
      p: [ 4, 5, 0 ],
      v: [ 0, -1, 0 ],
    });
    guard = walk(guard, map.obstacles);
    assert.deepStrictEqual(guard, {
      p: [ 4, 4, 0 ],
      v: [ 0, -1, 0 ],
    });
    guard = walk(guard, map.obstacles);
    assert.deepStrictEqual(guard, {
      p: [ 4, 3, 0 ],
      v: [ 0, -1, 0 ],
    });
    guard = walk(guard, map.obstacles);
    assert.deepStrictEqual(guard, {
      p: [ 4, 2, 0 ],
      v: [ 0, -1, 0 ],
    });
    guard = walk(guard, map.obstacles);
    assert.deepStrictEqual(guard, {
      p: [ 4, 1, 0 ],
      v: [ 0, -1, 0 ],
    });
    guard = walk(guard, map.obstacles);
    assert.deepStrictEqual(guard, {
      p: [ 4, 1, 0 ],
      v: [ 1, 0, 0 ],
    });
  });

  it("calculates visited positions correctly", () => {
    const { guard, map } = parse(example);

    assert.strictEqual(visitedPositions(guard, map), 41);
  });

  it("determines is loop correctly", () => {
    const { guard, map } = parse(example);

    assert(!isLoop(guard, map, [ 0, 0, 0 ] as Vec));
    assert(isLoop(guard, map, [ 3, 6, 0 ] as Vec));
    assert(isLoop(guard, map, [ 6, 7, 0 ] as Vec));
  });

  it("determines number of loops correctly", () => {
    const { guard, map } = parse(example);

    assert.strictEqual(numberOfLoops(guard, map), 6);
  });
});
