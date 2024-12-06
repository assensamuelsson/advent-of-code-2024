import { product } from "../utils/array";
import { Vec, crossProduct } from "../utils/math";

type Guard = {
  p: Vec,
  v: Vec,
}
type Obstacles = Set<string>;
type Map = {
  cols: number,
  rows: number,
  obstacles: Obstacles,
}

export function part1(input: string) {
  const { guard, map } = parse(input);
  const result = visitedPositions(guard, map);

  console.log(result);
}

export function part2(input: string) {
  const { guard, map } = parse(input);
  const result = numberOfLoops(guard, map);

  console.log(result);
}

function posKey(p: Vec) {
  return `${p[0]},${p[1]}`;
}
function posVelKey(p: Vec, v: Vec) {
  return `${p[0]},${p[1]},${v[0]},${v[1]}`;
}

export function parse(input: string): { guard: Guard, map: Map } {
  const matrix = input.split("\n");
  const rows = matrix.length;
  const cols = matrix[0].length;

  const obstacles = new Set<string>();
  const guard: Guard = {
    p: [ 0, 0, 0 ],
    v: [ 0, -1, 0 ],
  };

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const char = matrix[r].at(c);
      if (char === "#") obstacles.add(`${c},${r}`);
      else if (char === "^") {
        guard.p = [ c, r, 0 ];
      }
    }
  }

  return {
    guard,
    map: {
      rows,
      cols,
      obstacles,
    },
  };
}

export function walk(guard: Guard, obstacles: Obstacles): Guard {
  const to = [
    guard.p[0] + guard.v[0],
    guard.p[1] + guard.v[1],
    guard.p[2] + guard.v[2],
  ] as Vec;

  if (obstacles.has(posKey(to))) {
    guard.v = crossProduct(guard.v, [ 0, 0, -1 ]);
  } else {
    guard.p = to;
  }

  return guard;
}

export function visitedPositions(guard: Guard, map: Map): number {
  const uniquePositions = new Set();

  while (guard.p[0] >= 0 && guard.p[0] < map.cols && guard.p[1] >= 0 && guard.p[1] < map.rows) {
    uniquePositions.add(posKey(guard.p));
    guard = walk(guard, map.obstacles);
  }

  return uniquePositions.size;
}

export function isLoop(startingPosition: Guard, map: Map, newObstacle: Vec) {
  let guard = structuredClone(startingPosition);
  const newObstacles = new Set(map.obstacles);
  newObstacles.add(posKey(newObstacle));

  const uniquePosVels = new Set<string>();

  while (guard.p[0] >= 0 && guard.p[0] < map.cols && guard.p[1] >= 0 && guard.p[1] < map.rows) {
    if (uniquePosVels.has(posVelKey(guard.p, guard.v))) return true;
    uniquePosVels.add(posVelKey(guard.p, guard.v));
    guard = walk(guard, newObstacles);
  }
  return false;
}

export function numberOfLoops(guard: Guard, map: Map): number {
  return product(
    Array.from({ length: map.cols }, (_, i) => i),
    Array.from({ length: map.rows }, (_, i) => i)
  )
    .filter(([ x, y ]) => (!map.obstacles.has(posKey([ x, y, 0 ])) && !(guard.p[0] === x && guard.p[1] === y)))
    .filter(([ x, y ]) => isLoop(guard, map, [ x, y, 0 ]))
    .length;
}
