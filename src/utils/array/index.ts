export function product<T>(a: T[], b: T[]): [T, T][] {
  return a.flatMap((ai) => b.map((bi) => [ ai, bi ] as [T, T]));
}

export function* uniquePairs<T>(array: T[]) {
  for (let ia = 0; ia < array.length - 1; ia++) {
    for (let ib = ia + 1; ib < array.length; ib++) {
      yield [ array[ia], array[ib] ];
    }
  }
}

export function equals<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
