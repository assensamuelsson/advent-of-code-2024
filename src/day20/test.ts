import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, dijkstra, findCheats, findAllCheats, allPosWithinSteps } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day20", () => {
  it("parses correctly", () => {
    const map = parse(example);

    assert.deepStrictEqual(map.start, {
      pos: [ 1, 3 ],
      tile: "S",
      prev: null,
      dist: Infinity,
    });
    assert.deepStrictEqual(map.end, {
      pos: [ 5, 7 ],
      tile: "E",
      next: null,
      dist: 0,
    });
    assert.strictEqual(map.rows, 15);
    assert.strictEqual(map.cols, 15);
  });

  it("calculates dijkstra correctly", () => {
    const map = parse(example);

    dijkstra(map);

    assert.strictEqual(map.end.dist, 0);
    assert.strictEqual(map.start.dist, 84);
  });

  it("findCheats correctly", () => {
    const map = parse(example);
    dijkstra(map);

    assert.deepStrictEqual(findCheats(map.start, map), [ 4 ]);
    assert.deepStrictEqual(findCheats(map.nodes[1][7], map), [ 12 ]);
  });

  it("findAllCheats correctly", () => {
    const map = parse(example);
    dijkstra(map);

    const cheats = findAllCheats(map);

    assert.strictEqual(cheats.length, 44);
    assert(cheats.includes(64));
    assert(cheats.includes(40));
    assert(!cheats.includes(45));
  });

  it("calculates all points from start point in steps correctly", () => {
    assert.deepStrictEqual(allPosWithinSteps([ 0, 0 ], 1), [
      [ 0, -1 ],
      [ -1, 0 ], [ 0, 0 ], [ 1, 0 ],
      [ 0, 1 ],
    ]);
  });

  it("finds all cheats within 20 steps correctly", () => {
    const map = parse(example);
    dijkstra(map);

    const cheats = findAllCheats(map, 20);

    assert.strictEqual(cheats.filter((c) => c === 76).length, 3);
    assert.strictEqual(Math.max(...cheats), 76);
  });
});
