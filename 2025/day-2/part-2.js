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

  console.log("Part Two", result);
  // Expected output: 53481866137
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

  // We will look for for patterns with a prime number of digits.
  // So we are less likely to count an id twice.
  // This small set should be enough.
  const primes = [2, 3, 5, 7, 11];

  for (let i = 0; i < primes.length; i++) {
    const prime = primes[i];

    const data = calculateIterationInitialValues(lowerBound, prime);
    let { pattern, patternDigitsCount, scalar, increaseDigitCounter } = data;

    while (1) {
      const repeatingNumber = pattern * scalar;
      if (repeatingNumber > upperBound) break;

      arr.push(repeatingNumber);
      pattern += 1;

      if (--increaseDigitCounter === 0) {
        patternDigitsCount += 1;
        scalar = calculateScalar(patternDigitsCount, prime);
        increaseDigitCounter = 10 ** patternDigitsCount - pattern;
      }
    }
  }

  return arr.filter((num, i) => arr.indexOf(num) === i);
}

// Given the lower bound of a range and a prime,
// We calculate the initial values of the variables
function calculateIterationInitialValues(lowerBound, prime) {
  const lowerDigitsCount = countDigits(lowerBound);
  let pattern;
  let patternDigitsCount;

  // Repeating patterns appear in numbers that are multiples of a prime number
  // We want to assure we start with these kind of numbers
  if (lowerDigitsCount % prime === 0) {
    patternDigitsCount = lowerDigitsCount / prime;
    pattern = Math.floor(
      lowerBound / 10 ** (lowerDigitsCount - patternDigitsCount),
    );
  } else {
    patternDigitsCount = Math.ceil(lowerDigitsCount / prime);
    pattern = 10 ** (patternDigitsCount - 1);
  }

  let scalar = calculateScalar(patternDigitsCount, prime);

  // Skips numbers below the lower bound
  if (pattern * scalar < lowerBound) pattern += 1;

  let increaseDigitCounter = 10 ** patternDigitsCount - pattern;

  return {
    pattern,
    patternDigitsCount,
    scalar,
    increaseDigitCounter,
  };
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

// This will calculate the scalar for iteration
// n, is the length of the pattern
// p, is how many times it repeates
// e.g. n=2,p=3 should return 10101
function calculateScalar(n, p) {
  const base = 10 ** n;
  let result = 1;
  for (let i = 1; i < p; i++) {
    result = result * base + 1;
  }

  return result;
}

///////////////////////////////////////////////////////////////////////////////

main();
