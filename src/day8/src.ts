import { uniquePairs } from "../utils/array";
import { vAdd, vSub, type Vec } from "../utils/math";

type GridSize = {
  rows: number,
  cols: number,
};

type Map = GridSize & {
  antennas: Record<string, Vec[]>
};

export function part1(input: string) {
  const map = parse(input);
  const result = new Set(Object.values(map.antennas)
    .map(allAntinodes)
    .flat()
    .filter(([ x, y ]) => x >= 0 && x < map.cols && y >= 0 && y < map.rows)
    .map(([ x, y ]) => `${x},${y}`))
    .size;

  console.log(result);
}

export function part2(input: string) {
  const map = parse(input);
  const result = new Set(Object.values(map.antennas)
    .map((a) => allAntinodesResonantHarmonics(a, map))
    .flat()
    .map(([ x, y ]) => `${x},${y}`))
    .size;

  console.log(result);
}

export function parse(input: string): Map {
  const matrix = input.split("\n");
  const rows = matrix.length;
  const cols = matrix[0].length;

  const result: Map = { rows, cols, antennas: {} };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const char = matrix[r].at(c) ?? ".";
      if (char !== ".") {
        result.antennas[char] ??= [];
        result.antennas[char].push([ c, r, 0 ]);
      }
    }
  }

  return result;
}

export function antinodes(a1: Vec, a2: Vec): Vec[] {
  return [ vAdd(a1, vSub(a1, a2)), vAdd(a2, vSub(a2, a1)) ];
}

export function antinodesResonantHarmonics(a1: Vec, a2: Vec, { cols, rows }: GridSize): Vec[] {
  const result: Vec[] = [ a1, a2 ];

  let dir = vSub(a1, a2);
  let possible = vAdd(a1, dir);
  while (possible[0] >= 0 && possible[0] < cols && possible[1] >= 0 && possible[1] < rows) {
    result.push(possible);
    possible = vAdd(possible, dir);
  }

  dir = vSub(a2, a1);
  possible = vAdd(a2, dir);
  while (possible[0] >= 0 && possible[0] < cols && possible[1] >= 0 && possible[1] < rows) {
    result.push(possible);
    possible = vAdd(possible, dir);
  }

  return result;
}

export function allAntinodes(antennas: Vec[]): Vec[] {
  const result = [];
  for (const [ a1, a2 ] of uniquePairs(antennas)) {
    result.push(antinodes(a1, a2));
  }
  return result.flat();
}

export function allAntinodesResonantHarmonics(antennas: Vec[], bounds: GridSize): Vec[] {
  const result = [];
  for (const [ a1, a2 ] of uniquePairs(antennas)) {
    result.push(antinodesResonantHarmonics(a1, a2, bounds));
  }
  return result.flat();
}
