type Rule = [number, number];
type Update = number[];

export function part1(input: string) {
  const { rules, updates } = parse(input);
  const result = updates
    .filter((u) => isCorrectOrder(u, rules))
    .map(middleValue)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function part2(input: string) {
  const { rules, updates } = parse(input);
  const result = updates
    .filter((u) => !isCorrectOrder(u, rules))
    .map((u) => sort(u, rules))
    .map(middleValue)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function parse(input: string): { rules: Rule[], updates: Update[] } {
  const [ rules, updates ] = input.split("\n\n");

  return {
    rules: rules.split("\n").map((rule) => rule.split("|").map(Number) as Rule),
    updates: updates.split("\n").map((u) => u.split(",").map(Number)),
  };
}

export function isCorrectOrder(update: Update, rules: Rule[]) {
  for (const rule of rules) {
    const i1 = update.indexOf(rule[0]);
    const i2 = update.indexOf(rule[1]);
    if (i1 !== -1 && i2 !== -1 && i1 > i2) {
      return false;
    }
  }
  return true;
}

export function middleValue(update: Update): Update[number] {
  return update[Math.floor(update.length / 2)];
}

export function sort(update: Update, rules: Rule[]): Update {
  const applicableRules = rules
    .filter((rule) => {
      const i1 = update.indexOf(rule[0]);
      const i2 = update.indexOf(rule[1]);
      return i1 !== -1 && i2 !== -1;
    });

  while (!isCorrectOrder(update, applicableRules)) {
    update.sort((a, b) => {
      const rule = applicableRules.find((r) => r.includes(a) && r.includes(b));
      if (!rule) {
        console.log("Could not find rule");
        return 0;
      } else {
        return a === rule[0] ? -1 : 1;
      }
    });
  }

  return update;
}
