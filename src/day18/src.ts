import { equals } from "../utils/array";
import { MinHeapPriorityQueue, MinPriorityQueue } from "../utils/data-structures";

type Vec2d = [number, number];

export function part1(input: string) {
  const parsed = parse(input);
  const obstacles = parsed
    .slice(0, 1024)
    .map((p) => posKey(p));

  const paths = aStar([ 0, 0 ], [ 70, 70 ], new Set(obstacles));
  const result = paths.length - 1;

  console.log(result);
}

export function part2(input: string) {
  const parsed = parse(input);
  let nBytes = 1024;

  while (nBytes < parsed.length) {
    const obstacles = parsed
      .slice(0, nBytes)
      .map((p) => posKey(p));

    const paths = aStar([ 0, 0 ], [ 70, 70 ], new Set(obstacles));

    if (paths.length === 0) {
      console.log(parsed[nBytes - 1].join(","));
      break;
    }
    nBytes++;
  }
}

export function parse(input: string): Vec2d[] {
  return input
    .split("\n")
    .map((row) => row
      .split(",")
      .map(Number)
    )
    .filter((b): b is Vec2d => b.length === 2);
}

export function posKey(v: Vec2d) {
  return `${v[0]},${v[1]}`;
}

export function manhattanDistance(v1: Vec2d, v2: Vec2d): number {
  return Math.abs(v1[0] - v2[0]) + Math.abs(v1[0] - v2[0]);
}

export function aStar(start: Vec2d, end: Vec2d, obstacles: Set<string>): Vec2d[] {
  const gridSizeX = end[0] + 1;
  const gridSizeY = end[1] + 1;

  const pos: Record<string, Vec2d> = {};
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const cameFrom: Record<string, string | null> = {};

  for (let r = 0; r < gridSizeY; r++) {
    for (let c = 0; c < gridSizeX; c++) {
      const vec: Vec2d = [ c, r ];
      const key = posKey(vec);
      pos[key] = vec;
      gScore[key] = Infinity;
      fScore[key] = Infinity;
    }
  }

  const startKey = posKey(start);
  const openSet: MinPriorityQueue<string> = new MinHeapPriorityQueue<string>((k) => fScore[k], (k) => k);
  openSet.add(startKey);
  gScore[startKey] = 0;
  fScore[startKey] = manhattanDistance(start, end);
  cameFrom[startKey] = null;

  while (openSet.size) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentKey = openSet.pop()!;
    const currentPos = pos[currentKey];

    if (equals(currentPos, end)) {
      const result: Vec2d[] = [ end ];
      let prev = cameFrom[posKey(end)];
      while (prev !== null) {
        result.push(pos[prev]);
        prev = cameFrom[prev];
      }
      return result;
    }

    const neighbors = [
      [ currentPos[0], currentPos[1] - 1 ] as Vec2d,
      [ currentPos[0] + 1, currentPos[1] ] as Vec2d,
      [ currentPos[0], currentPos[1] + 1 ] as Vec2d,
      [ currentPos[0] - 1, currentPos[1] ] as Vec2d,
    ]
      .filter(([ x, y ]) => x >= 0 && x < gridSizeX && y >= 0 && y < gridSizeY)
      .filter((p) => !obstacles.has(posKey(p)));

    for (const neighbor of neighbors) {
      const neighborKey = posKey(neighbor);
      const tentativeGScore = gScore[currentKey] + 1;
      if (tentativeGScore < gScore[neighborKey]) {
        cameFrom[neighborKey] = currentKey;
        gScore[neighborKey] = tentativeGScore;
        fScore[neighborKey] = tentativeGScore + manhattanDistance(neighbor, end);
        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        }
      }
    }
  }
  return [ ];
}
