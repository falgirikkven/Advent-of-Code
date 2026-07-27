const crypto = require("node:crypto");
const INPUT = "hhhxzeay";

const GRID_SIZE = 4;

const DIRECTIONS = [
  { id: "U", dr: -1, dc: 0 },
  { id: "D", dr: 1, dc: 0 },
  { id: "L", dr: 0, dc: -1 },
  { id: "R", dr: 0, dc: 1 },
];

const DIRECTIONS_LENGHT = DIRECTIONS.length;

let minimum;
let maximum;
let minPath;

function main() {
  navigateGrid(INPUT);

  const result1 = minPath;
  const result2 = maximum;

  console.log("Part One", result1); // Expected output: DDRUDLRRRD
  console.log("Part Two", result2); // Expected output: 398
}

///////////////////////////////////////////////////////////////////////////////

function navigateGrid(passcode) {
  minimum = Infinity;
  maximum = 0;
  minPath = "";

  const start = createStartingNode();
  const neighbors = getNeighbors(start, passcode);

  for (const direction of neighbors) {
    start.row += direction.dr;
    start.col += direction.dc;
    start.path.push(direction.id);
    navigateGrid_dfs(start, neighbors, passcode);
    start.row -= direction.dr;
    start.col -= direction.dc;
    start.path.pop();
  }
}

function navigateGrid_dfs(node, direction, passcode) {
  if (node.row == GRID_SIZE - 1 && node.col == GRID_SIZE - 1) {
    if (node.path.length < minimum) {
      minimum = node.path.length;
      minPath = node.path.join("");
    }
    maximum = node.path.length > maximum ? node.path.length : maximum;
    return;
  }
  const neighbors = getNeighbors(node, passcode);
  for (const direction of neighbors) {
    node.row += direction.dr;
    node.col += direction.dc;
    node.path.push(direction.id);
    navigateGrid_dfs(node, neighbors, passcode);
    node.row -= direction.dr;
    node.col -= direction.dc;
    node.path.pop();
  }
}

function getNeighbors(state, code) {
  const neighbors = [];
  const hash = md5(code + state.path.join(""))
    .substring(0, DIRECTIONS_LENGHT)
    .split("");
  const r = state.row;
  const c = state.col;
  for (let i = 0; i < DIRECTIONS_LENGHT; i++) {
    if (parseInt(hash[i], 16) <= 10) continue; // only b,c,d,e,f mean open
    const dir = DIRECTIONS[i];
    const nr = r + dir.dr;
    const nc = c + dir.dc;
    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) continue;
    neighbors.push(dir);
  }

  return neighbors;
}

function createStartingNode(row, col) {
  return { row: 0, col: 0, path: [] };
}

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

///////////////////////////////////////////////////////////////////////////////

main();
