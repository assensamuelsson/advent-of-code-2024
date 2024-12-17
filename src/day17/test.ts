import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, combo, runProgram, findInitialAValue, INSTRUCTIONS, Register, Program } from "./src";

const example1 = readFileSync(`${import.meta.dirname}/example1.txt`, { encoding: "utf8" });
const example2 = readFileSync(`${import.meta.dirname}/example2.txt`, { encoding: "utf8" });

function createRegister():Register {
  return { A: 11n, B: 12n, C: 13n };
}

describe("Day17", () => {
  it("parses correctly", () => {
    const { register, program } = parse(example1);

    assert.deepStrictEqual(register, {
      A: 729n,
      B: 0n,
      C: 0n,
    });

    assert.deepStrictEqual(program, [ 0n, 1n, 5n, 4n, 3n, 0n ]);
  });

  it("calculates combo operand correctly", () => {
    const register = createRegister();

    assert.strictEqual(combo(0n, register), 0n);
    assert.strictEqual(combo(1n, register), 1n);
    assert.strictEqual(combo(2n, register), 2n);
    assert.strictEqual(combo(3n, register), 3n);
    assert.strictEqual(combo(4n, register), register.A);
    assert.strictEqual(combo(5n, register), register.B);
    assert.strictEqual(combo(6n, register), register.C);
    assert.throws(() => combo(7n, register));
  });

  it("calculates adv instruction correctly", () => {
    const register = createRegister();
    const input = 1n;
    const expected = register.A / 2n ** combo(input, register);

    const nextIP = INSTRUCTIONS[0](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.A, expected);
  });

  it("calculates bxl instruction correctly", () => {
    const register = createRegister();
    const input = 6n;
    const expected = register.B ^ input;

    const nextIP = INSTRUCTIONS[1](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates bst instruction correctly", () => {
    const register = createRegister();
    const input = 4n;
    const expected = register.A % 8n;

    const nextIP = INSTRUCTIONS[2](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates jnx instruction correctly", () => {
    const register = createRegister();

    register.A = 0n;
    assert.strictEqual(INSTRUCTIONS[3](6n, register, []), undefined);

    register.A = 1n;
    assert.strictEqual(INSTRUCTIONS[3](6n, register, []), 6n);
  });

  it("calculates bxc instruction correctly", () => {
    const register = createRegister();
    const input = 4n;
    const expected = register.B ^ register.C;

    const nextIP = INSTRUCTIONS[4](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates out instruction correctly", () => {
    const register = createRegister();
    const input = 4n;
    const expected = combo(input, register) % 8n;
    const output: bigint[] = [];

    const nextIP = INSTRUCTIONS[5](input, register, output);

    assert.strictEqual(nextIP, undefined);
    assert.deepStrictEqual(output, [ expected ]);
  });

  it("calculates bdv instruction correctly", () => {
    const register = createRegister();
    const input = 1n;
    const expected = register.A / 2n ** combo(input, register);

    const nextIP = INSTRUCTIONS[6](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates bdv instruction correctly", () => {
    const register = createRegister();
    const input = 1n;
    const expected = register.A / 2n ** combo(input, register);

    const nextIP = INSTRUCTIONS[6](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.B, expected);
  });

  it("calculates cdv instruction correctly", () => {
    const register = createRegister();
    const input = 1n;
    const expected = register.A / 2n ** combo(input, register);

    const nextIP = INSTRUCTIONS[7](input, register, []);

    assert.strictEqual(nextIP, undefined);
    assert.strictEqual(register.C, expected);
  });

  it("runs program example 1 correctly", () => {
    const register: Register = { A: 0n, B: 0n, C: 9n };
    const program: Program = [ 2n, 6n ];

    runProgram(program, register);

    assert.strictEqual(register.B, 1n);
  });

  it("runs program example 2 correctly", () => {
    const register: Register = { A: 10n, B: 0n, C: 0n };
    const program: Program = [ 5n, 0n, 5n, 1n, 5n, 4n ];

    const output = runProgram(program, register);

    assert.deepStrictEqual(output, [ 0n, 1n, 2n ]);
  });

  it("runs program example 3 correctly", () => {
    const register: Register = { A: 2024n, B: 0n, C: 0n };
    const program: Program = [ 0n, 1n, 5n, 4n, 3n, 0n ];

    const output = runProgram(program, register);

    assert.deepStrictEqual(output, [ 4n, 2n, 5n, 6n, 7n, 7n, 7n, 7n, 3n, 1n, 0n ]);
    assert.strictEqual(register.A, 0n);
  });

  it("runs program example 4 correctly", () => {
    const register: Register = { A: 0n, B: 29n, C: 0n };
    const program: Program = [ 1n, 7n ];

    runProgram(program, register);

    assert.strictEqual(register.B, 26n);
  });

  it("runs program example 5 correctly", () => {
    const register: Register = { A: 0n, B: 2024n, C: 43690n };
    const program: Program = [ 4n, 0n ];

    runProgram(program, register);

    assert.strictEqual(register.B, 44354n);
  });

  it("runs parsed example correctly", () => {
    const { program, register } = parse(example1);

    const output = runProgram(program, register);

    assert.deepStrictEqual(output, [ 4n, 6n, 3n, 5n, 6n, 3n, 5n, 2n, 1n, 0n ]);
  });

  it("brute force finds A initial value to product copy correctly for example 2", () => {
    const { program } = parse(example2);

    const A = findInitialAValue(program);

    assert.strictEqual(A, 117440n);
  });
});
