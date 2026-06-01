const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const DEVICE_START = "svr";
const DEVICE_GOAL = "out";
const DEVICE_REQUIRED = ["dac", "fft"];
const DEVICE_ALLREQUIRED_KEY = 2 ** DEVICE_REQUIRED.length - 1;

function main() {
  const devicesOutputs = processInput(INPUT);

  const countPathsToGoalMap = countPathsToGoal(devicesOutputs);

  let result = countPathsToGoalMap;

  console.log("Part Two", result);
  // Expected output: 502447498690860
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
  const result = cptg_rs(devicesMap, DEVICE_START, registers, 0);
  return result[DEVICE_ALLREQUIRED_KEY];
}

// NOTE: this function can be simplified,
// but I like to have every step well defined
// countPathsToGoal_recursiveSearch
function cptg_rs(devicesMap, currentDevice, registers, currentKey) {
  // Exit conditions
  if (registers[currentDevice] != null) {
    return registers[currentDevice];
  } else if (currentDevice == DEVICE_GOAL) {
    return { [currentKey]: 1 };
  }

  // Possible paths from the current one
  const childrenDevices = devicesMap.get(currentDevice);

  // Get children data
  const childrenData = [];
  for (childDevice of childrenDevices) {
    const result = cptg_rs(devicesMap, childDevice, registers, currentKey);
    childrenData.push(result);
  }

  // Merge all children data
  const mergedChildrenData = childrenData.reduce((acc, curr) => {
    for (const key in curr) {
      acc[key] = acc[key] || 0;
      acc[key] += curr[key];
    }
    return acc;
  }, {});

  // Update Key
  if (DEVICE_REQUIRED.indexOf(currentDevice) != -1) {
    currentKey = currentKey | (2 ** DEVICE_REQUIRED.indexOf(currentDevice));
  }

  // Generate current data
  const currentData = {};
  for (const key in mergedChildrenData) {
    const newKey = currentKey | parseInt(key);
    currentData[newKey] = currentData[newKey] || 0;
    currentData[newKey] += mergedChildrenData[key];
  }

  // Update registers
  registers[currentDevice] = currentData;

  return currentData;
}

///////////////////////////////////////////////////////////////////////////////

main();
