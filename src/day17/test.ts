import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, combo, runProgram, findInitialAValue, INSTRUCTIONS, Register, Program } from "./src";

const example1 = readFileSync(`${import.meta.dirname}/example1.txt`, { encoding: "utf8" });
const example2 = readFileSync(`${import.meta.dirname}/example2.txt`, { encoding: "utf8" });

function createRegister():Register {
  return { A: 11, B: 12, C: 13 };
}

describe("Day17", () => {
  it("parses correctly", () => {
    const { register, program } = parse(example1);

    assert.deepStrictEqual(register, {
      A: 729,
      B: 0,
      C: 0,
    });

    assert.deepStrictEqual(program, [ 0, 1, 5, 4, 3, 0 ]);
  });

  it("calculates combo operand correctly", () => {
    const register = createRegister();

    assert.strictEqual(combo(0, register), 0);
    assert.strictEqual(combo(1, register), 1);
    assert.strictEqual(combo(2, register), 2);
    assert.strictEqual(combo(3, register), 3);
    assert.strictEqual(combo(4, register), register.A);
    assert.strictEqual(combo(5, register), register.B);
    assert.strictEqual(combo(6, register), register.C);
    assert.throws(() => combo(7, register));
  });

  it("calculates adv instruction correctly", () => {
    const register = createRegister();
    const input = 1;
    const expected = Math.floor(register.A / Math.pow(2, combo(input, register)));

    const nextIP = INSTRUCTIONS[0](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.A, expected);
  });

  it("calculates bxl instruction correctly", () => {
    const register = createRegister();
    const input = 6;
    const expected = register.B ^ input;

    const nextIP = INSTRUCTIONS[1](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates bst instruction correctly", () => {
    const register = createRegister();
    const input = 4;
    const expected = register.A % 8;

    const nextIP = INSTRUCTIONS[2](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates jnx instruction correctly", () => {
    const register = createRegister();

    register.A = 0;
    assert.strictEqual(INSTRUCTIONS[3](6, register, []), undefined);

    register.A = 1;
    assert.strictEqual(INSTRUCTIONS[3](6, register, []), 6);
  });

  it("calculates bxc instruction correctly", () => {
    const register = createRegister();
    const input = 4;
    const expected = register.B ^ register.C;

    const nextIP = INSTRUCTIONS[4](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates out instruction correctly", () => {
    const register = createRegister();
    const input = 4;
    const expected = combo(input, register) % 8;
    const output: number[] = [];

    const nextIP = INSTRUCTIONS[5](input, register, output);

    assert.strictEqual(nextIP, undefined);
    assert.deepStrictEqual(output, [ expected ]);
  });

  it("calculates bdv instruction correctly", () => {
    const register = createRegister();
    const input = 1;
    const expected = Math.floor(register.A / Math.pow(2, combo(input, register)));

    const nextIP = INSTRUCTIONS[6](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates bdv instruction correctly", () => {
    const register = createRegister();
    const input = 1;
    const expected = Math.floor(register.A / Math.pow(2, combo(input, register)));

    const nextIP = INSTRUCTIONS[6](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates cdv instruction correctly", () => {
    const register = createRegister();
    const input = 1;
    const expected = Math.floor(register.A / Math.pow(2, combo(input, register)));

    const nextIP = INSTRUCTIONS[7](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.C, expected);
  });

  it("runs program example 1 correctly", () => {
    const register: Register = { A: 0, B: 0, C: 9 };
    const program: Program = [ 2, 6 ];
    const output: number[] = [];

    runProgram(program, register, output);

    assert.strictEqual(register.B, 1);
  });

  it("runs program example 2 correctly", () => {
    const register: Register = { A: 10, B: 0, C: 0 };
    const program: Program = [ 5, 0, 5, 1, 5, 4 ];
    const output: number[] = [];

    runProgram(program, register, output);

    assert.deepStrictEqual(output, [ 0, 1, 2 ]);
  });

  it("runs program example 3 correctly", () => {
    const register: Register = { A: 2024, B: 0, C: 0 };
    const program: Program = [ 0, 1, 5, 4, 3, 0 ];
    const output: number[] = [];

    runProgram(program, register, output);

    assert.deepStrictEqual(output, [ 4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0 ]);
    assert.strictEqual(register.A, 0);
  });

  it("runs program example 4 correctly", () => {
    const register: Register = { A: 0, B: 29, C: 0 };
    const program: Program = [ 1, 7 ];
    const output: number[] = [];

    runProgram(program, register, output);

    assert.strictEqual(register.B, 26);
  });

  it("runs program example 5 correctly", () => {
    const register: Register = { A: 0, B: 2024, C: 43690 };
    const program: Program = [ 4, 0 ];
    const output: number[] = [];

    runProgram(program, register, output);

    assert.strictEqual(register.B, 44354);
  });

  it("runs parsed example correctly", () => {
    const { program, register } = parse(example1);
    const output: number[] = [];

    runProgram(program, register, output);

    assert.deepStrictEqual(output, [ 4, 6, 3, 5, 6, 3, 5, 2, 1, 0 ]);
  });

  it("brute force finds A initial value to product copy correctly for example 2", () => {
    const { program } = parse(example2);

    const A = findInitialAValue(program);

    assert.strictEqual(A, 117440);
  });
});
