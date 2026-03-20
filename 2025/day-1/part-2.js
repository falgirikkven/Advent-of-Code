const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const STARTING_POINT = 50;
const DIAL_SIZE = 100;

function main() {
  const rotations = processInput(INPUT);

  let result = countZeroMeets(rotations);

  console.log("Part Two", result);
  // Expected output: 6616
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const regex = /(L|R)(\d+)/;
  const lines = input.split("\n");
  return lines.map((line) => {
    const match = line.match(regex);
    const sign = match[1] === "L" ? -1 : match[1] === "R" ? 1 : undefined;
    const num = parseInt(match[2]);
    return sign * num;
  });
}

function countZeroMeets(rotations) {
  let count = 0;
  let currentPoint = STARTING_POINT;
  for (const rotation of rotations) {
    const quotient = Math.floor(Math.abs(rotation / DIAL_SIZE));
    const rest = rotation % DIAL_SIZE;
    const isZeroStart = currentPoint !== 0;

    count += quotient;
    currentPoint += rest;

    if (currentPoint === 0 && isZeroStart) {
      count += 1;
    } else if (currentPoint < 0) {
      count += isZeroStart ? 1 : 0;
      currentPoint += DIAL_SIZE;
    } else if (currentPoint >= DIAL_SIZE) {
      count += isZeroStart ? 1 : 0;
      currentPoint -= DIAL_SIZE;
    }
  }
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
