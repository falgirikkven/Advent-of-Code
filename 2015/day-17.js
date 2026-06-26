const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-17"), "utf8")
  .trim();

const QUANTITY_DESIRED = 150;

let combinationsCount = 0;
let smallestCombinationLength = Number.MAX_SAFE_INTEGER;
let smallestCombinationCount = 0;

function main() {
  const containers = processInput();

  countCombinationsOfContainers(containers, QUANTITY_DESIRED);

  const result1 = combinationsCount;
  const result2 = smallestCombinationCount;

  console.log("Part One", result1); // Expected output: 1304
  console.log("Part Two", result2); // Expected output: 18
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((n) => parseInt(n));
}

function countCombinationsOfContainers(containers, target) {
  smallestCombinationCount = 0;
  const visited = new Set();
  const accumulator = [0];
  const data = { visited, accumulator, target };

  for (let j = 0; j < containers.length; j++) {
    countCombinationsOfContainers_dfs(containers, j, data);
  }
}

// depth first serach
function countCombinationsOfContainers_dfs(containers, start, data) {
  const current = containers[start] + data.accumulator[0];
  if (current === data.target) {
    combinationsCount += 1;
    if (data.visited.size < smallestCombinationLength) {
      smallestCombinationLength = data.visited.size;
      smallestCombinationCount = 1;
    } else if (data.visited.size === smallestCombinationLength) {
      smallestCombinationCount += 1;
    }

    return;
  } else if (current > data.target) {
    return;
  }

  data.visited.add(start);
  data.accumulator[0] = current;

  for (let i = start + 1; i < containers.length; i++) {
    if (!data.visited.has(i)) {
      countCombinationsOfContainers_dfs(containers, i, data);
    }
  }

  data.visited.delete(start);
  data.accumulator[0] -= containers[start];
}

///////////////////////////////////////////////////////////////////////////////

main();
