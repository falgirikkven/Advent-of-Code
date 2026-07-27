const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-20"), "utf8")
  .trim();

const ADDRESS_MAXIMUM = 4294967295; // 2^32 - 1

function main() {
  const looseInvalidRanges = processInput();

  const invalidRanges = mergeRanges(looseInvalidRanges);

  const result1 = invalidRanges[0][1] + 1;
  const result2 = countValidIPs(invalidRanges);

  console.log("Part One", result1); // Expected output: 23923783
  console.log("Part Two", result2); // Expected output: 125
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const ranges = INPUT.split("\n").map((line) => {
    return line.split("-").map((e) => parseInt(e));
  });
  ranges.sort((a, b) => a[0] - b[0]);
  return ranges;
}

function mergeRanges(ranges) {
  const mergedRanges = [];
  let newRange = null;

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (newRange === null) {
      newRange = [...range];
    } else if (newRange[1] < range[0] - 1) {
      mergedRanges.push(newRange);
      newRange = [...range];
      //} else if (newRange[1] < range[1] || newRange[1] === range[0] - 1) {
    } else if (newRange[1] < range[1]) {
      newRange[1] = range[1];
    }
  }

  if (newRange != null) {
    mergedRanges.push(newRange);
  }

  return mergedRanges;
}

function countValidIPs(invalidRanges) {
  let count = 0;
  let lastUpper = 0;
  for (const range of invalidRanges) {
    count += range[0] - lastUpper;
    lastUpper = range[1] + 1;
  }
  count += ADDRESS_MAXIMUM - lastUpper + 1;
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
