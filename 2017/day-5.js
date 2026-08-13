const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-5"), "utf8")
  .trim();

function main() {
  const jumpOffsets = processInput();

  const result1 = countStepsToExit(jumpOffsets);
  const result2 = countStepsToExit(jumpOffsets, true);

  console.log("Part One", result1); // Expected output: 374269
  console.log("Part Two", result2); // Expected output: 27720699
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((e) => parseInt(e));
}

function countStepsToExit(jumps, part2 = false) {
  const jumpOffsets = jumps.slice(); // Avoid mutation
  const jLen = jumpOffsets.length;
  let stepsCount = 0;

  for (let cursor = 0; cursor < jLen; ) {
    const oldValue = jumpOffsets[cursor];
    if (part2 && oldValue >= 3) {
      jumpOffsets[cursor] -= 1;
    } else {
      jumpOffsets[cursor] += 1;
    }
    cursor += oldValue;
    stepsCount += 1;
  }

  return stepsCount;
}

///////////////////////////////////////////////////////////////////////////////

main();
