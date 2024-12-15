const WALL = "#";
const BOX = "O";
const ROBOT = "@";
const EMPTY = ".";
const LEFT_BOX = "[";
const RIGHT_BOX = "]";
type Tile = typeof WALL | typeof BOX | typeof ROBOT | typeof EMPTY | typeof LEFT_BOX | typeof RIGHT_BOX;

export type Vec2d = [number, number];
export type Map = {
  robot: Vec2d,
  tiles: Tile[][]
}

const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";
type Instruction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;

export function part1(input: string) {
  const { map, instructions } = parse(input);

  for (const instruction of instructions) {
    step(map, instruction);
  }

  const result = sumBoxes(map.tiles);

  console.log(result);
}

export function part2(input: string) {
  const { map, instructions } = parse(input, { wide: true });

  for (const instruction of instructions) {
    step(map, instruction);
  }

  const result = sumBoxes(map.tiles);

  console.log(result);
}

type ParseOptions = {
  wide?: boolean,
};

export function parse(input: string, { wide = false }: ParseOptions = {}): { map: Map, instructions: Instruction[] } {
  const parts = input.split("\n\n");

  const validTiles = new Set<string>([ WALL, BOX, ROBOT, EMPTY, LEFT_BOX, RIGHT_BOX ]);
  const robot: Vec2d = [ -1, -1 ];
  const tiles = parts[0]
    .split("\n")
    .map((row) => row.split(""))
    .map((row) => row
      .map((c) => {
        if (wide) {
          if (c === BOX) {
            return [ LEFT_BOX, RIGHT_BOX ];
          } else if (c === ROBOT) {
            return [ ROBOT, EMPTY ];
          } else {
            return [ c, c ];
          }
        } else {
          return c;
        }
      })
      .flat()
      .filter((t): t is Tile => validTiles.has(t))
    );

  for (let r = 0; r < tiles.length; r++) {
    for (let c = 0; c < tiles[0].length; c++) {
      if (tileAt(tiles, [ c, r ]) === ROBOT) {
        robot[0] = c;
        robot[1] = r;
      }
    }
  }

  const validInstructions = new Set<string>([ UP, DOWN, LEFT, RIGHT ]);
  const instructions = parts[1]
    .split("\n")
    .join("")
    .split("")
    .filter((i): i is Instruction => validInstructions.has(i));

  return {
    map: { tiles, robot },
    instructions,
  };
}

function tileAt(tiles: Map["tiles"], p: Vec2d): Tile {
  return tiles[p[1]][p[0]];
}

type Move = (pos: Vec2d) => Vec2d;
export function step(map: Map, instruction: Instruction): void {
  const directionMap: Record<Instruction, Move> = {
    [UP]: ([ x, y ]) => [ x, y - 1 ],
    [DOWN]: ([ x, y ]) => [ x, y + 1 ],
    [LEFT]: ([ x, y ]) => [ x - 1, y ],
    [RIGHT]: ([ x, y ]) => [ x + 1, y ],
  };
  const dir = directionMap[instruction];

  const pushStack: Vec2d[][] = [ [ map.robot ] ];
  while (pushStack.at(-1)?.every((p) => [ ROBOT, BOX, LEFT_BOX, RIGHT_BOX ].includes(tileAt(map.tiles, p)))) {
    const result: Vec2d[] = [];
    const tos = pushStack[pushStack.length - 1].map(dir);
    for (const to of tos) {
      if (instruction === UP || instruction === DOWN) {
        if (tileAt(map.tiles, to) === LEFT_BOX && !tos.some((p) => p[0] === to[0] + 1 && p[1] === to[1])) {
          result.push([ to[0] + 1, to[1] ]);
        } else if (tileAt(map.tiles, to) === RIGHT_BOX && !tos.some((p) => p[0] === to[0] - 1 && p[1] === to[1])) {
          result.push([ to[0] - 1, to[1] ]);
        }
      }
      result.push(to);
    }
    if (result.some((p) => tileAt(map.tiles, p) !== EMPTY)) {
      pushStack.push(result.filter((p) => tileAt(map.tiles, p) !== EMPTY));
    } else {
      pushStack.push(result);
    }
  }

  if (pushStack[pushStack.length - 1].some((p) => tileAt(map.tiles, p) === WALL)) {
    return;
  }

  pushStack.pop();
  while (pushStack.length >= 1) {
    const froms = pushStack.pop()!;
    const tos = froms?.map(dir);
    for (let i = 0; i < froms.length; i++) {
      const to = tos[i];
      const from = froms[i];
      map.tiles[to[1]][to[0]] = tileAt(map.tiles, from);
      map.tiles[from[1]][from[0]] = EMPTY;

      if (pushStack.length === 0 && tileAt(map.tiles, to) === ROBOT) {
        map.robot = to;
      }
    }
  }
}

export function sumBoxes(tiles: Map["tiles"]): number {
  let sum = 0;
  for (let r = 0; r < tiles.length; r++) {
    for (let c = 0; c < tiles[0].length; c++) {
      const tile = tileAt(tiles, [ c, r ]);
      if (tile === BOX || tile === LEFT_BOX) {
        sum += 100 * r + c;
      }
    }
  }

  return sum;
}
