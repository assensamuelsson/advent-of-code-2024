type Vec2D = [number, number];
type Machine = {
  A: Vec2D,
  B: Vec2D,
  P: Vec2D,
}

export function part1(input: string) {
  const result = parse(input)
    .map(minWinTokens)
    .reduce((acc, curr) => (acc ?? 0) + (curr ?? 0));

  console.log(result);
}

export function part2(input: string) {
  const result = parse(input, 10000000000000)
    .map(minWinTokens)
    .reduce((acc, curr) => (acc ?? 0) + (curr ?? 0));

  console.log(result);
}

export function parse(input: string, prizeOffset = 0): Machine[] {
  return input
    .split("\n\n")
    .map((machineString) => {
      const rows = machineString.split("\n");

      // Button A
      const Anums = rows[0].split("Button A: ")[1];
      const Aaxes = Anums.split(", ");
      const AX = Number(Aaxes[0].slice(Aaxes[0].indexOf("+") + 1));
      const AY = Number(Aaxes[1].slice(Aaxes[1].indexOf("+") + 1));

      // Button A
      const Bnums = rows[1].split("Button B: ")[1];
      const Baxes = Bnums.split(", ");
      const BX = Number(Baxes[0].slice(Baxes[0].indexOf("+") + 1));
      const BY = Number(Baxes[1].slice(Baxes[1].indexOf("+") + 1));

      // Prize
      const Pnums = rows[2].split("Prize: ")[1];
      const Paxes = Pnums.split(", ");
      const PX = Number(Paxes[0].slice(Paxes[0].indexOf("=") + 1)) + prizeOffset;
      const PY = Number(Paxes[1].slice(Paxes[1].indexOf("=") + 1)) + prizeOffset;

      return { A: [ AX, AY ], B: [ BX, BY ], P: [ PX, PY ] };
    });
}

export function minWinTokens(machine: Machine): number | null {
  const Ax = machine.A[0];
  const Ay = machine.A[1];
  const Bx = machine.B[0];
  const By = machine.B[1];
  const Px = machine.P[0];
  const Py = machine.P[1];

  const nb = (Ay * Px - Ax * Py) / (Ay * Bx - Ax * By);
  const na = (Py - nb * By) / Ay;

  return (na < 0 || nb < 0 || String(na).includes(".") || String(nb).includes(".")) ? null : 3 * na + nb;
}
