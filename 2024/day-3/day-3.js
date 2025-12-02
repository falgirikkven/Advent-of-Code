const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  const regex = /(mul\((\d+),(\d+)\)|do\(\)|don't\(\))/g;
  const matches = input.matchAll(regex);
  const mulAll = [];
  const mulSome = [];
  let enabled = true;

  let curr = matches.next();
  while (!curr.done) {
    if (curr.value[0] == "don't()") {
      enabled = false;
    } else if (curr.value[0] == "do()") {
      enabled = true;
    } else {
      const num1 = parseInt(curr.value[2]);
      const num2 = parseInt(curr.value[3]);
      mulAll.push([num1, num2]);
      if (enabled) {
        mulSome.push([num1, num2]);
      }
    }
    curr = matches.next();
  }

  return { mulAll, mulSome };
};

const { mulAll, mulSome } = processInput();

function partOne() {
  return mulAll.reduce((acc, curr) => acc + curr[0] * curr[1], 0);
}

function partTwo() {
  return mulSome.reduce((acc, curr) => acc + curr[0] * curr[1], 0);
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 174960292

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 56275602
