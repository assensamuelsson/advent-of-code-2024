export function part1(input: string) {
  const result = parse(input)
    .filter(isSafe)
    .length;

  console.log(result);
}

export function part2(input: string) {
  const result = parse(input)
    .filter(isSafeWithDampening)
    .length;

  console.log(result);
}

type Level = number;
type Report = Level[];

export function parse(input: string): Report[] {
  return input
    .split("\n")
    .map((line) => line
      .split(" ")
      .map(Number)
    );
}

export function isSafe(report: Report): boolean {
  let increasing: boolean | undefined;
  for (let i = 1; i < report.length; i++) {
    const diff = report[i] - report[i - 1];
    const absDiff = Math.abs(diff);
    if (increasing === undefined) increasing = diff > 0;
    if (absDiff < 1 || absDiff > 3 || (increasing !== diff > 0)) {
      return false;
    }
  }
  return true;
}

export function isSafeWithDampening(report: Report): boolean {
  return report
    .map((_, i) => report.slice(0, i).concat(report.slice(i + 1)))
    .some(isSafe);
}
