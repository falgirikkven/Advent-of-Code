const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-13"), "utf8")
  .trim();

const NO_CONNECTION = -1;

function main() {
  const adjacencyMatrix = processInput();

  const result1 = findOptimalHappines(adjacencyMatrix);
  const result2 = findOptimalHappinesWithMe(adjacencyMatrix);

  console.log("Part One", result1); // Expected output: 618
  console.log("Part Two", result2); // Expected output: 601
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\w+).*(lose|gain)\s(\d+).+?(\w+)\./;
  const matches = INPUT.split("\n").map((lines) => lines.match(regex));

  const nodeNames = [];
  for (const match of matches) {
    if (nodeNames.indexOf(match[1]) == -1) nodeNames.push(match[1]);
    if (nodeNames.indexOf(match[4]) == -1) nodeNames.push(match[4]);
  }

  const adjacencyMatrix = [];
  for (let i = 0; i < nodeNames.length; i++) {
    adjacencyMatrix.push(Array(nodeNames.length).fill(NO_CONNECTION));
  }

  for (const match of matches) {
    let i = nodeNames.indexOf(match[1]);
    let j = nodeNames.indexOf(match[4]);
    let weight = parseInt(match[3]);
    let signed = match[2] == "lose" ? -weight : weight;
    adjacencyMatrix[i][j] = signed;
  }

  return adjacencyMatrix;
}

function findOptimalHappines(matrix) {
  let maximum = 0;
  for (let i = 0; i < matrix.length; i++) {
    let current = [0];
    findOptimalHappines_dfs(matrix, i, new Array(), 0, current);
    maximum = maximum < current[0] ? current[0] : maximum;
  }
  return maximum;
}

function findOptimalHappines_dfs(matrix, start, queue, accumulator, maximum) {
  let isLast = true;
  queue.push(start);

  for (let i = 0; i < matrix.length; i++) {
    if (matrix[start][i] != NO_CONNECTION && queue.indexOf(i) == -1) {
      isLast = false;
      let delta = matrix[start][i] + matrix[i][start];
      findOptimalHappines_dfs(matrix, i, queue, accumulator + delta, maximum);
    }
  }

  if (isLast) {
    accumulator += matrix[start][queue[0]];
    accumulator += matrix[queue[0]][start];
    maximum[0] = maximum[0] < accumulator ? accumulator : maximum[0];
  }

  queue.pop();
}

function findOptimalHappinesWithMe(matrix) {
  const newMatrix = insertMe(matrix);
  return findOptimalHappines(newMatrix);
}

function insertMe(where) {
  const matrix = [];
  for (let i = 0; i < where.length; i++) {
    const arr = [...where[i], 0];
    matrix.push(arr);
  }
  const meRow = new Array(where.length).fill(0);
  meRow.push(NO_CONNECTION);
  matrix.push(meRow);
  return matrix;
}

///////////////////////////////////////////////////////////////////////////////

main();
