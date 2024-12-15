import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, step, count } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day14", () => {
  it("parses correctly", () => {
    const robots = parse(example);

    assert.deepStrictEqual(robots[0], { p: [ 0, 4, 0 ], v: [ 3, -3, 0 ] });
    assert.deepStrictEqual(robots[1], { p: [ 6, 3, 0 ], v: [ -1, -3, 0 ] });
    assert.deepStrictEqual(robots[10], { p: [ 2, 4, 0 ], v: [ 2, -3, 0 ] });
    assert.strictEqual(robots.length, 12);
  });

  it("steps correctly", () => {
    let robots = parse(example);

    robots = step(robots, [ 11, 7, 1 ]);
    assert.deepStrictEqual(robots[0], { p: [ 3, 1, 0 ], v: [ 3, -3, 0 ] });
    assert.deepStrictEqual(robots[1], { p: [ 5, 0, 0 ], v: [ -1, -3, 0 ] });
    assert.deepStrictEqual(robots[10], { p: [ 4, 1, 0 ], v: [ 2, -3, 0 ] });

    robots = step(robots, [ 11, 7, 1 ]);
    assert.deepStrictEqual(robots[10], { p: [ 6, 5, 0 ], v: [ 2, -3, 0 ] });

    robots = step(robots, [ 11, 7, 1 ]);
    assert.deepStrictEqual(robots[10], { p: [ 8, 2, 0 ], v: [ 2, -3, 0 ] });

    robots = step(robots, [ 11, 7, 1 ]);
    assert.deepStrictEqual(robots[10], { p: [ 10, 6, 0 ], v: [ 2, -3, 0 ] });

    robots = step(robots, [ 11, 7, 1 ]);
    assert.deepStrictEqual(robots[10], { p: [ 1, 3, 0 ], v: [ 2, -3, 0 ] });
  });

  it("calculates n robots in each quadrant correctly", () => {
    let robots = parse(example);
    for (let i = 0; i < 100; i++) {
      robots = step(robots, [ 11, 7, 0 ]);
    }

    const quadrants = count(robots, [ 11, 7, 0 ]);

    assert.deepStrictEqual(quadrants, [ 1, 3, 4, 1 ]);
  });
});
