const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const xmas = ["X", "M", "A", "S"];
const directions = [
  { dx: 1, dy: 0 },
  { dx: 1, dy: 1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: -1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: -1 },
];

// All possible combination of indices pair that aren't in opposite directions
const pairDiagonalIndices = [
  [1, 3],
  [3, 5],
  [5, 7],
  [7, 1],
];

const processInput = () => {
  const wordSearch = input.split("\n").map((l) => l.split(""));
  const maxX = wordSearch[0].length;
  const maxY = wordSearch.length;
  return { wordSearch, maxX, maxY };
};

const { wordSearch, maxX, maxY } = processInput();

function isOutside(x, y) {
  if (y < 0 || y >= maxY) return true;
  if (x < 0 || x >= maxX) return true;
  return false;
}

function countWord(word, y, x) {
  if (wordSearch[y][x] !== word[0]) {
    return 0;
  }

  let count = 0;
  for (const direction of directions) {
    let nx = x;
    let ny = y;
    let flag = 1;
    for (let i = 1; i < word.length; i++) {
      nx += direction.dx;
      ny += direction.dy;
      if (isOutside(nx, ny) || wordSearch[ny][nx] !== word[i]) {
        flag = 0;
        break;
      }
    }
    count += flag;
  }

  return count;
}

function partOne() {
  let count = 0;
  for (let x = 0; x < maxY; x++) {
    for (let y = 0; y < maxX; y++) {
      count += countWord(xmas, y, x);
    }
  }

  return count;
}

function isXmas(y, x) {
  if (wordSearch[y][x] !== "A") {
    return 0;
  }

  let count = 0;
  for (let i = 0; i < pairDiagonalIndices.length; i++) {
    const diag1 = directions[pairDiagonalIndices[i][0]];
    const diag2 = directions[pairDiagonalIndices[i][1]];

    if (
      wordSearch[y + diag1.dy][x + diag1.dx] != "M" ||
      wordSearch[y + diag2.dy][x + diag2.dx] != "M"
    ) {
      continue;
    }

    if (
      wordSearch[y - diag1.dy][x - diag1.dx] != "S" ||
      wordSearch[y - diag2.dy][x - diag2.dx] != "S"
    ) {
      continue;
    }

    count += 1;
    break;
  }

  return count;
}

function partTwo() {
  let count = 0;
  for (let x = 1; x < maxY - 1; x++) {
    for (let y = 1; y < maxX - 1; y++) {
      count += isXmas(y, x);
    }
  }

  return count;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 2646

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 2000
