import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, isSafe, isSafeWithDampening } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });
const input = readFileSync(`${import.meta.dirname}/input.txt`, { encoding: "utf8" });

describe("Day2", () => {
  it("parses correctly", () => {
    assert.deepStrictEqual(parse(example), [
      [ 7, 6, 4, 2, 1 ],
      [ 1, 2, 7, 8, 9 ],
      [ 9, 7, 6, 2, 1 ],
      [ 1, 3, 2, 4, 5 ],
      [ 8, 6, 4, 4, 1 ],
      [ 1, 3, 6, 7, 9 ],
    ]);
  });

  it("calculates isSafe correctly", () => {
    const parsed = parse(example);

    assert(isSafe(parsed[0]));
    assert(!isSafe(parsed[1]));
    assert(!isSafe(parsed[2]));
    assert(!isSafe(parsed[3]));
    assert(!isSafe(parsed[4]));
    assert(isSafe(parsed[5]));
  });

  it("calculates isSafe with dampening correctly", () => {
    const parsed = parse(example);

    assert(isSafeWithDampening(parsed[0]));
    assert(!isSafeWithDampening(parsed[1]));
    assert(!isSafeWithDampening(parsed[2]));
    assert(isSafeWithDampening(parsed[3]));
    assert(isSafeWithDampening(parsed[4]));
    assert(isSafeWithDampening(parsed[5]));
    assert(isSafeWithDampening([ 99, 1, 2, 3, 4 ]));
    assert(!isSafeWithDampening([ 99, 99, 1, 2, 3, 4 ]));
    assert(isSafeWithDampening([ 0, 99, 1, 2, 3, 4 ]));
    assert(!isSafeWithDampening([ 0, 99, 99, 1, 2, 3, 4 ]));
    assert(isSafeWithDampening([ 0, 1, 2, 3, 4, 99 ]));
    assert(!isSafeWithDampening([ 0, 1, 2, 3, 4, 99, 200 ]));
    assert(!isSafeWithDampening([ 0, 1, 2, 3, 4, 99, 99 ]));
  });

  it("calculates part2 correctly", () => {
    const result = parse(input)
      .filter(isSafeWithDampening)
      .length;

    assert.strictEqual(result, 658);
  });
});
