const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const opperations = new Map([
  ["+", (a, b) => a + b],
  ["*", (a, b) => a * b],
]);

const processInput = () => {
  const regex = /(\d+|\*|\+)/g;
  const splitted = input.split("\n").map((l) => l.match(regex));
  const ops = splitted.pop();
  const problems = [];
  for (let i = 0; i < splitted[0].length; i++) {
    const problem = {};
    const nums = [];
    for (let j = 0; j < splitted.length; j++) {
      //nums.push(parseInt(splitted[j][i]));
      nums.push(splitted[j][i]);
    }
    problem.nums = nums;
    problem.op = ops[i];
    problems.push(problem);
  }
  return problems;
};

const problems = processInput();
console.log(problems);

function partOne() {
  let sum = 0;
  for (const problem of problems) {
    //const numbers = problem.nums;
    const numbers = problem.nums.map((n) => parseInt(n));
    const opperation = opperations.get(problem.op);
    sum += numbers.reduce(opperation);
  }
  return sum;
}

function partTwo() {
  return 0;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 4648618073226

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output:
