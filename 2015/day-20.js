const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-20"), "utf8")
  .trim();

const TIMES = 10;
const MAXIMUM_VISITS = 50;

function main() {
  const minimumPresents = processInput();

  const result1 = solve1(minimumPresents / TIMES);
  const result2 = solve2(minimumPresents / TIMES, MAXIMUM_VISITS);

  console.log("Part One", result1); // Expected output: 786240
  console.log("Part Two", result2); // Expected output: 831600
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return parseInt(INPUT);
}

function solve1(minimumRequired) {
  const counts = new Array(minimumRequired).fill(0);

  for (let i = 1; i < minimumRequired; i++) {
    for (let j = i; j < minimumRequired; j += i) {
      counts[j] += i;
    }
  }

  for (let i = 1; i < minimumRequired; i++) {
    if (counts[i] >= minimumRequired) return i;
  }

  return -1;
}

function solve2(minimumRequired, maximumVisits) {
  const counts = new Array(minimumRequired).fill(0);

  for (let i = 1; i < minimumRequired; i++) {
    const max = maximumVisits * i;
    const limit = max < minimumRequired ? max : minimumRequired;
    for (let j = i; j < limit; j += i) {
      counts[j] += i;
    }
  }

  for (let i = 1; i < minimumRequired; i++) {
    if (counts[i] >= minimumRequired) return i;
  }

  return -1;
}

///////////////////////////////////////////////////////////////////////////////

main();
