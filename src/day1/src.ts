export function part1(input: string) {
  const parsed = parse(input);
  const sorted = sort(parsed);
  const diffs = diff(sorted);
  const sum = diffs.reduce((acc, curr) => acc + curr);

  console.log(sum);
}

export function part2(input: string) {
  const parsed = parse(input);
  const result = parsed[0]
    .reduce((acc, curr) => acc + curr * occurrences(curr, parsed[1]), 0);

  console.log(result);
}

type Element = number;
type List = Element[];
type Lists = [List, List];

export function parse(input: string): Lists {
  const left = [];
  const right = [];
  for (const row of input.split("\n")) {
    if (row.length === 0) continue; // Last line
    const [ l, r ] = row.split(" ").filter(Boolean);
    left.push(Number(l));
    right.push(Number(r));
  }
  return [ left, right ];
}

export function sort(lists: Lists): Lists {
  return [
    lists[0].toSorted(),
    lists[1].toSorted(),
  ];
}

export function diff(lists: Lists): List {
  const diffs = [];
  for (let i = 0; i < lists[0].length; i++) {
    diffs.push(Math.abs(lists[0][i] - lists[1][i]));
  }
  return diffs;
}

export function occurrences(value: Element, list: List): number {
  return list
    .filter((v) => v === value)
    .reduce((acc) => acc + 1, 0);
}
