type Point = [number, number];
type Map = {
  heightMap: number[][],
  rows: number,
  cols: number,
  trailHeads: Point[],
};

export function part1(input: string) {
  const map = parse(input);
  const result = map
    .trailHeads
    .map((point) => nHikingTrails(point, map, false))
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function part2(input: string) {
  const map = parse(input);
  const result = map
    .trailHeads
    .map((point) => nHikingTrails(point, map, true))
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function parse(input: string): Map {
  const heightMap = input
    .split("\n")
    .map((row) => row
      .split("").map(Number)
    );
  const rows = heightMap.length;
  const cols = heightMap[0].length;
  const trailHeads: Point[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (heightMap[y][x] === 0) {
        trailHeads.push([ x, y ]);
      }
    }
  }

  return {
    heightMap,
    rows,
    cols,
    trailHeads,
  };
}

export function nHikingTrails(p: Point, { heightMap, rows, cols }: Pick<Map, "heightMap" | "cols" | "rows">, distinct: boolean, found: Set<string> = new Set()): number {
  const currentHeight = heightMap[p[1]][p[0]];
  const foundKey = `${p[0]},${p[1]}`;

  if (currentHeight === 9 && distinct) {
    return 1;
  } else if (currentHeight === 9 && found.has(foundKey)) {
    return 0;
  } else if (currentHeight === 9) {
    found.add(foundKey);
    return 1;
  }

  const dirs = [
    [ p[0] + 1, p[1] ] as Point,
    [ p[0] - 1, p[1] ] as Point,
    [ p[0], p[1] + 1 ] as Point,
    [ p[0], p[1] - 1 ] as Point,
  ]
    .filter(([ x, y ]) => x >= 0 && x < cols && y >= 0 && y < rows)
    .filter(([ x, y ]) => heightMap[y][x] === currentHeight + 1);

  return dirs
    .reduce((acc, point) => acc + nHikingTrails(point, { heightMap, rows, cols }, distinct, found), 0);
}
