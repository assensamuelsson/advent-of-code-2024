import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, blink, countStones } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day11", () => {
  it("parses correctly", () => {
    const stones = parse(example);

    assert.deepStrictEqual(stones, new Map([
      [ 125, 1 ],
      [ 17, 1 ],
    ]));
  });

  it("blinks correctly", () => {
    let stones = parse(example);

    stones = blink(stones);
    assert.deepStrictEqual(stones, new Map([
      [ 1, 1 ],
      [ 253000, 1 ],
      [ 7, 1 ],
    ]));

    stones = blink(stones);
    assert.deepStrictEqual(stones, new Map([
      [ 253, 1 ],
      [ 0, 1 ],
      [ 2024, 1 ],
      [ 14168, 1 ],
    ]));

    stones = blink(stones);
    assert.deepStrictEqual(stones, new Map([
      [ 512072, 1 ],
      [ 1, 1 ],
      [ 20, 1 ],
      [ 24, 1 ],
      [ 28676032, 1 ],
    ]));

    stones = blink(stones);
    assert.deepStrictEqual(stones, new Map([
      [ 512, 1 ],
      [ 72, 1 ],
      [ 2024, 1 ],
      [ 2, 2 ],
      [ 0, 1 ],
      [ 4, 1 ],
      [ 2867, 1 ],
      [ 6032, 1 ],
    ]));

    for (let i = 0; i < 21; i++) {
      stones = blink(stones);
    }

    assert.strictEqual(countStones(stones), 55312);
  });
});
