const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const STARTING_POINT = 50;
const DIAL_SIZE = 100;

function main() {
  const rotations = processInput(INPUT);

  let result = countZeroPointing(rotations);

  console.log("Part One", result);
  // Expected output: 1092
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

function countZeroPointing(rotations) {
  let count = 0;
  let currentPoint = STARTING_POINT;
  for (const rotation of rotations) {
    currentPoint += rotation % DIAL_SIZE;

    if (currentPoint < 0) {
      currentPoint += DIAL_SIZE;
    } else if (currentPoint >= DIAL_SIZE) {
      currentPoint -= DIAL_SIZE;
    }

    if (currentPoint === 0) {
      count += 1;
    }
  }
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
