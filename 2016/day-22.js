const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-22"), "utf8")
  .trim();

const GRID_THRESHOLD = 100;

const GRID_EMPTY = "_";
const GRID_MOVABLE = ".";
const GRID_IMMOVABLE = "#";

const DIRECTIONS = [
  [0, -1], // Up
  [1, 0], // Right
  [0, 1], // Down
  [-1, 0], // Left
];

function main() {
  const nodes = processInput();

  const result1 = countViablePairs(nodes);
  const result2 = getFewestSteps(nodes); // Cheap solution

  console.log("Part One", result1); // Expected output: 987
  console.log("Part Two", result2); // Expected output: 220
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = new RegExp(
    "x(?<x>\\d+)-y(?<y>\\d+)" +
      "\\s+(?<size>\\d+)\\w" +
      "\\s+(?<used>\\d+)\\w" +
      "\\s+(?<free>\\d+)\\w" +
      "\\s+(?<usep>\\d+)\\%",
  );
  const fields = ["x", "y", "size", "used", "free", "usep"];

  let xMax = 0;
  let yMax = 0;

  const nodes = [];
  INPUT.split("\n").forEach((line) => {
    const match = line.match(regex);
    if (!match) return; // Skips this line

    const obj = {};
    for (const field of fields) {
      obj[field] = parseInt(match.groups[field]);
    }
    nodes.push(obj);
  });

  return nodes;
}

function countViablePairs(nodes) {
  let count = 0;
  const len = nodes.length;
  // isViablePair is not a symmetric function,
  // therefore all cases must be checked.
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (isViablePair(nodes[i], nodes[j])) {
        count += 1;
      }
    }
  }

  return count;
}

function isViablePair(nodeA, nodeB) {
  if (nodeA.x == nodeB.x && nodeA.y == nodeB.y) return false;
  if (nodeA.used == 0) return false;
  if (nodeA.used > nodeB.free) return false;
  return true;
}

// NOTE: This is a cheap solution and assumes two things.
// First, we have two types of nodes based on their size, those that can be
// moved and those that cannot.
// Second, the first two rows have no immovable nodes.
function getFewestSteps(nodes) {
  let minimum = Infinity;
  const { grid, xStart, yStart, xMax, yMax } = createGrid(nodes);

  const gScore = new Array(yMax);
  const fScore = new Array(yMax);
  for (let i = 0; i < yMax; i++) {
    gScore[i] = new Array(xMax).fill(Infinity);
    fScore[i] = new Array(xMax).fill(Infinity);
  }

  const xEnd = xMax - 2;
  const yEnd = 0;
  gScore[yStart][xStart] = 0;
  fScore[yStart][xStart] = distance(xStart, yStart, xEnd, yEnd);

  const priorityQueue = [];
  priorityQueue.push([xStart, yStart, fScore[yStart][xStart]]);

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => b[2] - a[2]);
    const top = priorityQueue.pop(); // Lowest fScore
    const x = top[0];
    const y = top[1];

    if (x == xEnd && y == yEnd) {
      minimum = gScore[yEnd][xEnd];
      break;
    }

    for (const direction of DIRECTIONS) {
      const nx = x + direction[0];
      const ny = y + direction[1];
      const flag = nx >= 0 && nx < xMax && ny >= 0 && ny < yMax;
      if (!flag || grid[ny][nx] == GRID_IMMOVABLE) continue;

      const tentative_gScore = gScore[y][x] + distance(x, y, nx, ny);
      if (tentative_gScore >= gScore[ny][nx]) continue;

      gScore[ny][nx] = tentative_gScore;
      fScore[ny][nx] = tentative_gScore + distance(nx, ny, xEnd, yEnd);
      if (!priorityQueue.some((e) => e[0] === nx && e[1] === ny)) {
        priorityQueue.push([nx, ny, fScore[ny][nx]]);
      }
    }
  }

  return minimum + (xMax - 2) * 5 + 1;
}

function createGrid(nodes) {
  let xMax = 0;
  let yMax = 0;

  nodes.forEach((node) => {
    xMax = Math.max(xMax, node.x);
    yMax = Math.max(yMax, node.y);
  });
  xMax += 1;
  yMax += 1;

  let xStart = -1;
  let yStart = -1;
  const grid = new Array(yMax).fill(0).map((_) => new Array(xMax).fill(0));
  for (const node of nodes) {
    const value = node.size < GRID_THRESHOLD ? GRID_MOVABLE : GRID_IMMOVABLE;
    grid[node.y][node.x] = value;

    if (node.used == 0) {
      xStart = node.x;
      yStart = node.y;
    }
  }

  grid[yStart][xStart] = GRID_EMPTY;

  return { grid, xStart, yStart, xMax, yMax };
}

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.abs(dx) + Math.abs(dy);
}

///////////////////////////////////////////////////////////////////////////////

main();
