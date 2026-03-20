const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const GRID_EMPTY = 0;
const GRID_PAPER = 1;
const CHAR_PAPER = "@";

function main() {
  const grid = processInput(INPUT);

  const removableRolls = getRemovableRolls(grid);

  let result = removableRolls.length;

  console.log("Part One", result);
  // Expected output: 1356
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const splitted = input.split("\n").map((l) => l.split(""));

  // Add two columns and two rows so we don't check if we are out of bounds
  const grid = Array(splitted.length + 2)
    .fill()
    .map((_) => Array(splitted[0].length + 2).fill(GRID_EMPTY));

  // Fill Grid
  for (let i = 0; i < splitted.length; i++) {
    for (let j = 0; j < splitted[0].length; j++) {
      if (splitted[i][j] == CHAR_PAPER) {
        grid[i + 1][j + 1] = GRID_PAPER;
      }
    }
  }
  return grid;
}

function getRemovableRolls(grid) {
  const arr = [];
  const maxR = grid.length - 1;
  const maxC = grid[0].length - 1;
  for (let r = 1; r < maxR; r++) {
    for (let c = 1; c < maxC; c++) {
      if (grid[r][c] == GRID_PAPER && countAdjacentRolls(grid, r, c) < 4) {
        arr.push([r, c]);
      }
    }
  }
  return arr;
}

function countAdjacentRolls(grid, r, c) {
  let count = 0;
  if (grid[r - 1][c - 1] == GRID_PAPER) count += 1;
  if (grid[r - 1][c] == GRID_PAPER) count += 1;
  if (grid[r - 1][c + 1] == GRID_PAPER) count += 1;
  if (grid[r][c - 1] == GRID_PAPER) count += 1;
  if (grid[r][c + 1] == GRID_PAPER) count += 1;
  if (grid[r + 1][c - 1] == GRID_PAPER) count += 1;
  if (grid[r + 1][c] == GRID_PAPER) count += 1;
  if (grid[r + 1][c + 1] == GRID_PAPER) count += 1;
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
