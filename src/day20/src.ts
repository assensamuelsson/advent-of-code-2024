import { MinPriorityQueue, NaiveMinPriorityQueue } from "../utils/data-structures";

const WALL = "#";
const EMPTY = ".";
const START = "S";
const END = "E";
const validTypes = [ WALL, EMPTY, START, END ] as const;

type Vec2d = [number, number];
type Tile = typeof validTypes[number];
type Node = {
  pos: Vec2d
  tile: Tile
  dist: number
  prev?: Node | null
  next?: Node | null
}
type Map = {
  start: Node,
  end: Node,
  rows: number,
  cols: number,
  nodes: Node[][],
}

export function part1(input: string) {
  const map = parse(input);
  dijkstra(map);
  const result = findAllCheats(map)
    .filter((c) => c >= 100)
    .length;

  console.log(result);
}

export function part2(input: string) {
  const map = parse(input);
  dijkstra(map);
  const result = findAllCheats(map, 20)
    .filter((c) => c >= 100)
    .length;

  console.log(result);
}

export function parse(input: string): Map {
  const nodes: Node[][] = input
    .split("\n")
    .map((l, r) => l
      .split("")
      .filter((t): t is Tile => validTypes.includes(t as Tile))
      .map((t, c) => ({ pos: [ c, r ], tile: t, dist: Infinity }))
    );
  const rows = nodes.length;
  const cols = nodes[0].length;

  let start = nodes[0][0];
  let end = nodes[0][0];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = nodes[r][c].tile;
      if (tile === START) {
        start = nodes[r][c];
        start.prev = null;
      } else if (tile === END) {
        end = nodes[r][c];
        end.next = null;
        end.dist = 0;
      }
    }
  }

  return {
    start,
    end,
    rows,
    cols,
    nodes,
  };
}

export function posKey(v: Vec2d) {
  return `${v[0]},${v[1]}`;
}

export function dijkstra(map: Map) {
  const queue: MinPriorityQueue<Node> = new NaiveMinPriorityQueue((n) => n.dist, (n) => posKey(n.pos));
  map.nodes.flat().forEach((n) => queue.add(n));

  while (queue.size) {
    const node = queue.pop();
    const { pos, dist, tile } = node;

    if (tile === WALL) {
      return;
    }

    const neighbors: Node[] = [
      map.nodes[pos[1] - 1][pos[0]],
      map.nodes[pos[1] + 1][pos[0]],
      map.nodes[pos[1]][pos[0] + 1],
      map.nodes[pos[1]][pos[0] - 1],
    ];

    const possibles = neighbors
      .filter((n) => n.tile !== WALL && queue.has(posKey(n.pos)));

    for (const neighbor of possibles) {
      const alt = dist + 1;
      if (alt < neighbor.dist) {
        neighbor.dist = alt;
        neighbor.next = node;
        node.prev = neighbor;
      }
    }
  }
}

export function findCheats(node: Node, map: Map, cheatSteps = 2): number[] {
  const { pos } = node;

  return allPosWithinSteps(pos, cheatSteps)
    .filter((p) => p[0] >= 0 && p[0] < map.cols && p[1] >= 0 && p[1] < map.rows)
    .map((p) => node.dist - map.nodes[p[1]][p[0]].dist - (Math.abs(p[0] - node.pos[0]) + Math.abs(p[1] - node.pos[1])))
    .filter((dist) => dist > 0);
}

export function findAllCheats(map: Map, cheatSteps = 2): number[] {
  const acc: number[][] = [];

  let node: Node | null | undefined = map.start;
  while (node) {
    acc.push(findCheats(node, map, cheatSteps));
    node = node.next;
  }
  return acc.flat();
}

export function allPosWithinSteps(p: Vec2d, steps: number): Vec2d[] {
  const result: Vec2d[] = [];
  for (let y = -steps; y <= steps; y++) {
    for (let x = -steps; x <= steps; x++) {
      if (Math.abs(x) + Math.abs(y) <= steps) {
        result.push([ p[0] + x, p[1] + y ]);
      }
    }
  }
  return result;
}
