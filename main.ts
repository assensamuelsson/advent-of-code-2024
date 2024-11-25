import runDay from "./src/day";

const day = process.argv[2];
const inputFile = process.argv[3];

await runDay(day, inputFile);
