type Vec2d = [number, number];

export function numericKeypad(key: string): Vec2d {
  switch (key) {
    case "7": return [ 0, 0 ];
    case "8": return [ 1, 0 ];
    case "9": return [ 2, 0 ];
    case "4": return [ 0, 1 ];
    case "5": return [ 1, 1 ];
    case "6": return [ 2, 1 ];
    case "1": return [ 0, 2 ];
    case "2": return [ 1, 2 ];
    case "3": return [ 2, 2 ];
    case "gap": return [ 0, 3 ];
    case "0": return [ 1, 3 ];
    case "A": return [ 2, 3 ];
    default: throw new Error(`Invalid key: ${key}`);
  }
}

export function directionalKeypad(key: string): Vec2d {
  switch (key) {
    case "gap": return [ 0, 0 ];
    case "^": return [ 1, 0 ];
    case "A": return [ 2, 0 ];
    case "<": return [ 0, 1 ];
    case "v": return [ 1, 1 ];
    case ">": return [ 2, 1 ];
    default: throw new Error(`Invalid key: ${key}`);
  }
}
type Keypad = typeof numericKeypad;

export function part1(input: string) {
  const result = input
    .split("\n")
    .map((r) => {
      const l = finalProgramLength(r);
      console.log(l);
      return l.v * Number(r.slice(0, -1));
    })
    .reduce((acc, curr) => acc + curr);

  // const rows = input.split("\n");
  // const result = finalProgramLength(rows[0]);

  console.log(result);
}

export function part2(input: string) {
  let programs = [
    "<vA<AA>>^AvA<^A>AAvA^A<vA^>Av<<A^>A>AvA^Av<<A>A^>AAvA<^A>Av<<A>A^>AvA<^A>A",
    "<vA<AA>>^AvA<^A>AAvA^Av<<A>A^>AAvA<^A>Av<<A>>^AAAvA^Av<<A>A^>AAAvA^A<A>A",
    "v<<A>>^AvA^A<vA<AA>>^AvA<^A>AAvA^Av<<A>A^>AvA^A<A>Av<<A>A^>AAvA<^A>A",
    "v<<A>>^AA<vA<A>>^AAvAA<^A>A<vA^>A<A>A<vA^>Av<<A^>A>AvA^Av<<A>A^>AAAvA<^A>A",
    "<vA<AA>>^AvA<^A>AvA^A<vA<AA>>^AvA<^A>AvA^A<vA^>AA<A>Av<<A>A^>AAvA<^A>A",
  ].map(toState);

  for (let i = 0; i < 23; i++) {
    programs = programs.map(evolve);
  }

  const v = [ 593,
    508,
    386,
    459,
    246,
  ];

  let sum = 0;
  for (let i = 0; i < 5; i++) {
    sum += v[i] * stateLength(programs[i]);
  }
  console.log(sum);

  // too high 225887582184500
  //          225887582184500
  // too low  90239886870544
}

export function generatePermutations(arr: string[]): string[][] {
  const result: Set<string> = new Set();

  function permute(current: string[], remaining: string[]) {
    if (remaining.length === 0) {
      result.add(current.join(""));
    } else {
      for (let i = 0; i < remaining.length; i++) {
        const next = remaining.slice();
        const char = next.splice(i, 1);
        permute(current.concat(char), next);
      }
    }
  }

  permute([], arr);
  return Array.from(result).map((p) => p.split(""));
}

export function program(pattern: string, keypad: Keypad): string[] {
  const state = keypad("A");
  const gap = keypad("gap");
  const input = pattern.split("");
  let output: string[] = [];

  while (input.length) {
    const char = input.shift()!;
    const pos = keypad(char);
    let xDiff = pos[0] - state[0];
    let yDiff = pos[1] - state[1];

    const thisMove: string[] = [];
    if (xDiff > 0) {
      while (xDiff > 0) {
        thisMove.push(">");
        xDiff--;
      }
    } else if (xDiff < 0) {
      while (xDiff < 0) {
        thisMove.push("<");
        xDiff++;
      }
    }
    if (yDiff > 0) {
      while (yDiff > 0) {
        thisMove.push("v");
        yDiff--;
      }
    } else if (yDiff < 0) {
      while (yDiff < 0) {
        thisMove.push("^");
        yDiff++;
      }
    }

    const validPermutations: string[] = [];
    const permutations = generatePermutations(thisMove);
    permutations.forEach((p) => {
      let localState = state;
      let valid = true;
      p.forEach((move) => {
        if (move === "<") {
          localState = [ localState[0] - 1, localState[1] ];
        } else if (move === ">") {
          localState = [ localState[0] + 1, localState[1] ];
        } else if (move === "^") {
          localState = [ localState[0], localState[1] - 1 ];
        } else if (move === "v") {
          localState = [ localState[0], localState[1] + 1 ];
        }
        if (localState[0] === gap[0] && localState[1] === gap[1]) {
          valid = false;
        }
      });
      if (valid) {
        validPermutations.push(`${p.join("")}A`);
      }
    });

    if (output.length === 0) {
      output = validPermutations;
    } else {
      output = output
        .map((p) => validPermutations.map((vp) => `${p}${vp}`))
        .flat();
    }
    state[0] = pos[0];
    state[1] = pos[1];
  }

  return output;
}

export function finalProgramLength(input: string): { v: number, s: string } {
  const p1 = program(input, numericKeypad);
  const filteredP1 = filterShortestPrograms(p1);
  const p2 = filteredP1
    .map((p) => program(p, directionalKeypad))
    .flat();
  const filteredP2 = filterShortestPrograms(p2);
  const p3 = filteredP2
    .map((p) => program(p, directionalKeypad))
    .flat();
  return shortestStringLength(p3);
}

export function filterShortestPrograms(programs: string[]): string[] {
  const minLength = Math.min(...programs.map((p) => p.length));
  return programs.filter((p) => p.length === minLength);
}

function shortestStringLength(arr: string[]): { v: number, s: string } {
  const min = { v: Infinity, s: "" };
  for (const s of arr) {
    if (s.length < min.v) {
      min.v = s.length;
      min.s = s;
    }
  }
  return min;
}

const fromA = {
  A: "A",
  "^": "<A",
  "<": "<<vA",
  v: "v<A",
  ">": "vA",
} as const;

const fromUp = {
  A: ">A",
  "^": "A",
  "<": "v<A",
  v: "vA",
  ">": "v>A",
} as const;

const fromLeft = {
  A: ">>^A",
  "^": ">^A",
  "<": "A",
  v: ">A",
  ">": ">>A",
} as const;

const fromDown = {
  A: ">^A",
  "^": "^A",
  "<": "<A",
  v: "A",
  ">": ">A",
} as const;

const fromRight = {
  A: "^A",
  "^": "<^A",
  "<": "<<A",
  v: "<A",
  ">": "A",
} as const;

const directional = {
  A: fromA,
  "^": fromUp,
  "<": fromLeft,
  v: fromDown,
  ">": fromRight,
};

export function toState(p: string): Record<string, number> {
  const state: Record<string, number> = {};

  while (p.length) {
    const firstA = p.indexOf("A");
    const s = p.slice(0, firstA + 1);
    state[s] ??= 0;
    state[s] += 1;
    p = p.slice(firstA + 1);
  }

  return state;
}

export function stateLength(state: Record<string, number>): number {
  return Object.entries(state)
    .reduce((acc, [ s, n ]) => acc + s.length * n, 0);
}

// < v ^ >
const TOS: Record<string, string[]> = {
  A: [ "A" ],
  ">A": [ "vA", "^A" ],
  "^>A": [ "vA", "<^A", ">A" ],
  ">>^A": [ "vA", "A", "<^A", ">A" ],
  "^A": [ "<A", ">A" ],
  "<A": [ "v<<A", ">>^A" ],
  "<^A": [ "v<<A", "^>A", ">A" ],
  "<vA": [ "v<<A", ">A", "^>A" ],
  vA: [ "<vA", "^>A" ],
  "v<<A": [ "<vA", "<A", "A", ">>^A" ],
  "<<A": [ "v<<A", "A", ">>^A" ],
  "v>A": [ "<vA", ">A", "^A" ],
  ">>A": [ "vA", "A", "^A" ],
};

export function evolve(state: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [ s, n ] of Object.entries(state)) {
    try {
      TOS[s].forEach((to) => {
        result[to] = (result[to] ?? 0) + n;
      });
    } catch (err) {
      console.error("s is", s);
      console.error(err);
      throw err;
    }
  }

  return result;
}
