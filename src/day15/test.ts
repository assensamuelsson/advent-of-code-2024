import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, step, sumBoxes, Map, Vec2d } from "./src";

const example1 = readFileSync(`${import.meta.dirname}/example1.txt`, { encoding: "utf8" });
const example2 = readFileSync(`${import.meta.dirname}/example2.txt`, { encoding: "utf8" });
const example3 = readFileSync(`${import.meta.dirname}/example3.txt`, { encoding: "utf8" });

describe("Day15", () => {
  it("parses correctly", () => {
    const parsed = parse(example1);

    assert.deepStrictEqual(parsed.map.robot, [ 2, 2 ]);
    assert.strictEqual(parsed.map.tiles[0][0], "#");
    assert.strictEqual(parsed.map.tiles[1][1], ".");
    assert.strictEqual(parsed.map.tiles[1][3], "O");
    assert.strictEqual(parsed.map.tiles.length, 8);
    assert.strictEqual(parsed.map.tiles[0].length, 8);
    assert.strictEqual(parsed.instructions.length, 15);

    assert.strictEqual(parse(example2).instructions.length, 700);
    assert.strictEqual(parse(example2).instructions[70], "v");
  });

  it("steps correctly", () => {
    const { map, instructions } = parse(example1);

    step(map, instructions[0]);
    assert.deepStrictEqual(map.robot, [ 2, 2 ]);

    step(map, instructions[1]);
    assert.deepStrictEqual(map.robot, [ 2, 1 ]);

    step(map, instructions[2]);
    assert.deepStrictEqual(map.robot, [ 2, 1 ]);

    step(map, instructions[3]);
    assert.deepStrictEqual(map.robot, [ 3, 1 ]);
    assert.strictEqual(map.tiles[1][4], "O");
    assert.strictEqual(map.tiles[1][5], "O");
    assert.strictEqual(map.tiles[1][3], "@");

    step(map, instructions[4]);
    assert.deepStrictEqual(map.robot, [ 4, 1 ]);
    assert.strictEqual(map.tiles[1][4], "@");
    assert.strictEqual(map.tiles[1][5], "O");
    assert.strictEqual(map.tiles[1][6], "O");
    assert.strictEqual(map.tiles[1][7], "#");

    step(map, instructions[5]);
    assert.deepStrictEqual(map.robot, [ 4, 1 ]);

    step(map, instructions[6]);
    assert.deepStrictEqual(map.robot, [ 4, 2 ]);
    assert.strictEqual(map.tiles[2][4], "@");
    assert.strictEqual(map.tiles[3][4], "O");
    assert.strictEqual(map.tiles[4][4], "O");
    assert.strictEqual(map.tiles[5][4], "O");
    assert.strictEqual(map.tiles[6][4], "O");
    assert.strictEqual(map.tiles[7][4], "#");
  });

  it("steps all instructions correctly", () => {
    const { map, instructions } = parse(example1);

    for (const instruction of instructions) {
      step(map, instruction);
    }

    assert.deepStrictEqual(map.robot, [ 4, 4 ]);
  });

  it("steps all instructions correctly for example 2 correctly", () => {
    const { map, instructions } = parse(example2);

    for (const instruction of instructions) {
      step(map, instruction);
    }

    assert.deepStrictEqual(map.robot, [ 3, 4 ]);
  });

  it("calculates sum of all GPS coordinates correctly for example 1", () => {
    const { map, instructions } = parse(example1);

    for (const instruction of instructions) {
      step(map, instruction);
    }

    assert.strictEqual(sumBoxes(map.tiles), 2028);
  });

  it("calculates sum of all GPS coordinates correctly for example 2", () => {
    const { map, instructions } = parse(example2);

    for (const instruction of instructions) {
      step(map, instruction);
    }

    assert.strictEqual(sumBoxes(map.tiles), 10092);
  });

  it("parses wide correctly", () => {
    const { map } = parse(example3, { wide: true });

    assert.strictEqual(map.tiles.length, 7);
    assert.strictEqual(map.tiles[0].length, 14);
    assert.deepStrictEqual(map.robot, [ 10, 3 ]);
  });

  it("steps example 3 wide correctly", () => {
    const { map, instructions } = parse(example3, { wide: true });

    step(map, instructions[0]);
    assert.deepStrictEqual(map.robot, [ 9, 3 ]);
    assert.strictEqual(map.tiles[3][8], "]");
    assert.strictEqual(map.tiles[3][7], "[");
    assert.strictEqual(map.tiles[3][6], "]");
    assert.strictEqual(map.tiles[3][5], "[");
    assert.strictEqual(map.tiles[3][4], ".");

    step(map, instructions[1]);
    assert.deepStrictEqual(map.robot, [ 9, 4 ]);

    step(map, instructions[2]);
    assert.deepStrictEqual(map.robot, [ 9, 5 ]);

    step(map, instructions[3]);
    assert.deepStrictEqual(map.robot, [ 8, 5 ]);

    step(map, instructions[4]);
    assert.deepStrictEqual(map.robot, [ 7, 5 ]);

    step(map, instructions[5]);
    assert.deepStrictEqual(map.robot, [ 7, 4 ]);
    assert.strictEqual(map.tiles[3][6], "[");
    assert.strictEqual(map.tiles[3][7], "]");
    assert.strictEqual(map.tiles[2][7], "[");
    assert.strictEqual(map.tiles[2][8], "]");
    assert.strictEqual(map.tiles[2][5], "[");
    assert.strictEqual(map.tiles[2][6], "]");
    assert.strictEqual(map.tiles[3][5], ".");
    assert.strictEqual(map.tiles[3][8], ".");

    step(map, instructions[6]);
    assert.deepStrictEqual(map.robot, [ 7, 4 ]);
    assert.strictEqual(map.tiles[3][6], "[");
    assert.strictEqual(map.tiles[3][7], "]");
    assert.strictEqual(map.tiles[2][7], "[");
    assert.strictEqual(map.tiles[2][8], "]");
    assert.strictEqual(map.tiles[2][5], "[");
    assert.strictEqual(map.tiles[2][6], "]");
    assert.strictEqual(map.tiles[3][5], ".");
    assert.strictEqual(map.tiles[3][8], ".");

    step(map, instructions[7]);
    assert.deepStrictEqual(map.robot, [ 6, 4 ]);

    step(map, instructions[8]);
    assert.deepStrictEqual(map.robot, [ 5, 4 ]);

    step(map, instructions[9]);
    assert.deepStrictEqual(map.robot, [ 5, 3 ]);

    step(map, instructions[10]);
    assert.deepStrictEqual(map.robot, [ 5, 2 ]);
    assert.strictEqual(map.tiles[1][5], "[");
    assert.strictEqual(map.tiles[1][6], "]");
  });

  it("don't move bent boxes to wall", () => {
    const tiles: Map["tiles"] = [
      [ "#", "#", "#" ],
      [ ".", "[", "]" ],
      [ "[", "]", "." ],
      [ ".", "[", "]" ],
      [ ".", "@", "." ],
    ] as const;
    const robot: Vec2d = [ 1, 4 ];

    step({ tiles, robot }, "^");

    assert.deepStrictEqual(tiles, [
      [ "#", "#", "#" ],
      [ ".", "[", "]" ],
      [ "[", "]", "." ],
      [ ".", "[", "]" ],
      [ ".", "@", "." ],
    ]);
  });

  it("steps through example 2 wide correctly", () => {
    const { map, instructions } = parse(example2, { wide: true });

    for (const instruction of instructions) {
      step(map, instruction);
    }

    assert.deepStrictEqual(map.robot, [ 4, 7 ]);
    assert.strictEqual(sumBoxes(map.tiles), 9021);
  });
});
