const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const DEVICE_START = "you";
const DEVICE_GOAL = "out";

function main() {
  const devicesOutputs = processInput(INPUT);

  const countPathsToGoalMap = countPathsToGoal(devicesOutputs);

  let result = countPathsToGoalMap;

  console.log("Part One", result);
  // Expected output: 555
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const data = input.split("\n").map((line) => {
    const matches = line.match(/(\w+)/g);
    const head = matches.shift();
    return [head, matches];
  });
  return new Map(data);
}

function countPathsToGoal(devicesMap) {
  const registers = {};
  return cptg_rs(devicesMap, DEVICE_START, registers);
}

// countPathsToGoal_recursiveSearch
function cptg_rs(devicesMap, currentDevice, registers) {
  // Exit conditions
  if (registers[currentDevice] != null) {
    return registers[currentDevice];
  } else if (currentDevice == DEVICE_GOAL) {
    return 1;
  }

  // Possible paths from the current one
  const childrenDevices = devicesMap.get(currentDevice);

  // Get children data
  let total = 0;
  for (childDevice of childrenDevices) {
    const count = cptg_rs(devicesMap, childDevice, registers);
    total += count;
  }

  // Update current
  registers[currentDevice] = total;

  return total;
}

///////////////////////////////////////////////////////////////////////////////

main();
