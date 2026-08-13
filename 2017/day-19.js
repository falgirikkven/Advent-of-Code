const fs = require("node:fs");
const path = require("node:path");
// Note: We have replace the blank spaces from the input files with dots
// so we can be sure it doesn't get ripped by the trim function.
// Make sure your input file also have its blank spaces replaced with dots.
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-19"), "utf8")
  .trim();

const BLANK_SPACE = "."; // We replace empty spaces with dots

const DIRECTIONS = [
  { dr: -1, dc: 0 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: -1 },
];

function main() {
  const path = processInput();

  const pathResults = followPath(path);

  const result1 = pathResults.letters.join("");
  const result2 = pathResults.count;

  console.log("Part One", result1); // Expected output:
  console.log("Part Two", result2); // Expected output:
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((l) => l.split(""));
}

function followPath(path) {
  const isLetter = /\w/;

  const start = findStarPoint(path);
  const seen = {};
  seen[positionToString(start)] = 1;

  let queue = [start];

  const letters = [];
  let count = 0;

  while (queue.length > 0) {
    const top = queue.pop();
    count += 1;

    // Add Letter
    const char = path[top.row][top.col];
    if (isLetter.test(char)) letters.push(char);

    // Neighbors
    if (char != "+") {
      addNeighbors(path, seen, queue, top, top.dir);
    } else {
      for (let i = 0; i < DIRECTIONS.length; i++) {
        addNeighbors(path, seen, queue, top, i);
      }
    }
  }

  return { letters, count };
}

function findStarPoint(path) {
  const cols = path[0].length;
  const rows = path.length;
  for (let c = 0; c < cols; c++) {
    if (path[0][c] != BLANK_SPACE) {
      return { row: 0, col: c, dir: 2 };
    }
    if (path[rows - 1][c] != BLANK_SPACE) {
      return { row: rows - 1, col: c, dir: 0 };
    }
  }

  for (let r = 0; r < rows; r++) {
    if (path[r][0] != BLANK_SPACE) {
      return { row: r, col: 0, dir: 1 };
    }
    if (path[r][cols - 1] != BLANK_SPACE) {
      return { row: r, col: cols - 1, dir: 3 };
    }
  }

  return null;
}

function positionToString(position) {
  return `${position.row};${position.col};${position.dir & 1}`;
}

function addNeighbors(path, seen, queue, position, dirIndex) {
  const newPosition = {};
  newPosition.row = position.row + DIRECTIONS[dirIndex].dr;
  newPosition.col = position.col + DIRECTIONS[dirIndex].dc;
  newPosition.dir = dirIndex;
  if (!isValidPosition(path, newPosition)) return;
  if (path[newPosition.row][newPosition.col] == BLANK_SPACE) return;
  const newKey = positionToString(newPosition);
  if (seen[newKey] == null) {
    seen[newKey] = 1;
    queue.push(newPosition);
  }
}

function isValidPosition(path, position) {
  const colMax = path[0].length - 1;
  const rowMax = path.length - 1;
  if (position.row < 0 || position.row > rowMax) return false;
  if (position.col < 0 || position.col > colMax) return false;
  return true;
}

///////////////////////////////////////////////////////////////////////////////

main();
