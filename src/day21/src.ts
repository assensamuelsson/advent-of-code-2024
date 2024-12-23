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
    .map((r) => finalProgramLength(r) * Number(r.slice(0, -1)))
    .reduce((acc, curr) => acc + curr);

  console.log(result);

  // Too high 166856
}

export function part2(input: string) {
  const result = 0;

  console.log(result);
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

export function finalProgramLength(input: string): number {
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

function shortestStringLength(arr: string[]): number {
  let min = Infinity;
  for (const s of arr) {
    min = s.length < min ? s.length : min;
  }
  return min;
}
