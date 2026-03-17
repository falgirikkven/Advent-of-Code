const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function solve() {
  const problems = processInput(INPUT);

  const solutions = solveProblems(problems);

  let result = solutions.reduce((acc, curr) => acc + curr);

  console.log("Part One", result);
  // Expected output: 4648618073226
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const regex = /(\d+|\*|\+)/g;
  const lines = input.split("\n").map((l) => l.match(regex));
  const operations = lines.pop();
  const problems = [];

  for (let i = 0; i < lines[0].length; i++) {
    const problem = {};
    const numbers = [];
    for (let j = 0; j < lines.length; j++) {
      numbers.push(parseInt(lines[j][i]));
    }
    problem.numbers = numbers;
    problem.operation = operations[i];
    problems.push(problem);
  }

  return problems;
}

function solveProblems(problems) {
  const opperationMap = new Map([
    ["+", (a, b) => a + b],
    ["*", (a, b) => a * b],
  ]);

  return problems.map((problem) => {
    const opperation = opperationMap.get(problem.operation);
    return problem.numbers.reduce(opperation);
  });
}

///////////////////////////////////////////////////////////////////////////////

solve();
