export function part1(input: string) {
  const { patterns, designs } = parse(input);
  const reducedPatterns = reducePatterns(patterns);

  const result = designs
    .filter((d) => canConstruct(d, reducedPatterns))
    .length;

  console.log(result);
}

export function part2(input: string) {
  const { patterns, designs } = parse(input);

  const result = designs
    .reduce((acc, d) => acc + countConstruct(d, patterns), 0);

  console.log(result);
}

export function parse(input: string): { patterns: string[], designs: string []} {
  const rows = input.split("\n");

  const patterns = rows[0].split(", ");
  const designs = rows.slice(2);

  return { patterns, designs };
}

export function canConstruct(design: string, patterns: string[], memo: Record<string, boolean> = {}): boolean {
  if (design === "") {
    return true;
  }

  if (design in memo) {
    return memo[design];
  }

  const result = patterns
    .filter((p) => design.startsWith(p))
    .some((p) => canConstruct(design.slice(p.length), patterns, memo));

  memo[design] = result;
  return result;
}

export function reducePatterns(patterns: string[]): string[] {
  return patterns
    .filter((p) => !canConstruct(p, patterns.filter((pi) => pi !== p)));
}

export function countConstruct(design: string, patterns: string[], memo: Record<string, number> = {}): number {
  if (design === "") {
    return 1;
  }
  if (design in memo) {
    return memo[design];
  }

  const possiblePatterns = patterns
    .filter((p) => design.startsWith(p));

  if (possiblePatterns.length === 0) {
    memo[design] = 0;
    return 0;
  }

  const result = possiblePatterns
    .reduce((acc, p) => acc + countConstruct(design.slice(p.length), patterns, memo), 0);

  memo[design] = result;
  return result;
}
