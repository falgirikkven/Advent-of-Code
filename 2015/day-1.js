const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-1"), "utf8")
  .trim();

const TARGET = -1;

function main() {
  const parentheses = processInput();

  const result1 = followInstructions(parentheses);
  const result2 = findTargetIndex(parentheses, TARGET);

  console.log("Part One", result1); // Expected output: 74
  console.log("Part Two", result2); // Expected output: 1795
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("");
}

function followInstructions(parentheses) {
  return parentheses.reduce((acc, curr) => acc + (curr == "(" ? 1 : -1), 0);
}

function findTargetIndex(parentheses, target) {
  let accumulator = 0;

  for (let i = 0; i < parentheses.length; i++) {
    accumulator = parentheses[i] === "(" ? accumulator + 1 : accumulator - 1;

    if (accumulator == target) {
      return i + 1;
    }
  }

  return -1;
}

///////////////////////////////////////////////////////////////////////////////

main();
