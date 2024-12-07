import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, isValidCalibration, opsAddMul, opsAddMulCct } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day7", () => {
  it("parses correctly", () => {
    const parsed = parse(example);

    assert.deepStrictEqual(parsed, [
      { testValue: 190, numbers: [ 10, 19 ] },
      { testValue: 3267, numbers: [ 81, 40, 27 ] },
      { testValue: 83, numbers: [ 17, 5 ] },
      { testValue: 156, numbers: [ 15, 6 ] },
      { testValue: 7290, numbers: [ 6, 8, 6, 15 ] },
      { testValue: 161011, numbers: [ 16, 10, 13 ] },
      { testValue: 192, numbers: [ 17, 8, 14 ] },
      { testValue: 21037, numbers: [ 9, 7, 18, 13 ] },
      { testValue: 292, numbers: [ 11, 6, 16, 20 ] },
    ]);
  });

  it("isValidCalibration + and *", () => {
    const parsed = parse(example);

    assert(isValidCalibration({ testValue: 2, numbers: [ 2 ] }, opsAddMul));
    assert(!isValidCalibration({ testValue: 2, numbers: [ 3 ] }, opsAddMul));
    assert(isValidCalibration({ testValue: 9, numbers: [ 6, 3 ] }, opsAddMul));
    assert(isValidCalibration({ testValue: 9, numbers: [ 3, 3 ] }, opsAddMul));

    assert(isValidCalibration(parsed[0], opsAddMul));
    assert(isValidCalibration(parsed[1], opsAddMul));
    assert(isValidCalibration(parsed[8], opsAddMul));

    assert(!isValidCalibration(parsed[2], opsAddMul));
    assert(!isValidCalibration(parsed[3], opsAddMul));
    assert(!isValidCalibration(parsed[4], opsAddMul));
    assert(!isValidCalibration(parsed[5], opsAddMul));
    assert(!isValidCalibration(parsed[6], opsAddMul));
    assert(!isValidCalibration(parsed[7], opsAddMul));
  });

  it("isValidCalibration +, * and ||", () => {
    const parsed = parse(example);

    assert(isValidCalibration(parsed[0], opsAddMulCct));
    assert(isValidCalibration(parsed[1], opsAddMulCct));
    assert(isValidCalibration(parsed[8], opsAddMulCct));
    assert(isValidCalibration(parsed[3], opsAddMulCct));
    assert(isValidCalibration(parsed[4], opsAddMulCct));
    assert(isValidCalibration(parsed[6], opsAddMulCct));

    assert(!isValidCalibration(parsed[2], opsAddMulCct));
    assert(!isValidCalibration(parsed[5], opsAddMulCct));
    assert(!isValidCalibration(parsed[7], opsAddMulCct));
  });
});
