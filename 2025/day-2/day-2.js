const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  const regex = /(\d+)-(\d+)/g;
  const matches = input.matchAll(regex);
  const ranges = [];

  let curr = matches.next();
  while (!curr.done) {
    const num1 = parseInt(curr.value[1]);
    const num2 = parseInt(curr.value[2]);
    ranges.push([num1, num2]);
    curr = matches.next();
  }

  return ranges;
};

const ranges = processInput();

function countDigis(num) {
  num = Math.abs(num);
  let count = 0;
  while (num > 0) {
    count += 1;
    num = Math.floor(num / 10);
  }
  return count;
}

function getInvalidIdArray(range) {
  const min = range[0];
  const max = range[1];
  const arr = [];

  const minDigits = countDigis(min);
  let digit;
  let curr;

  // Initial values ​​whether number of digits is even or odd
  if (minDigits % 2 === 0) {
    digit = minDigits / 2;
    curr = Math.floor(min / 10 ** digit);
  } else {
    digit = Math.round(minDigits / 2);
    curr = Math.floor(10 ** (digit - 1));
  }

  // If the first half is lower than the second half then the number is
  // below the minimum then we skip it.
  let k = 10 ** digit + 1;
  if (curr * k < min) curr += 1;

  // We track the numbers of iteration until the digit counter increases
  // rather than counting them every iteration
  let tillNextDigit = 10 ** digit - curr;

  while (1) {
    const possible = curr * k;
    if (possible > max) break;

    arr.push(possible);
    curr += 1;

    if (--tillNextDigit === 0) {
      digit += 1;
      k = 10 ** digit + 1;
      tillNextDigit = 10 ** digit - curr;
    }
  }

  return arr;
}

function partOne() {
  let sum = 0;
  for (const range of ranges) {
    sum += getInvalidIdArray(range).reduce((acc, curr) => acc + curr, 0);
  }
  return sum;
}

function partTwo() {
  return 0;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 44487518055

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output:
