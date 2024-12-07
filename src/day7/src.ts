type Calibration = {
  testValue: number,
  numbers: number[],
};
type Operation = (n1: number, n2: number) => number;

const add: Operation = (n1, n2) => n1 + n2;
const mul: Operation = (n1, n2) => n1 * n2;
const cct: Operation = (n1, n2) => Number(`${n1}${n2}`);

export const opsAddMul = [ add, mul ];
export const opsAddMulCct = [ add, mul, cct ];

export function part1(input: string) {
  const result = parse(input)
    .filter((c) => isValidCalibration(c, opsAddMul))
    .map(({ testValue }) => testValue)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function part2(input: string) {
  const result = parse(input)
    .filter((c) => isValidCalibration(c, opsAddMulCct))
    .map(({ testValue }) => testValue)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function parse(input: string): Calibration[] {
  return input
    .split("\n")
    .map((row) => {
      const [ testValue, numbers ] = row.split(": ");
      return {
        testValue: Number(testValue),
        numbers: numbers.split(" ").map(Number),
      };
    });
}

export function isValidCalibration({ testValue, numbers }: Calibration, operations: Operation[]): boolean {
  if (numbers.length === 1) return numbers[0] === testValue;
  if (numbers[0] > testValue) return false;

  const [ n1, n2 ] = numbers.slice(0, 2);
  return operations
    .reduce((isValid, op) => {
      return (isValid
        || isValidCalibration({ testValue, numbers: [ op(n1, n2), ...numbers.slice(2) ] }, operations)
      );
    }, false);
}
