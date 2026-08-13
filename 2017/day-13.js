const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-13"), "utf8")
  .trim();

function main() {
  const securityLayers = processInput();

  const result1 = calculateSeverity(securityLayers);
  const result2 = findLowestDelay(securityLayers);

  console.log("Part One", result1); // Expected output: 2688
  console.log("Part Two", result2); // Expected output: 3876272
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(?<depth>(\d+)):\s(?<range>(\d+))/;
  return INPUT.split("\n").map((line) => {
    const match = line.match(regex);
    const obj = {};
    obj.depth = parseInt(match.groups.depth);
    obj.range = parseInt(match.groups.range);

    return obj;
  });
}

function calculateSeverity(layers) {
  let severity = 0;

  for (const layer of layers) {
    const depth = layer.depth;
    const range = layer.range;
    if (depth % (2 * (range - 1)) == 0) severity += depth * range;
  }

  return severity;
}

function findLowestDelay(layers) {
  let delay = 0;

  while (true) {
    let flag = true;

    for (const layer of layers) {
      const depth = layer.depth + delay;
      const range = layer.range;
      if (depth % (2 * (range - 1)) == 0) {
        flag = false;
        break;
      }
    }

    if (flag) break;

    delay += 1;
  }
  return delay;
}

///////////////////////////////////////////////////////////////////////////////

main();
