const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  const regex = /(\d+)/g;
  const splittedData = input.split("\n\n");
  const ranges = splittedData[0].split("\n").reduce((acc, curr) => {
    const range = curr.match(regex).map((n) => parseInt(n));
    acc.push(range);
    return acc;
  }, []);
  ranges.sort((a, b) => a[0] - b[0]);

  const ingredientIDs = splittedData[1].match(regex).map((n) => parseInt(n));
  return { ranges, ingredientIDs };
};

const { ranges, ingredientIDs } = processInput();

function isInAnyRange(accumulator, current) {
  if (ranges.some((range) => range[0] <= current && range[1] >= current)) {
    accumulator += 1;
  }
  return accumulator;
}

function partOne() {
  return ingredientIDs.reduce(isInAnyRange, 0);
}

function mergeOverlapingRanges() {
  const arr = [];
  const len = ranges.length;
  let cursor = 0;

  while (cursor < len) {
    let min = ranges[cursor][0];
    let max = ranges[cursor][1];
    let cursor2 = cursor + 1;
    while (cursor2 < len) {
      const min2 = ranges[cursor2][0];
      const max2 = ranges[cursor2][1];
      if (max >= max2) {
        cursor += 1;
      } else if (max >= min2) {
        max = max2;
        cursor = cursor2;
      }
      cursor2 += 1;
    }
    cursor += 1;
    arr.push([min, max]);
  }

  return arr;
}

function partTwo() {
  const or = mergeOverlapingRanges();
  return or.reduce((acc, curr) => acc + curr[1] - curr[0], 0) + or.length;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 744

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 347468726696961
