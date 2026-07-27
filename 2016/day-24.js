const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-24"), "utf8")
  .trim();

const CHAR_WALL = "#";
const CHAR_OPEN = ".";

const GRID_WALL = 1;
const GRID_OPEN = 0;

function main() {
  const { grid, poiList } = processInput();

  const adjMatrix = createDistancesMatrix(grid, poiList);

  const minimums = getFewestSteps(adjMatrix);

  const result1 = minimums.dist1;
  const result2 = minimums.dist2;

  console.log("Part One", result1); // Expected output: 498
  console.log("Part Two", result2); // Expected output: 804
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const pois = []; // Points of interest
  const rawData = INPUT.split("\n").map((l) => l.split(""));
  const n = rawData.length;
  const m = rawData[0].length;

  const grid = new Array(n);
  for (let i = 0; i < n; i++) {
    const row = new Array(m);
    for (let j = 0; j < m; j++) {
      const char = rawData[i][j];
      if (char === CHAR_WALL) {
        row[j] = GRID_WALL;
      } else if (char === CHAR_OPEN) {
        row[j] = GRID_OPEN;
      } else if (!isNaN(parseInt(char))) {
        row[j] = GRID_OPEN;
        pois.push([parseInt(char), { row: i, col: j }]);
      }
    }
    grid[i] = row;
  }

  pois.sort((a, b) => a[0] - b[0]);
  const poiList = pois.reduce((acc, curr) => {
    acc.push(curr[1]);
    return acc;
  }, []);

  return { grid, poiList };
}

function getFewestSteps(adjMatrix) {
  const len = adjMatrix.length;
  const visited = new Array(len).fill(0);
  const data = {
    matrix: adjMatrix,
    visited,
    min1: Infinity,
    min2: Infinity,
  };

  gfs_recursion(data, 0, 0, 0);
  return { dist1: data.min1, dist2: data.min2 };
}

function gfs_recursion(data, index, steps, depth) {
  depth += 1;
  if (depth === data.matrix.length) {
    data.min1 = Math.min(steps, data.min1);
    data.min2 = Math.min(steps + data.matrix[index][0], data.min2);
    return;
  }

  data.visited[index] = 1;
  for (let i = 0; i < data.matrix.length; i++) {
    if (data.visited[i] == 1) continue;
    gfs_recursion(data, i, steps + data.matrix[index][i], depth);
  }
  data.visited[index] = 0;
}

function createDistancesMatrix(grid, locationList) {
  const len = locationList.length;
  const distances = new Array(len).fill(0).map((_) => new Array(len));

  locationList.forEach((loc1, index1) => {
    distances[index1][index1] = 0;
    locationList.forEach((loc2, index2) => {
      if (index1 === index2) return;
      const dist = pathFind(grid, loc1.row, loc1.col, loc2.row, loc2.col);
      distances[index1][index2] = dist;
      distances[index2][index1] = dist;
    });
  });

  return distances;
}

///////////////////////////////////////////////////////////////////////////////

function pathFind(grid, rStart, cStart, rEnd, cEnd) {
  const directions = [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
  ];

  const rows = grid.length;
  const cols = grid[0].length;

  const gScore = new Array(rows);
  const fScore = new Array(rows);
  for (let i = 0; i < rows; i++) {
    gScore[i] = new Array(cols).fill(Infinity);
    fScore[i] = new Array(cols).fill(Infinity);
  }

  gScore[rStart][cStart] = 0;
  fScore[rStart][cStart] = distance(rStart, cStart, rEnd, cEnd);

  const priorityQueue = [];
  priorityQueue.push([rStart, cStart, fScore[rStart][cStart]]);

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => b[2] - a[2]);
    const top = priorityQueue.pop(); // Lowest fScore
    const r = top[0];
    const c = top[1];

    if (r == rEnd && c == cEnd) {
      return gScore[r][c];
    }

    for (const direction of directions) {
      const nr = r + direction[0];
      const nc = c + direction[1];
      const flag = nr >= 0 && nr < rows && nc >= 0 && nc < cols;
      if (!flag || grid[nr][nc] === GRID_WALL) continue;

      const tentative_gScore = gScore[r][c] + distance(r, c, nr, nc);
      if (tentative_gScore >= gScore[nr][nc]) continue;

      gScore[nr][nc] = tentative_gScore;
      fScore[nr][nc] = tentative_gScore + distance(r, c, nr, nc);
      if (!priorityQueue.some((e) => e[0] === nr && e[1] === nc)) {
        priorityQueue.push([nr, nc, fScore[nr][nc]]);
      }
    }
  }

  return gScore;
}

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.abs(dx) + Math.abs(dy);
}

///////////////////////////////////////////////////////////////////////////////

main();
