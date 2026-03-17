const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const BLANK = " ";

function solve() {
  const problems = processInput(INPUT);

  const solutions = solveProblems(problems);

  let result = solutions.reduce((acc, curr) => acc + curr);
  //let result = problems;
  console.log("Part Two", result);
  // Expected output: 7329921182115
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const lines = input.split("\n");
  const opsLine = lines[lines.length - 1];
  const len = opsLine.length;
  const problems = [];
  let start = 0;
  let curr = 1;
  while (curr <= len) {
    if (curr === len) {
      const numbers = [];
      const operation = opsLine.charAt(start);
      const end = lines[0].length;
      for (let i = start; i < end; i++) {
        numbers.push(getColumnNumber(lines, i));
      }
      problems.push({ numbers, operation });
      break;
    } else if (opsLine.charAt(curr) != BLANK) {
      const numbers = [];
      const operation = opsLine.charAt(start);
      const end = curr - 1;
      for (let i = start; i < end; i++) {
        numbers.push(getColumnNumber(lines, i));
      }
      problems.push({ numbers, operation });
      start = curr;
    }
    curr += 1;
  }

  return problems;
}

function getColumnNumber(lines, index) {
  const maxDigits = lines.length - 1;

  let start = 0;
  while (lines[start].charAt(index) == BLANK) start += 1;

  let result = 0;
  for (let i = start; i < maxDigits; i++) {
    const char = lines[i].charAt(index);
    if (char == BLANK) break;
    result = result * 10 + parseInt(char);
  }
  return result;
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
