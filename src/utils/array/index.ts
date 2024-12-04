export function product<T>(a: T[], b: T[]): [T, T][] {
  return a.flatMap((ai) => b.map((bi) => [ ai, bi ] as [T, T]));
}
