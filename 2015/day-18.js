const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-18"), "utf8")
  .trim();

const GRID_ON = "#";
const GRID_OFF = ".";
const STEPS = 100;

function main() {
  const grid = processInput();

  const afterGrid1 = gameOfLife(grid, STEPS);
  const afterGrid2 = gameOfLife(grid, STEPS, gameUpdate);

  const result1 = countLightsOn(afterGrid1);
  const result2 = countLightsOn(afterGrid2);

  console.log("Part One", result1); // Expected output: 1061
  console.log("Part Two", result2); // Expected output: 1006
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((line) => {
    return line.split("").map((e) => {
      if (e == GRID_ON) return 1;
      else if (e == GRID_OFF) return 0;
      throw "processInput: invalid character";
    });
  });
}

function gameOfLife(whichGrid, steps, onGameUpdate = null) {
  let grid = whichGrid.map((arr) => arr.slice());
  const rowMax = grid.length;
  const colMax = grid[0].length;

  let auxiliar = new Array(rowMax)
    .fill(0)
    .map((_) => new Array(colMax).fill(0));
  let swap;

  for (let s = 0; s < steps; s++) {
    for (let r = 0; r < rowMax; r++) {
      for (let c = 0; c < colMax; c++) {
        let neighborsCount = 0;
        const bCol1 = c > 0;
        const bCol2 = c < colMax - 1;
        if (r > 0) {
          neighborsCount += bCol1 ? grid[r - 1][c - 1] : 0;
          neighborsCount += bCol2 ? grid[r - 1][c + 1] : 0;
          neighborsCount += grid[r - 1][c];
        }
        if (r < rowMax - 1) {
          neighborsCount += bCol1 ? grid[r + 1][c - 1] : 0;
          neighborsCount += bCol2 ? grid[r + 1][c + 1] : 0;
          neighborsCount += grid[r + 1][c];
        }
        neighborsCount += bCol1 ? grid[r][c - 1] : 0;
        neighborsCount += bCol2 ? grid[r][c + 1] : 0;
        if (grid[r][c] === 1) {
          auxiliar[r][c] = +(neighborsCount == 2 || neighborsCount == 3);
        } else if (grid[r][c] === 0) {
          auxiliar[r][c] = +(neighborsCount == 3);
        } else {
          auxiliar[r][c] = 0; // This line will never execute. Delete it maybe?
        }
      }
    }
    if (onGameUpdate != null) onGameUpdate(auxiliar, rowMax, colMax);

    swap = grid;
    grid = auxiliar;
    auxiliar = swap;
  }

  return grid;
}

function countLightsOn(grid) {
  let sum = 0;
  for (const row of grid) {
    sum += row.reduce((acc, curr) => acc + curr, 0);
  }
  return sum;
}

function gameUpdate(grid, row, col) {
  grid[0][0] = 1;
  grid[0][col - 1] = 1;
  grid[row - 1][0] = 1;
  grid[row - 1][col - 1] = 1;
}

///////////////////////////////////////////////////////////////////////////////

main();
