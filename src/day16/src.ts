import { MinPriorityQueue, NaiveMinPriorityQueue } from "../utils/data-structures";

const validTiles = [ ".", "#", "S", "E" ] as const;
type Tile = typeof validTiles[number];
type Vec2d = [number, number];
export type Map = {
  tiles: Tile[][],
  rows: number,
  cols: number,
  start: Vec2d,
  end: Vec2d,
}
type Direction = "N" | "E" | "S" | "W";
type Node = {
  key: string,
  pos: Vec2d
  dir: Direction
  prev: Node[]
  dist: number
}

export function part1(input: string) {
  const map = parse(input);

  const endNode = djikstra(map);

  console.log(endNode.dist);
}

export function part2(input: string) {
  const map = parse(input);

  const endNode = djikstra(map);
  const nNodes = traverse(endNode);

  console.log(nNodes);
}

export function parse(input: string): Map {
  const tiles = input
    .split("\n")
    .map((row) => row
      .split("")
      .filter((t): t is Tile => validTiles.includes(t as Tile))
    );
  const rows = tiles.length;
  const cols = tiles[0].length;
  const start: Vec2d = [ 1, rows - 2 ];
  const end: Vec2d = [ cols - 2, 1 ];

  return {
    tiles,
    rows,
    cols,
    start,
    end,
  };
}

function posKey(p: Vec2d) {
  return `${p[0]},${p[1]}`;
}
function fullKey(p: Vec2d, d: Direction) {
  return `${posKey(p)},${d}`;
}

export function djikstra(map: Map): Node {
  const handledNodes = new Set<string>();
  const queue: MinPriorityQueue<Node> = new NaiveMinPriorityQueue(
    (node) => node.dist,
    ({ pos, dir }) => fullKey(pos, dir)
  );

  queue.add({
    key: fullKey(map.start, "E"),
    pos: map.start,
    dir: "E",
    prev: [],
    dist: 0,
  });

  while (queue.size) {
    const node = queue.pop();
    const { pos, dir, dist } = node;

    if (pos[0] === map.end[0] && pos[1] === map.end[1]) {
      return node;
    }

    handledNodes.add(fullKey(pos, dir));

    const dirs: Record<Direction, Vec2d> = {
      N: [ pos[0], pos[1] - 1 ],
      E: [ pos[0] + 1, pos[1] ],
      S: [ pos[0], pos[1] + 1 ],
      W: [ pos[0] - 1, pos[1] ],
    };

    const table: Record<Direction, { pos: Vec2d, dir: Direction, cost: 1001 | 1}[]> = {
      N: [ { pos: dirs.N, dir: "N", cost: 1 }, { pos: dirs.W, dir: "W", cost: 1001 }, { pos: dirs.E, dir: "E", cost: 1001 } ],
      E: [ { pos: dirs.E, dir: "E", cost: 1 }, { pos: dirs.N, dir: "N", cost: 1001 }, { pos: dirs.S, dir: "S", cost: 1001 } ],
      S: [ { pos: dirs.S, dir: "S", cost: 1 }, { pos: dirs.E, dir: "E", cost: 1001 }, { pos: dirs.W, dir: "W", cost: 1001 } ],
      W: [ { pos: dirs.W, dir: "W", cost: 1 }, { pos: dirs.S, dir: "S", cost: 1001 }, { pos: dirs.N, dir: "N", cost: 1001 } ],
    };

    const possibles = table[dir]
      .filter((t) => map.tiles[t.pos[1]][t.pos[0]] !== "#")
      .filter((t) => !handledNodes.has(fullKey(t.pos, t.dir)));

    for (const possible of possibles) {
      const alt = dist + possible.cost;
      const key = fullKey(possible.pos, possible.dir);
      if (!queue.has(key)) {
        queue.add({
          key,
          pos: possible.pos,
          dir: possible.dir,
          prev: [],
          dist: Infinity,
        });
      }
      const neighbor = queue.get(key)!;
      if (alt <= neighbor.dist) {
        neighbor.dist = alt;
        neighbor.prev.push(node);
      }
    }
  }

  return {
    key: "---",
    pos: [ -1, -1 ],
    dir: "N",
    dist: Infinity,
    prev: [],
  };
}

export function traverse(node: Node): number {
  const visited = new Set<string>([ posKey(node.pos) ]);

  function recursive(n: Node, v: Set<string>) {
    for (const prev of n.prev) {
      v.add(posKey(prev.pos));
      recursive(prev, v);
    }
  }

  recursive(node, visited);

  return visited.size;
}
