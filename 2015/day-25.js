const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-25"), "utf8")
  .trim();

const CODE_INITIAL = 20151125;
const CODE_MULTIPLIER = 252533;
const CODE_MODULER = 33554393; //I don't know how it is called, so I coined this term

function main() {
  const location = processInput();

  const index = convertCoordinatesToIndex(location.row, location.col);

  let result1 = calculateCode(index);

  console.log("Part One", result1); // Expected output: 8997277
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /row\s(?<row>\d+).+column\s(?<column>\d+)/;
  const match = INPUT.match(regex);
  const row = parseInt(match.groups.row);
  const col = parseInt(match.groups.column);
  return { row, col };
}

function convertCoordinatesToIndex(row, col) {
  const aux = row + col;
  return ((aux - 1) * aux) / 2 - row + 1;
}

function calculateCode(index) {
  let code = CODE_INITIAL;
  for (let i = 1; i < index; i++) {
    code *= CODE_MULTIPLIER;
    code %= CODE_MODULER;
  }
  return code;
}

///////////////////////////////////////////////////////////////////////////////

main();
