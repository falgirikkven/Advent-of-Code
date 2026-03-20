const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const CHAR_START = "S";
const CHAR_TACHYON = "^";

function main() {
  const { grid, start } = processInput(INPUT);

  const timesSplitted = countSplitTimes(grid, start);

  let result = timesSplitted;

  console.log("Part One", result);
  // Expected output: 1646
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const grid = input.split("\n").map((line) => line.split(""));
  const start = grid[0].indexOf(CHAR_START);

  return { grid, start };
}

function countSplitTimes(grid, start) {
  let queue1 = new Set([start]);
  let queue2 = new Set();
  let swap;
  let count = 0;
  for (let row = 0; row < grid.length; row++) {
    for (const col of queue1) {
      if (grid[row][col] == CHAR_TACHYON) {
        count += 1;
        queue2.add(col - 1);
        queue2.add(col + 1);
      } else {
        queue2.add(col);
      }
    }
    queue1.clear();
    swap = queue1;
    queue1 = queue2;
    queue2 = swap;
  }

  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
