const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-4"), "utf8")
  .trim();

const ZEROS_COUNT_1 = 5;
const ZEROS_COUNT_2 = 6;
const crypto = require("node:crypto");

// NOTE: this program will take about a minute to finish
function main() {
  const secretKey = INPUT;

  const result1 = mineAdventCoin(secretKey, ZEROS_COUNT_1);
  const result2 = mineAdventCoin(secretKey, ZEROS_COUNT_2);

  console.log("Part One", result1); // Expected output: 346386
  console.log("Part Two", result2); // Expected output: 9958218
}

///////////////////////////////////////////////////////////////////////////////

function mineAdventCoin(secretKey, zerosCount) {
  let number = 0;
  let hash = md5(secretKey + number);

  const zerosStr = new Array(zerosCount).fill(0).join("");
  while (hash.slice(0, zerosCount) !== zerosStr) {
    number++;
    hash = md5(secretKey + number);
  }
  return number;
}

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

///////////////////////////////////////////////////////////////////////////////

main();
