import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, djikstra, traverse, Map } from "./src";

const example1 = readFileSync(`${import.meta.dirname}/example1.txt`, { encoding: "utf8" });
const example2 = readFileSync(`${import.meta.dirname}/example2.txt`, { encoding: "utf8" });

describe("Day16", () => {
  it("parses correctly", () => {
    const parsed = parse(example1);

    assert.strictEqual(parsed.rows, 15);
    assert.strictEqual(parsed.cols, 15);
    assert.deepStrictEqual(parsed.start, [ 1, 13 ]);
    assert.deepStrictEqual(parsed.end, [ 13, 1 ]);
  });

  it("finds shortest path for trivial example correctly", () => {
    const map: Map = {
      tiles: [
        [ "#", "#", "#", "#", "#" ],
        [ "#", ".", ".", "E", "#" ],
        [ "#", ".", "#", ".", "#" ],
        [ "#", "S", ".", ".", "#" ],
        [ "#", "#", "#", "#", "#" ],
      ],
      rows: 5,
      cols: 5,
      start: [ 1, 3 ],
      end: [ 3, 1 ],
    };

    const endNode = djikstra(map);

    assert.strictEqual(endNode.dist, 1004);
  });

  it("finds shortest path for another trivial example correctly", () => {
    const map: Map = {
      tiles: [
        [ "#", "#", "#", "#", "#" ],
        [ "#", ".", ".", "E", "#" ],
        [ "#", ".", ".", ".", "#" ],
        [ "#", "S", ".", ".", "#" ],
        [ "#", "#", "#", "#", "#" ],
      ],
      rows: 5,
      cols: 5,
      start: [ 1, 3 ],
      end: [ 3, 1 ],
    };

    const endNode = djikstra(map);

    assert.strictEqual(endNode.dist, 1004);
  });

  it("finds shortest path for example1 correctly", () => {
    const map = parse(example1);

    const endNode = djikstra(map);

    assert.strictEqual(endNode.dist, 7036);
  });

  it("finds shortest path for example2 correctly", () => {
    const map = parse(example2);

    const endNode = djikstra(map);

    assert.strictEqual(endNode.dist, 11048);
  });

  it("traverses back correctly for example 1", () => {
    const map = parse(example1);
    const endNode = djikstra(map);

    const nNodes = traverse(endNode);

    assert.strictEqual(nNodes, 45);
  });

  it("traverses back correctly for example 2", () => {
    const map = parse(example2);
    const endNode = djikstra(map);

    const nNodes = traverse(endNode);

    assert.strictEqual(nNodes, 64);
  });
});
