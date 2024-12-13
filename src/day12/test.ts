import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, calculatePerimiter1 } from "./src";

const example1 = readFileSync(`${import.meta.dirname}/example1.txt`, { encoding: "utf8" });

describe("Day12", () => {
  it("parses correctly", () => {
    const { regions } = parse(example1, calculatePerimiter1);

    assert.strictEqual(regions.find(({ plant }) => plant === "A")?.area, 4);
    assert.strictEqual(regions.find(({ plant }) => plant === "A")?.perimiter, 10);
    assert.strictEqual(regions.find(({ plant }) => plant === "B")?.area, 4);
    assert.strictEqual(regions.find(({ plant }) => plant === "B")?.perimiter, 8);
    assert.strictEqual(regions.find(({ plant }) => plant === "C")?.area, 4);
    assert.strictEqual(regions.find(({ plant }) => plant === "C")?.perimiter, 10);
    assert.strictEqual(regions.find(({ plant }) => plant === "D")?.area, 1);
    assert.strictEqual(regions.find(({ plant }) => plant === "D")?.perimiter, 4);
    assert.strictEqual(regions.find(({ plant }) => plant === "E")?.area, 3);
    assert.strictEqual(regions.find(({ plant }) => plant === "E")?.perimiter, 8);
  });
});
