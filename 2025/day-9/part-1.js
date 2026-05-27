const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function main() {
  const redTiles = processInput(INPUT);

  let result = findLargestArea(redTiles);

  console.log("Part One", result);
  // Expected output: 4771532800
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const redTiles = [];

  const lines = input.split("\n");
  for (const line of lines) {
    const raw = line.split(",");

    const row = parseInt(raw.pop());
    const col = parseInt(raw.pop());

    redTiles.push({ row, col });
  }

  return redTiles;
}

function findLargestArea(redTiles) {
  let largestArea = 0;
  const len = redTiles.length;

  for (let i = 0; i < len; i++) {
    const tile1 = redTiles[i];
    for (let j = i + 1; j < len; j++) {
      const tile2 = redTiles[j];

      const dr = Math.abs(tile1.row - tile2.row) + 1;
      const dc = Math.abs(tile1.col - tile2.col) + 1;

      const area = dr * dc;

      if (area > largestArea) {
        largestArea = area;
      }
    }
  }
  return largestArea;
}

///////////////////////////////////////////////////////////////////////////////

main();
