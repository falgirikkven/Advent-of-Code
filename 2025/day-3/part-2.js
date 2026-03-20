const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function main() {
  const batteriesBank = processInput(INPUT);

  const maxJoltages = getMaxJoltageArray(batteriesBank);

  let result = maxJoltages.reduce((acc, curr) => acc + curr, 0);

  console.log("Part Two", result);
  // Expected output: 170997883706617
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  return input.split("\n").map((l) => l.split("").map((n) => parseInt(n)));
}

function getMaxJoltageArray(batteriesBank) {
  const arr = [];
  for (const batteryBank of batteriesBank) {
    arr.push(getMaxJoltage(batteryBank));
  }

  return arr;
}

function getMaxJoltage(batteryBank) {
  const batteryCount = 12;
  const len = batteryBank.length;
  let result = 0;
  let start = 0;
  for (let i = 0; i < batteryCount; i++) {
    const end = len - (batteryCount - i) + 1;
    const maxDigit = Math.max(...batteryBank.slice(start, end));
    start = batteryBank.indexOf(maxDigit, start) + 1;
    result = result * 10 + maxDigit;
  }

  return result;
}

///////////////////////////////////////////////////////////////////////////////

main();
