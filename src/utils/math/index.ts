export type Vec = [number, number, number];

function toPositiveZero(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

export function crossProduct(v1: Vec, v2: Vec): Vec {
  return [
    toPositiveZero(v1[1] * v2[2] - v1[2] * v2[1]),
    toPositiveZero(v1[2] * v2[0] - v1[0] * v2[2]),
    toPositiveZero(v1[0] * v2[1] - v1[1] * v2[0]),
  ];
}

export function vAdd(v1: Vec, v2: Vec): Vec {
  return [ v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2] ];
}

export function vSub(v1: Vec, v2: Vec): Vec {
  return [ v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2] ];
}

export function vMod(v1: Vec, v2: Vec): Vec {
  return [ v1[0] % v2[0], v1[1] % v2[1], v1[2] % v2[2] ];
}
