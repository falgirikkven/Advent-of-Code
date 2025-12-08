const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  const grid = input.split("\n").map((l) => l.split(""));
  const start = { r: null, c: null };
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "S") {
        start.r = i;
        start.c = j;
        i = grid.length;
        break;
      }
    }
  }
  return { grid, start };
};

const { grid, start } = processInput();

const solve = () => {
  const wr = start.r;
  const wc = start.c;
  let splits = 0;
  let queue1 = new Set();
  let queue2 = new Set();
  const tachyons = Array(grid.length).fill(0);
  let swap;
  queue1.add(wc);
  tachyons[wc] = 1;
  for (let r = wr; r < grid.length; r++) {
    for (let c of queue1) {
      if (grid[r][c] == "^") {
        splits += 1;
        queue2.add(c - 1);
        queue2.add(c + 1);
        tachyons[c - 1] = tachyons[c - 1] + tachyons[c];
        tachyons[c + 1] = tachyons[c + 1] + tachyons[c];
        tachyons[c] = 0;
      } else {
        queue2.add(c);
      }
    }
    queue1.clear();
    swap = queue1;
    queue1 = queue2;
    queue2 = swap;
  }
  const timelines = tachyons.reduce((acc, curr) => acc + curr);
  return { splits, timelines };
};

const { splits, timelines } = solve();

function partOne() {
  return splits;
}

function partTwo() {
  return timelines;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 1646

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 32451134474991
