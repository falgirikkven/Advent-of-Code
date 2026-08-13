const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-24"), "utf8")
  .trim();

function main() {
  const birdgeComponents = processInput();

  const results = calculateBridgeStrength(birdgeComponents);

  const result1 = results.maximumStrength;
  const result2 = results.strengthOfLongest;

  console.log("Part One", result1); // Expected output: 2006
  console.log("Part Two", result2); // Expected output: 1994
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\d+)\/(\d+)/;

  return INPUT.split("\n").map((line) => {
    const match = line.match(regex);
    const arr = [];
    arr.push(parseInt(match[1]));
    arr.push(parseInt(match[2]));
    return arr;
  });
}

function calculateBridgeStrength(components) {
  const port = 0;
  const data = { port };
  data.longestL = 0;
  data.longestS = 0;
  data.maximum = 0;
  data.seen = new Array(components.length).fill(0);

  for (let i = 0; i < components.length; i++) {
    if (components[i][0] == port) cbs_recursion(data, components, i, 0);
    else if (components[i][1] == port) cbs_recursion(data, components, i, 1);
  }

  return { maximumStrength: data.maximum, strengthOfLongest: data.longestS };
}

// createStrongestBridge_recursion
function cbs_recursion(data, components, componentIndex, portIndex) {
  data.seen[componentIndex] = 1;
  data.port = components[componentIndex][portIndex ^ 1];

  // Check all cases
  let isLeaf = true;
  for (let i = 0; i < components.length; i++) {
    if (data.seen[i] == 1) continue;

    if (components[i][0] == data.port) {
      isLeaf = false;
      cbs_recursion(data, components, i, 0);
    } else if (components[i][1] == data.port) {
      isLeaf = false;
      cbs_recursion(data, components, i, 1);
    }
  }

  // Update Data
  if (isLeaf) {
    let strength = 0;
    let bridgeLength = 0;

    components.forEach((element, index) => {
      strength += (element[0] + element[1]) * data.seen[index];
      bridgeLength += data.seen[index];
    });

    if (bridgeLength == data.longestL && strength > data.longestS) {
      data.longestS = strength;
    } else if (bridgeLength > data.longestL) {
      data.longestL = bridgeLength;
      data.longestS = strength;
    }
    data.maximum = data.maximum > strength ? data.maximum : strength;
  }

  data.port = components[componentIndex][portIndex];
  data.seen[componentIndex] = 0;
}

///////////////////////////////////////////////////////////////////////////////

main();
