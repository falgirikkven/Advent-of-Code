const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-1"), "utf8")
  .trim();

function main() {
  const numsList = processInput();

  const result1 = sumMatches(numsList);
  const result2 = sumMatches(numsList, false);

  console.log("Part One", result1); // Expected output: 997
  console.log("Part Two", result2); // Expected output: 1358
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("").map((e) => parseInt(e));
}

function sumMatches(arr, part1 = true) {
  let sum = 0;
  const len = arr.length;
  const steps = part1 ? 1 : len / 2;
  for (let i = 0; i < len; i++) {
    let j = (i + steps) % len;
    if (arr[i] == arr[j]) sum += arr[i];
  }
  return sum;
}

///////////////////////////////////////////////////////////////////////////////

main();
