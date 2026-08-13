const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-2"), "utf8")
  .trim();

function main() {
  const spreadSheet = processInput();

  const { checkSum, evenlyDivisibleSums } = solve(spreadSheet);

  const result1 = checkSum;
  const result2 = evenlyDivisibleSums;

  console.log("Part One", result1); // Expected output: 53460
  console.log("Part Two", result2); // Expected output: 282
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\d+)/g;
  return INPUT.split("\n").map((line) => {
    return line.match(regex).map((e) => parseInt(e));
  });
}

function solve(matrix) {
  let checkSum = 0;
  let evenlyDivisibleSums = 0;

  for (const row of matrix) {
    const lowest = Math.min(...row);
    const highest = Math.max(...row);
    checkSum += highest - lowest;
    evenlyDivisibleSums += findDivisibleNumbers(row);
  }

  return { checkSum, evenlyDivisibleSums };
}

function findDivisibleNumbers(array) {
  for (let i = 0; i < array.length; i++) {
    const num1 = array[i];
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] % num1 == 0) return array[j] / num1;
      if (num1 % array[j] == 0) return num1 / array[j];
    }
  }
  return null;
}

///////////////////////////////////////////////////////////////////////////////

main();
