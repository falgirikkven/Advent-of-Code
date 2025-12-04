const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  const splitted = input.split("\n").map((l) => l.split(""));
  // Add two columns and two rows so we don't check if we are out of bounds
  const grid = Array(splitted.length + 2)
    .fill()
    .map((_) => Array(splitted[0].length + 2).fill(0));
  for (let i = 0; i < splitted.length; i++) {
    for (let j = 0; j < splitted[0].length; j++) {
      if (splitted[i][j] !== ".") {
        grid[i + 1][j + 1] = 1;
      }
    }
  }
  return grid;
};

const rollsGrid = processInput();

function countAdjacentRolls(grid, r, c) {
  let count = 0;
  if (grid[r - 1][c - 1]) count += 1;
  if (grid[r - 1][c]) count += 1;
  if (grid[r - 1][c + 1]) count += 1;
  if (grid[r][c - 1]) count += 1;
  if (grid[r][c + 1]) count += 1;
  if (grid[r + 1][c - 1]) count += 1;
  if (grid[r + 1][c]) count += 1;
  if (grid[r + 1][c + 1]) count += 1;
  return count;
}

function getRemovableRolls(grid) {
  const arr = [];
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[0].length - 1; j++) {
      if (grid[i][j] && countAdjacentRolls(grid, i, j) < 4) {
        arr.push([i, j]);
      }
    }
  }
  return arr;
}

function partOne() {
  return getRemovableRolls(rollsGrid).length;
}

function partTwo() {
  const gridCopy = rollsGrid.map((r) => r.slice());
  let count = 0;
  while (1) {
    const removables = getRemovableRolls(gridCopy);
    if (removables.length === 0) break;

    count += removables.length;
    for (const toRemove of removables) {
      gridCopy[toRemove[0]][toRemove[1]] = 0;
    }
  }

  return count;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 1356

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 8713
