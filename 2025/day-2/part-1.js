const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function main() {
  const ranges = processInput(INPUT);

  const allRangesInvalidIds = getAllRangesInvalidIds(ranges);

  let result = 0;
  for (const rangeInvalidIds of allRangesInvalidIds) {
    result += rangeInvalidIds.reduce((acc, curr) => acc + curr, 0);
  }

  console.log("Part One", result);
  // Expected output: 44487518055
}

///////////////////////////////////////////////////////////////////////////////

/*
 * If input="11-22,95-115,998-1012,"
 * Then output=[[11,22],[95,115],[998,1012]]
 */
function processInput(input) {
  const regex = /(\d+)-(\d+)/g;
  const matches = input.matchAll(regex);
  const ranges = [];

  let curr = matches.next();
  while (!curr.done) {
    const lowerBound = parseInt(curr.value[1]);
    const upperBound = parseInt(curr.value[2]);
    ranges.push([lowerBound, upperBound]);
    curr = matches.next();
  }

  return ranges;
}

/*
 * This will return an array of array,
 * for each range we got an array of invalid Ids
 */
function getAllRangesInvalidIds(ranges) {
  const arr = [];

  for (const range of ranges) {
    const invalidIds = rangeGetInvalidIds(range);

    arr.push(invalidIds);
  }

  return arr;
}

// Given a range, we calculate all its invalid ids
function rangeGetInvalidIds(range) {
  const arr = [];
  const lowerBound = range[0];
  const upperBound = range[1];

  const data = calculateIterationInitialValues(lowerBound);
  let { pattern, patternDigitsCount, scalar, increaseDigitCounter } = data;

  while (1) {
    const repeatingNumber = pattern * scalar;
    if (repeatingNumber > upperBound) break;

    arr.push(repeatingNumber);
    pattern += 1;

    if (--increaseDigitCounter === 0) {
      patternDigitsCount += 1;
      scalar = 10 ** patternDigitsCount + 1;
      increaseDigitCounter = 10 ** patternDigitsCount - pattern;
    }
  }

  return arr;
}

// Given the lower bound of a range,
// We calculate the initial values of the variables
function calculateIterationInitialValues(lowerBound) {
  const lowerDigitsCount = countDigits(lowerBound);
  let pattern;
  let patternDigitsCount;

  // Repeating patterns appear in even numbers,
  // We want to assure we start with even numbers
  if (lowerDigitsCount % 2 == 0) {
    patternDigitsCount = lowerDigitsCount / 2;
    pattern = Math.floor(lowerBound / 10 ** patternDigitsCount);
  } else {
    patternDigitsCount = Math.ceil(lowerDigitsCount / 2);
    pattern = Math.floor(10 ** (patternDigitsCount - 1));
  }

  let scalar = 10 ** patternDigitsCount + 1;

  // If the first half is lower than the second half,
  // Then the number is below the minimum, so we skip it.
  if (pattern * scalar < lowerBound) pattern += 1;

  let increaseDigitCounter = 10 ** patternDigitsCount - pattern;

  return { pattern, patternDigitsCount, scalar, increaseDigitCounter };
}

function countDigits(integer) {
  integer = Math.abs(integer);
  let count = 0;
  while (integer > 0) {
    count += 1;
    integer = Math.floor(integer / 10);
  }
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
