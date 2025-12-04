const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  return input.split("\n").map((l) => l.split("").map((n) => parseInt(n)));
};

const batteriesBank = processInput();

/*
function getMaxJoltage(bank) {
  let max = 0;
  for (let i = 0; i < bank.length - 1; i++) {
    const msd = bank[i] * 10; // most significant digit
    for (let j = i + 1; j < bank.length; j++) {
      const jolt = msd + bank[j];
      if (jolt > max) max = jolt;
    }
  }
  return max;
}
*/

function getMaxJoltage(bank, max_batteries) {
  let result = 0;
  let start = 0;
  let len = bank.length;
  for (let i = 0; i < max_batteries; i++) {
    const end = len - (max_batteries - i) + 1;
    const max_digit = Math.max(...bank.slice(start, end));
    start = bank.indexOf(max_digit, start) + 1;
    result = result * 10 + max_digit;
  }

  return result;
}

function partOne() {
  let sum = 0;
  for (const bank of batteriesBank) {
    //sum += getMaxJoltage(bank);
    sum += getMaxJoltage(bank, 2);
  }
  return sum;
}

function partTwo() {
  let sum = 0;
  for (const bank of batteriesBank) {
    //sum += getMaxJoltage(bank);
    sum += getMaxJoltage(bank, 12);
  }
  return sum;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 17207

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 170997883706617
