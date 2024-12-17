import { equals } from "../utils/array";

export type Register = {
  A: bigint,
  B: bigint,
  C: bigint,
};
export type Operand = bigint;
export type Program = bigint[];

type InstructionPointer = bigint;
type Instruction = (operand: Operand, register: Register, output: bigint[]) => InstructionPointer | undefined;

export function part1(input: string) {
  const { program, register } = parse(input);

  const output = runProgram(program, register);

  const result = output.join(",");
  console.log(result);
}

export function part2(input: string) {
  const { program } = parse(input);

  const result = findInitialAValue(program);

  console.log(result);
  // too high 2124809506397400
}

export function parse(input: string): { register: Register, program: Program } {
  const rows = input.split("\n");

  const register: Register = {
    A: BigInt(rows[0].slice(12)),
    B: BigInt(rows[1].slice(12)),
    C: BigInt(rows[2].slice(12)),
  };

  const program = rows[4]
    .slice(9)
    .split(",")
    .map((v) => BigInt(v) % BigInt(8))
    .filter((v): v is Operand => v >= 0 && v < 8);

  return {
    register,
    program,
  };
}

export function combo(operand: Operand, register: Register): bigint {
  if (operand >= 0 && operand <= 3) {
    return operand;
  } else if (operand === BigInt(4)) {
    return register.A;
  } else if (operand === BigInt(5)) {
    return register.B;
  } else if (operand === BigInt(6)) {
    return register.C;
  } else {
    throw new Error("Invalid operand to combo");
  }
}

function adv(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  register.A = register.A / BigInt(Math.floor(Math.pow(2, Number(combo(operand, register)))));
  return undefined;
}

function bxl(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  register.B = register.B ^ BigInt(operand);
  return undefined;
}

function bst(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  register.B = combo(operand, register) % BigInt(8);
  return undefined;
}

function jnz(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  return register.A === 0n ? undefined : BigInt(operand);
}

function bxc(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  register.B = register.B ^ register.C;
  return undefined;
}

function out(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  output.push(combo(operand, register) % BigInt(8));
  return undefined;
}

function bdv(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  register.B = register.A / BigInt(Math.floor(Math.pow(2, Number(combo(operand, register)))));
  return undefined;
}

function cdv(operand: Operand, register: Register, output: bigint[]): InstructionPointer | undefined {
  register.C = register.A / BigInt(Math.floor(Math.pow(2, Number(combo(operand, register)))));
  return undefined;
}

export const INSTRUCTIONS: Record<number, Instruction> = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
};

export function runProgram(program: Program, register: Register): bigint[] {
  const output: bigint[] = [];
  let instructionPointer = 0n;
  while (instructionPointer >= 0 && instructionPointer < program.length) {
    const instructionId = program[Number(instructionPointer)];
    const operand = program[Number(instructionPointer + 1n)];
    const maybeNextInstructionPointer = INSTRUCTIONS[Number(instructionId)](operand, register, output);
    instructionPointer = maybeNextInstructionPointer !== undefined ? maybeNextInstructionPointer : instructionPointer + 2n;
  }
  return output;
}

export function runProgram2(A: bigint): bigint[] {
  const result: bigint[] = [];
  while (A > 0) {
    // result.push((((A % 8n) ^ (A / BigInt(Math.pow(2, Number(((A % 8n) ^ 7n)))))) % 8n));
    result.push((((A % 8n) ^ (A / (2n ** (((A % 8n) ^ 7n))))) % 8n));
    A /= 8n;
  }
  return result;
}

export function findInitialAValue(program: Program): bigint {
  let A = 1n;
  let upto = 1;
  const revProgram = program.toReversed();

  while (true) {
    // const output = runProgram(program, { A, B: 0n, C: 0n });
    const output = runProgram2(A);
    if (equals(output, program)) {
      break;
    }
    if (equals(output.toReversed().slice(0, upto), revProgram.slice(0, upto))) {
      A *= 8n;
      upto++;
    } else {
      A++;
    }
  }

  return A;
}
