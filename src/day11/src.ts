type StoneId = number;
type Stones = Map<StoneId, number>;

export function part1(input: string) {
  let stones = parse(input);
  for (let i = 0; i < 25; i++) {
    stones = blink(stones);
  }
  const result = countStones(stones);

  console.log(result);
}

export function part2(input: string) {
  let stones = parse(input);
  for (let i = 0; i < 75; i++) {
    stones = blink(stones);
  }
  const result = countStones(stones);

  console.log(result);
}

export function parse(input: string): Stones {
  return input
    .split(" ")
    .map(Number)
    .reduce((map, stoneId) => {
      map.set(stoneId, map.get(stoneId) ?? 0 + 1);
      return map;
    }, new Map() as Stones);
}

export function blink(stones: Stones): Stones {
  const result: Stones = new Map();
  stones.forEach((num, id) => {
    const strId = String(id);
    if (id === 0) {
      result.set(1, num + (result.get(1) ?? 0));
    } else if (strId.length % 2 === 0) {
      const [ n1, n2 ] = [ strId.slice(0, strId.length / 2), strId.slice(strId.length / 2) ];
      result.set(Number(n1), num + (result.get(Number(n1)) ?? 0));
      result.set(Number(n2), num + (result.get(Number(n2)) ?? 0));
    } else {
      result.set(id * 2024, num);
    }
  });
  return result;
}

export function countStones(stones: Stones): number {
  let total = 0;
  stones.forEach((value) => {
    total += value;
  });
  return total;
}
