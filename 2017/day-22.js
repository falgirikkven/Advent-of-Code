const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-22"), "utf8")
  .trim();

const ROUNDS_1 = 10e3;
const ROUNDS_2 = 10e6;

const GRID_CLEAN = 0;
const GRID_WEAKENED = 1; // Unused. For reference only
const GRID_INFECTED = 2;
const GRID_FLAGGED = 3; // Unused. For reference only

const CHAR_INFECTED = "#";
const CHAR_CLEAN = ".";

const DIRECTIONS = [
  { dr: -1, dc: 0 }, // Up
  { dr: 0, dc: 1 }, // Right
  { dr: 1, dc: 0 }, // Down
  { dr: 0, dc: -1 }, // Left
]; // DIRECTIONS.length = 4

function main() {
  const grid = processInput();

  const result1 = spreadVirus(grid, ROUNDS_1, true);
  const result2 = spreadVirus(grid, ROUNDS_2, false);

  console.log("Part One", result1); // Expected output: 5223
  console.log("Part Two", result2); // Expected output: 2511456
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const lines = INPUT.split("\n");
  const rOffset = Math.floor(lines.length / 2);
  const cOffset = Math.floor(lines[0].length / 2);

  return lines.reduce((accumulator, row, rInd) => {
    row.split("").forEach((elem, cInd) => {
      const key = generateKey(rInd - rOffset, cInd - cOffset);
      let value = null;
      if (elem == CHAR_CLEAN) value = GRID_CLEAN;
      else if (elem == CHAR_INFECTED) value = GRID_INFECTED;
      accumulator[key] = value;
    });

    return accumulator;
  }, Object.create(Object.prototype));
}

function spreadVirus(initialGrid, burstTimes, part1 = true) {
  const grid = Object.assign({}, initialGrid);
  const changeValue = part1 ? changeValueP1 : changeValueP2;
  const changeDirection = part1 ? changeDirectionP1 : changeDirectionP2;
  let row = 0;
  let col = 0;
  let directionIndex = 0; // Up

  let infectionsCaused = 0;

  for (let i = 0; i < burstTimes; i++) {
    const key = generateKey(row, col);
    if (grid[key] == null) grid[key] = 0;
    const oldValue = grid[key];
    const newValue = changeValue(oldValue);
    const newDirectionIndex = changeDirection(directionIndex, oldValue);
    const delta = DIRECTIONS[newDirectionIndex];

    grid[key] = newValue;
    directionIndex = newDirectionIndex;
    row += delta.dr;
    col += delta.dc;
    infectionsCaused += newValue == GRID_INFECTED;
  }

  return infectionsCaused;
}

function generateKey(row, col) {
  return `${row};${col}`;
}

function changeValueP1(oldValue) {
  return oldValue ^ GRID_INFECTED;
}

function changeDirectionP1(oldDirection, oldValue) {
  return (oldDirection + (oldValue == GRID_INFECTED ? 1 : -1) + 4) % 4;
}

function changeValueP2(oldValue) {
  return (oldValue + 1) % 4;
}

function changeDirectionP2(oldDirection, oldValue) {
  if (oldValue == GRID_CLEAN) return (oldDirection + 3) % 4;
  if (oldValue == GRID_WEAKENED) return oldDirection;
  if (oldValue == GRID_INFECTED) return (oldDirection + 1) % 4;
  if (oldValue == GRID_FLAGGED) return (oldDirection + 2) % 4;
}

/*
function spreadVirus(initialGrid, burstTimes) {
  const grid = Object.assign({}, initialGrid);
  let row = 0;
  let col = 0;
  let directionIndex = 0; // Up

  let infectionsCaused = 0;

  for (let i = 0; i < burstTimes; i++) {
    const key = generateKey(row, col);
    if (grid[key] == null) grid[key] = 0;
    const value = grid[key] ^ 1;
    directionIndex = (directionIndex + (value == 0 ? 1 : -1) + 4) % 4;
    const direction = DIRECTIONS[directionIndex];

    grid[key] = value;
    row += direction.dr;
    col += direction.dc;
    infectionsCaused += value;
  }

  return infectionsCaused;
}
  */

///////////////////////////////////////////////////////////////////////////////

main();
