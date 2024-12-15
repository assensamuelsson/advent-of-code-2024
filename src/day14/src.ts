import crypto from "node:crypto";

import { vAdd, Vec, vMod } from "../utils/math";

type Robot = {
  p: Vec,
  v: Vec,
}
type QuadrantCount = [number, number, number, number];

export function part1(input: string) {
  let robots = parse(input);
  const space: Vec = [ 101, 103, 0 ];
  for (let i = 0; i < 100; i++) {
    robots = step(robots, space);
  }
  const result = count(robots, space)
    .reduce((acc, curr) => acc * curr);

  console.log(result);
}
// 10 70 111 414 482
export function part2(input: string) {
  function printMatrix(matrix: number[][], seconds: number, space: Vec) {
    console.log(`*** second ${seconds} ***`);
    console.log("-".repeat(space[0] + 2));
    matrix.forEach((r) => console.log(`|${String.fromCharCode(...r)}|`));
    console.log(`${"-".repeat(space[0] + 2)}\n\n`);
  }

  const space: Vec = [ 101, 103, 0 ];
  let robots = parse(input);
  let seconds = 0;
  let found = false;

  while (!found) {
    robots = step(robots, space);
    seconds++;

    const matrix: number[][] = Array.from({ length: space[1] }, () => Array(space[0]).fill(46));
    robots.forEach((robot) => {
      matrix[robot.p[1]][robot.p[0]] = 42;
    });

    for (const row of matrix) {
      let c = 0;
      for (const s of row) {
        c = s === 46 ? 0 : c + 1;
        if (c > 10) {
          printMatrix(matrix, seconds, space);
          found = true;
          found = true;
          break;
        }
      }
      if (found) break;
    }

  }
}

export function parse(input: string): Robot[] {
  const regex = /p=(?<px>-?\d+),(?<py>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/;

  return input
    .split("\n")
    .map((row) => {
      const match = row.match(regex);

      const px = Number(match?.groups?.px) || 0;
      const py = Number(match?.groups?.py) || 0;
      const vx = Number(match?.groups?.vx) || 0;
      const vy = Number(match?.groups?.vy) || 0;
      return {
        p: [ px, py, 0 ],
        v: [ vx, vy, 0 ],
      };
    });
}

export function step(robots: Robot[], space: Vec): Robot[] {
  return robots
    .map((robot) => {
      return { p: vMod(vAdd(vAdd(robot.p, robot.v), space), space), v: robot.v };
    });
}

export function count(robots: Robot[], space: Vec): QuadrantCount {
  const result: QuadrantCount = [ 0, 0, 0, 0 ];
  robots.forEach(({ p: [ x, y ] }) => {
    if (x < (space[0] - 1) / 2 && y < (space[1] - 1) / 2) result[0] += 1;
    else if (x > (space[0] - 1) / 2 && y < (space[1] - 1) / 2) result[1] += 1;
    else if (x < (space[0] - 1) / 2 && y > (space[1] - 1) / 2) result[2] += 1;
    else if (x > (space[0] - 1) / 2 && y > (space[1] - 1) / 2) result[3] += 1;
  });
  return result;
}
