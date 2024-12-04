import { product } from "../utils/array";

type Point = [ number, number ];
type GridSize = {
  rows: number,
  cols: number,
}

type WordSearch = GridSize & {
  matrix: string[],
};

export function part1(input: string) {
  const wordSearch = parse(input);
  const xs = Array.from({ length: wordSearch.cols }, (_, i) => i);
  const ys = Array.from({ length: wordSearch.rows }, (_, i) => i);
  const result = product(xs, ys)
    .map((p: Point) => allValidDirections(p, wordSearch))
    .flat()
    .map((path) => createWord(path, wordSearch))
    .filter((word) => word === "XMAS")
    .length;

  console.log(result);
}

export function part2(input: string) {
  const wordSearch = parse(input);
  const xs = Array.from({ length: wordSearch.cols }, (_, i) => i);
  const ys = Array.from({ length: wordSearch.rows }, (_, i) => i);
  const result = product(xs, ys)
    .map((p: Point) => allCrossValidDirections(p, wordSearch))
    .filter((paths) => paths.length === 4)
    .map((paths) => paths
      .map((path) => createWord(path, wordSearch))
    )
    .map((words) => words.reduce((acc, curr) => curr === "MAS" ? acc + 1 : acc, 0))
    .filter((n) => n === 2)
    .length;

  console.log(result);
}

export function parse(input: string): WordSearch {
  const matrix = input.split("\n");
  return {
    matrix,
    rows: matrix.length,
    cols: matrix[0].length,
  };
}

export function allValidDirections(point: Point, { rows, cols }: GridSize): Point[][] {
  const directions: ((p: Point) => Point)[] = [
    (p: Point) => [ p[0] + 1, p[1] ], // E
    (p: Point) => [ p[0] + 1, p[1] - 1 ], // NE
    (p: Point) => [ p[0], p[1] - 1 ], // N
    (p: Point) => [ p[0] - 1, p[1] - 1 ], // NW
    (p: Point) => [ p[0] - 1, p[1] ], // W
    (p: Point) => [ p[0] - 1, p[1] + 1 ], // SW
    (p: Point) => [ p[0], p[1] + 1 ], // S
    (p: Point) => [ p[0] + 1, p[1] + 1 ], // SE
  ];

  return directions
    .map((d) => {
      const path = [ point ];
      for (let i = 0; i < 3; i++) {
        path.push(d(path.at(-1)!));
      }
      return path;
    })
    .filter((path) => path.every(([ x, y ]) => x >= 0 && x < cols && y >= 0 && y < rows));
}

export function createWord(path: Point[], { matrix }: WordSearch) {
  return path
    .map(([ x, y ]) => matrix[y].at(x))
    .join("");
}

export function allCrossValidDirections(p: Point, { rows, cols }: GridSize): Point[][] {
  if (p[0] < 1 || p[0] > cols - 2 || p[1] < 1 || p[1] > rows - 2) return [];
  return [
    [ [ p[0] - 1, p[1] - 1 ], [ p[0], p[1] ], [ p[0] + 1, p[1] + 1 ] ] as Point[], // Going SE
    [ [ p[0] + 1, p[1] - 1 ], [ p[0], p[1] ], [ p[0] - 1, p[1] + 1 ] ] as Point[], // Going SW
    [ [ p[0] + 1, p[1] + 1 ], [ p[0], p[1] ], [ p[0] - 1, p[1] - 1 ] ] as Point[], // Going NW
    [ [ p[0] - 1, p[1] + 1 ], [ p[0], p[1] ], [ p[0] + 1, p[1] - 1 ] ] as Point[], // Going NE
  ];
}
