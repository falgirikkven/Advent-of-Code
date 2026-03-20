const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function solve() {
  const redTilesLocation = processInput(INPUT);

  let result = findLargestRectangleArea(redTilesLocation);

  console.log("Part One", result);
  // Expected output: 4771532800
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  return input.split("\n").map((l) => l.split(",").map((n) => parseInt(n)));
}

function findLargestRectangleArea(tilesLocation) {
  let maxArea = 0;
  const len = tilesLocation.length;
  for (let i = 0; i < len; i++) {
    const location1 = tilesLocation[i];
    for (let j = i + 1; j < len; j++) {
      const location2 = tilesLocation[j];
      const dr = Math.abs(location1[0] - location2[0]) + 1;
      const dc = Math.abs(location1[1] - location2[1]) + 1;
      const area = dr * dc;
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }
  return maxArea;
}

///////////////////////////////////////////////////////////////////////////////

solve();
