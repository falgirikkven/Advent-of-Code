const DIRECTIONS = [
  [0, -1], // Up
  [1, 0], // Right
  [0, 1], // Down
  [-1, 0], // Left
];

const MAZE_DIM = 50;
const MAZE_WALL = "#";
const MAZE_SPACE = ".";

const LOC_S = { x: 1, y: 1 };
const LOC_E = { x: 31, y: 39 }; // INPUT

const FAVORITE_NUMBER = 1362;
const PART2_THRESHOLD = 50;

function main() {
  const maze = generateMaze(FAVORITE_NUMBER, MAZE_DIM);

  const gScore = pathFind(maze, LOC_S.x, LOC_S.y, LOC_E.x, LOC_E.y);

  const result1 = gScore[LOC_E.y][LOC_E.x];
  const result2 = countDifferentLocations(gScore, PART2_THRESHOLD);

  console.log("Part One", result1); // Expected output: 82
  console.log("Part Two", result2); // Expected output: 138
}

///////////////////////////////////////////////////////////////////////////////

function generateMaze(favorite, dim) {
  const maze = new Array(dim).fill(0).map((_) => new Array(dim).fill(0));
  for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
      const char = isWall(x, y, favorite) ? 1 : 0;
      maze[y][x] = char;
    }
  }

  return maze;
}

function isWall(x, y, fav) {
  const sum = x * x + 3 * x + 2 * x * y + y + y * y + fav;
  return (hammingWeight(sum) & 1) === 1;
}

function hammingWeight(v) {
  v = v - ((v >> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
  return (((v + (v >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

function pathFind(maze, xStart, yStart, xEnd, yEnd) {
  const n = maze.length;
  const m = maze[0].length;

  const gScore = new Array(n);
  const fScore = new Array(n);
  for (let i = 0; i < n; i++) {
    gScore[i] = new Array(m).fill(Infinity);
    fScore[i] = new Array(m).fill(Infinity);
  }

  gScore[yStart][xStart] = 0;
  fScore[yStart][xStart] = distance(xStart, yStart, xEnd, yEnd);

  const priorityQueue = [];
  priorityQueue.push([xStart, yStart, fScore[yStart][xStart]]);

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => b[2] - a[2]);
    const top = priorityQueue.pop(); // Lowest fScore
    const x = top[0];
    const y = top[1];

    for (const direction of DIRECTIONS) {
      const nx = x + direction[0];
      const ny = y + direction[1];
      const flag = nx >= 0 && nx < m && ny >= 0 && ny < n;
      if (!flag || maze[ny][nx] === 1) continue;

      const tentative_gScore = gScore[y][x] + distance(x, y, nx, ny);
      if (tentative_gScore >= gScore[ny][nx]) continue;

      gScore[ny][nx] = tentative_gScore;
      fScore[ny][nx] = tentative_gScore + distance(nx, ny, xEnd, yEnd);
      if (!priorityQueue.some((e) => e[0] === nx && e[1] === ny)) {
        priorityQueue.push([nx, ny, fScore[ny][nx]]);
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

function countDifferentLocations(gScore, steps) {
  let count = 0;
  for (const row of gScore) {
    for (const dist of row) {
      if (dist <= steps) count += 1;
    }
  }
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
