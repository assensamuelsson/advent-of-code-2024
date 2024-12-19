import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, canConstruct, reducePatterns, countConstruct } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day19", () => {
  it("parses correctly", () => {
    const { patterns, designs } = parse(example);

    assert.deepStrictEqual(patterns, [ "r", "wr", "b", "g", "bwu", "rb", "gb", "br" ]);
    assert.deepStrictEqual(designs, [
      "brwrr",
      "bggr",
      "gbbr",
      "rrbgbr",
      "ubwu",
      "bwurrg",
      "brgr",
      "bbrgwb",
    ]);
  });

  it("determines canConstruct correctly", () => {
    const { patterns, designs } = parse(example);

    assert(canConstruct("", patterns));
    assert(canConstruct(patterns[0], patterns));
    assert(!canConstruct("foo", patterns));
    assert(canConstruct(designs[0], patterns));
    assert(canConstruct(designs[1], patterns));
    assert(canConstruct(designs[2], patterns));
    assert(canConstruct(designs[3], patterns));
    assert(!canConstruct(designs[4], patterns));
    assert(canConstruct(designs[5], patterns));
    assert(canConstruct(designs[6], patterns));
    assert(!canConstruct(designs[7], patterns));
  });

  it("reduces patterns correctly", () => {
    const { patterns } = parse(example);

    assert.deepStrictEqual(reducePatterns([ "a", "b", "ab" ]), [ "a", "b" ]);
    assert.deepStrictEqual(reducePatterns(patterns), [ "r", "wr", "b", "g", "bwu" ]);
  });

  it("determines countConstruct correctly", () => {
    const { patterns, designs } = parse(example);

    assert.strictEqual(countConstruct(designs[0], patterns), 2);
    assert.strictEqual(countConstruct(designs[1], patterns), 1);
    assert.strictEqual(countConstruct(designs[2], patterns), 4);
    assert.strictEqual(countConstruct(designs[3], patterns), 6);
    assert.strictEqual(countConstruct(designs[4], patterns), 0);
    assert.strictEqual(countConstruct(designs[5], patterns), 1);
    assert.strictEqual(countConstruct(designs[6], patterns), 2);
    assert.strictEqual(countConstruct(designs[7], patterns), 0);
  });
});
