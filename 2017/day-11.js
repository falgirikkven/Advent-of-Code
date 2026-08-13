const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-11"), "utf8")
  .trim();

function main() {
  const steps = processInput();

  const distances = followSteps(steps);

  const result1 = distances.lastDistance;
  const result2 = distances.maxDistance;

  console.log("Part One", result1); // Expected output: 796
  console.log("Part Two", result2); // Expected output: 1585
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split(",");
}

function followSteps(steps) {
  const seen = { ne: 0, sw: 0, nw: 0, se: 0, n: 0, s: 0 };
  let lastDistance = 0;
  let maxDistance = 0;
  for (const step of steps) {
    seen[step] += 1;
    lastDistance = countDistance(seen);
    maxDistance = maxDistance > lastDistance ? maxDistance : lastDistance;
  }

  return { lastDistance, maxDistance };
}

function countDistance(seen) {
  const opposites = [
    ["ne", "sw"],
    ["nw", "se"],
    ["n", "s"],
  ];

  // item0 + item1 = item2
  const transfroms = [
    ["ne", "s", "se"],
    ["ne", "nw", "n"],

    ["se", "n", "ne"],
    ["se", "sw", "s"],

    ["nw", "s", "sw"],
    ["nw", "ne", "n"],

    ["n", "sw", "nw"],
    ["n", "se", "ne"],

    ["s", "ne", "se"],
    ["s", "nw", "sw"],
  ];

  const stepCounts = Object.assign({}, seen);

  for (const opposite of opposites) {
    const opp0 = opposite[0];
    const opp1 = opposite[1];
    const diff = Math.min(stepCounts[opp0], stepCounts[opp1]);
    stepCounts[opp0] -= diff;
    stepCounts[opp1] -= diff;
  }

  for (const transform of transfroms) {
    const item0 = transform[0];
    const item1 = transform[1];
    const item2 = transform[2];
    const diff = Math.min(stepCounts[item0], stepCounts[item1]);
    stepCounts[item0] -= diff;
    stepCounts[item1] -= diff;
    stepCounts[item2] += diff;
  }

  let sum = 0;
  for (const [_, value] of Object.entries(stepCounts)) {
    sum += value;
  }

  return sum;
}

///////////////////////////////////////////////////////////////////////////////

main();
