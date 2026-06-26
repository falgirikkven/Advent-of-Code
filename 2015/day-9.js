const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-9"), "utf8")
  .trim();

const ADJACENCY_MATRIX = [];
const NO_CONNECTION = -1;

function main() {
  processInput();

  const data = getExtremes();

  const result1 = data.minimum;
  const result2 = data.maximun;

  console.log("Part One", result1); // Expected output: 141
  console.log("Part Two", result2); // Expected output: 736
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\w+)\sto\s(\w+)\s=\s(\d+)/;
  const rawDatas = INPUT.split("\n").map((lines) => lines.match(regex));

  const nodeNames = [];
  for (const tokens of rawDatas) {
    if (nodeNames.indexOf(tokens[1]) == -1) nodeNames.push(tokens[1]);
    if (nodeNames.indexOf(tokens[2]) == -1) nodeNames.push(tokens[2]);
  }

  for (let i = 0; i < nodeNames.length; i++) {
    ADJACENCY_MATRIX.push(Array(nodeNames.length).fill(NO_CONNECTION));
  }

  for (const tokens of rawDatas) {
    let i = nodeNames.indexOf(tokens[1]);
    let j = nodeNames.indexOf(tokens[2]);
    let weight = parseInt(tokens[3]);
    ADJACENCY_MATRIX[i][j] = weight;
    ADJACENCY_MATRIX[j][i] = weight;
  }
}

function getExtremes() {
  let minimum = Number.MAX_SAFE_INTEGER;
  let maximun = 0;
  for (let i = 0; i < ADJACENCY_MATRIX.length; i++) {
    const data = { visited: new Set(), minimum, maximun };
    getExtremes_dfs(i, data);
    minimum = data.minimum < minimum ? data.minimum : minimum;
    maximun = data.maximun > maximun ? data.maximun : maximun;
  }

  return { minimum, maximun };
}

// depth first search
function getExtremes_dfs(start, data, accumulator = 0, deep = 1) {
  if (deep == ADJACENCY_MATRIX.length) {
    data.minimum = accumulator < data.minimum ? accumulator : data.minimum;
    data.maximun = accumulator > data.maximun ? accumulator : data.maximun;
    return;
  }

  data.visited.add(start);

  for (let i = 0; i < ADJACENCY_MATRIX.length; i++) {
    const value = ADJACENCY_MATRIX[start][i];
    if (value !== NO_CONNECTION && !data.visited.has(i)) {
      getExtremes_dfs(i, data, accumulator + value, deep + 1);
    }
  }

  data.visited.delete(start);
}

///////////////////////////////////////////////////////////////////////////////

main();
