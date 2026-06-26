const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-2"), "utf8")
  .trim();

function main() {
  const presentsSizes = processInput();

  const result1 = calculateWrappingPaper(presentsSizes);
  const result2 = calculateFeetOfRibbon(presentsSizes);

  console.log("Part One", result1); // Expected output: 1588178
  console.log("Part Two", result2); // Expected output: 3783758
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\d)+/g;
  return INPUT.split("\n").map((line) => {
    return line
      .match(regex)
      .map((e) => parseInt(e))
      .sort((a, b) => a - b);
  });
}

function calculateWrappingPaper(presentsSizes) {
  let total = 0;
  for (const dimensions of presentsSizes) {
    const delta =
      3 * (dimensions[0] * dimensions[1]) +
      2 * (dimensions[1] * dimensions[2] + dimensions[2] * dimensions[0]);
    total += delta;
  }
  return total;
}

function calculateFeetOfRibbon(presentsSizes) {
  let total = 0;
  for (const dimensions of presentsSizes) {
    const delta =
      2 * (dimensions[0] + dimensions[1]) +
      dimensions[0] * dimensions[1] * dimensions[2];
    total += delta;
  }
  return total;
}

///////////////////////////////////////////////////////////////////////////////

main();
