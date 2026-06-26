const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-24"), "utf8")
  .trim();

const VALID_COMBINATIONS = [];

const GROUPS_COUNT_1 = 3;
const GROUPS_COUNT_2 = 4;

// NOTE: This will take a couple of seconds to finish
function main() {
  const weights = processInput();

  const result1 = getSmallestQE(weights, GROUPS_COUNT_1);
  const result2 = getSmallestQE(weights, GROUPS_COUNT_2);

  console.log("Part One", result1); // Expected output: 10723906903
  console.log("Part Two", result2); // Expected output: 74850409
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const weights = INPUT.split("\n").map((l) => parseInt(l));
  weights.sort((a, b) => a - b);
  return weights;
}

// Get Smallest Quantum entanglement
function getSmallestQE(weights, groupsCount) {
  const groupsWeight = weights.reduce((a, b) => a + b, 0) / groupsCount;
  const groups = weightCombinations(weights, groupsWeight);

  let smallestQE = Infinity; // Quantum entanglement
  let smallestSize = Infinity;
  for (const group of groups) {
    if (group.length <= smallestSize) {
      let qe = group.reduce((a, b) => a * b, 1);
      if (qe < smallestQE) {
        smallestQE = qe;
        smallestSize = group.length;
      }
    }
  }

  return smallestQE;
}

function weightCombinations(weights, target) {
  VALID_COMBINATIONS.length = 0;
  let comb = [];
  let accumulator = 0;
  const data = { target, comb, accumulator };
  wc_recursion(weights, 0, data);
  return [...VALID_COMBINATIONS];
}

function wc_recursion(elements, depth, data) {
  if (depth === elements.length || data.accumulator > data.target) {
    if (data.accumulator == data.target) {
      VALID_COMBINATIONS.push([...data.comb]);
    }
    return;
  }

  wc_recursion(elements, depth + 1, data);

  data.comb.push(elements[depth]);
  data.accumulator += elements[depth];
  wc_recursion(elements, depth + 1, data);
  data.comb.pop();
  data.accumulator -= elements[depth];
}

///////////////////////////////////////////////////////////////////////////////

main();
