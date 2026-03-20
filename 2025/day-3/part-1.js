const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function main() {
  const batteriesBank = processInput(INPUT);

  const maxJoltages = getMaxJoltageArray(batteriesBank);

  let result = maxJoltages.reduce((acc, curr) => acc + curr, 0);

  console.log("Part One", result);
  // Expected output: 17207
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
  let max = 0;
  for (let i = 0; i < batteryBank.length - 1; i++) {
    const msd = batteryBank[i] * 10; // most significant digit
    for (let j = i + 1; j < batteryBank.length; j++) {
      const joltage = msd + batteryBank[j];
      if (joltage > max) max = joltage;
    }
  }
  return max;
}

///////////////////////////////////////////////////////////////////////////////

main();
