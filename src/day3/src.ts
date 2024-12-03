type InstructionType = "mul" | "do" | "don't";
type BaseInstruction<T extends InstructionType> = {
  instruction: T;
};
type Instruction<T extends InstructionType> = T extends "mul" ? BaseInstruction<T> & {
  n1: number;
  n2: number;
} : BaseInstruction<T>;

export function part1(input: string) {
  const result = findInstructions(input)
    .filter((instruction): instruction is Instruction<"mul"> => instruction.instruction === "mul")
    .map(({ n1, n2 }) => n1 * n2)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function part2(input: string) {
  const result = findInstructions(input)
    .filter(enabledMuls())
    .map(({ n1, n2 }) => n1 * n2)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function findInstructions(input: string): Instruction<InstructionType>[] {
  const instructions: Instruction<InstructionType>[] = [];

  for (const [ _, instruction, n1, n2 ] of input.matchAll(/(mul|don't|do)\((?:(\d+),(\d+))?\)/g)) {
    if (instruction === "mul") {
      instructions.push({
        instruction: instruction as "mul",
        n1: Number(n1),
        n2: Number(n2),
      });
    } else {
      instructions.push({ instruction: instruction as "do" | "don't" });
    }
  }

  return instructions;
}

export function enabledMuls() {
  let enabled = true;

  return (i: Instruction<InstructionType>): i is Instruction<"mul"> => {
    if (i.instruction === "mul" && enabled) return true;
    else if (i.instruction === "do") enabled = true;
    else if (i.instruction === "don't") enabled = false;
    return false;
  };
}
