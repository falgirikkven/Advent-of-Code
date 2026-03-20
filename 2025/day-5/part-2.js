const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function solve() {
  const { ranges } = processInput(INPUT); // ingredientsIds is unused

  const sortedRanges = sortRanges(ranges);

  const mergedRanges = mergeOverlapingRanges(sortedRanges);

  let result = mergedRanges.reduce(
    (acc, curr) => acc + curr[1] - curr[0],
    mergedRanges.length,
  );

  console.log("Part Two", result);
  // Expected output: 347468726696961
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const regex = /(\d+)/g;
  const splittedData = input.split("\n\n");

  const ranges = splittedData[0].split("\n").reduce((acc, curr) => {
    const range = curr.match(regex).map((n) => parseInt(n));
    acc.push(range);
    return acc;
  }, []);

  const ingredientIds = splittedData[1].match(regex).map((n) => parseInt(n));
  return { ranges, ingredientIds };
}

/* Sort ranges using by minimuns */
function sortRanges(ranges) {
  const arr = ranges.slice();
  arr.sort((a, b) => a[0] - b[0]);
  return arr;
}

/*
 * Since the array is sorted,
 * no element i will have a minimum less than the element i+1
 */
function mergeOverlapingRanges(ranges) {
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

///////////////////////////////////////////////////////////////////////////////

solve();
