import { readFileSync } from "fs";

type DayModule = {
  part1: (input: string) => void;
  part2: (input: string) => void;
}

type Range<N extends number, Result extends Array<unknown> = []> = Result["length"] extends N
  ? Result[number]
  : Range<N, [...Result, Result["length"]]>;

type Day = Exclude<Range<26>, 0>;

function parseDay(dayInput: string): Day {
  const num = Number(dayInput);
  if (!num) {
    throw new TypeError(`dayInput ${dayInput} is not a number`);
  }
  if (num < 1 || num >= 26) {
    throw new Error("dayInput ${dayInput} must be between 1 and 25");
  }
  return Math.floor(num) as Day;
}

async function importDayModule(day: Day) {
  const path = `./day${day}/src`;
  const module = await import(path);

  if (typeof module?.part1 !== "function" || module.part1?.length !== 1) {
    throw new Error(`Module for day${day}  does not have a valid part1 function`);
  }

  if (typeof module?.part2 !== "function" || module.part2?.length !== 1) {
    throw new Error(`Module for day${day}  does not have a valid part2 function`);
  }

  return module as DayModule;
}

export default async function runDay(dayInput: string, inputFile: string): Promise<void> {
  const day = parseDay(dayInput);
  const input = readFileSync(inputFile, "utf8");
  const module = await importDayModule(day);
  console.log(`Day ${day} - ${inputFile}`);

  console.time("part1");
  module.part1(input);
  console.timeEnd("part1");

  console.time("part2");
  module.part2(input);
  console.timeEnd("part2");
}
