import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { findInstructions, enabledMuls } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day3", () => {
  it("finds mul, do and don't correctly correctly", () => {
    assert.deepStrictEqual(findInstructions(example), [
      { instruction: "mul", n1: 2, n2: 4 },
      { instruction: "don't" },
      { instruction: "mul", n1: 5, n2: 5 },
      { instruction: "mul", n1: 11, n2: 8 },
      { instruction: "do" },
      { instruction: "mul", n1: 8, n2: 5 },
    ]);
  });

  it("filters only correct muls", () => {
    const instructions = findInstructions(example);

    const filteredMuls = instructions
      .filter(enabledMuls());

    assert.deepStrictEqual(filteredMuls, [
      { instruction: "mul", n1: 2, n2: 4 },
      { instruction: "mul", n1: 8, n2: 5 },
    ]);
  });
});
