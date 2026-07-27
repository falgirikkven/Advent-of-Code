const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-18"), "utf8")
  .trim();

const ROWS_COUNT_1 = 40;
const ROWS_COUNT_2 = 400000;

const CHAR_SAFE = ".";
const CHAR_TRAP = "^";

function main() {
  const initialRow = processInput();

  const result1 = countSafeTiles(initialRow, ROWS_COUNT_1);
  const result2 = countSafeTiles(initialRow, ROWS_COUNT_2);

  console.log("Part One", result1); // Expected output: 1951
  console.log("Part Two", result2); // Expected output: 20002936
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("").map((e) => {
    if (e == CHAR_SAFE) return 0;
    if (e == CHAR_TRAP) return 1;
    return null;
  });
}

function countSafeTiles(initial, rowsCount) {
  const rLen = initial.length;
  let prevRow = [...initial];
  let newRow = new Array(rLen);
  let swap;
  let count = initial.reduce((a, b) => a + !b, 0);

  for (let i = 1; i < rowsCount; i++) {
    newRow[0] = prevRow[1];
    for (let j = 1; j < rLen - 1; j++) {
      const l = prevRow[j - 1];
      const c = prevRow[j];
      const r = prevRow[j + 1];
      let value = 0;
      value += l & c & !r;
      value += r & c & !l;
      value += l & !c & !r;
      value += !l & !c & r;
      newRow[j] = +(value > 0);
    }
    newRow[rLen - 1] = prevRow[rLen - 2];
    count += newRow.reduce((a, b) => a + !b, 0);

    swap = prevRow;
    prevRow = newRow;
    newRow = swap;
  }

  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
