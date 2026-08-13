const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-6"), "utf8")
  .trim();

function main() {
  const memoryBanks = processInput();

  const { cyclesUntilRepeat, loopLength } = solve(memoryBanks);

  const result1 = cyclesUntilRepeat;
  const result2 = loopLength;

  console.log("Part One", result1); // Expected output: 5042
  console.log("Part Two", result2); // Expected output: 1086
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\d+)/g;
  return INPUT.match(regex).map((e) => parseInt(e));
}

function solve(memoryBanks) {
  const banks = memoryBanks.slice(); // Avoid mutation
  const seen = {};

  let cyclesUntilRepeat = 0;
  let loopLength;

  let counter = 1;

  while (true) {
    const key = banks.reduce((acc, curr) => acc.concat(curr, ";"), "");
    if (seen[key] != null) {
      loopLength = counter - seen[key];
      break;
    }
    seen[key] = counter++;

    redistributeMemoryBanks(banks);
    cyclesUntilRepeat += 1;
  }

  return { cyclesUntilRepeat, loopLength };
}

function redistributeMemoryBanks(banks) {
  // Here we meant to mutate
  const value = Math.max(...banks);
  const indexMax = banks.indexOf(value);
  banks[indexMax] = 0;
  for (let i = 0, cursor = (indexMax + 1) % banks.length; i < value; i++) {
    banks[cursor] += 1;
    cursor = (cursor + 1) % banks.length;
  }
}

///////////////////////////////////////////////////////////////////////////////

main();
