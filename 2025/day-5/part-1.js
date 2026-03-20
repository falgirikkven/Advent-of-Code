const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function main() {
  const { ranges, ingredientIds } = processInput(INPUT);

  let result = countFreshIngredients(ranges, ingredientIds);

  console.log("Part One", result);
  // Expected output: 744
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

function countFreshIngredients(ranges, ingredientIds) {
  let count = 0;
  for (const ingredientId of ingredientIds) {
    if (isInAnyRange(ranges, ingredientId)) count += 1;
  }
  return count;
}

function isInAnyRange(ranges, ingredientId) {
  return ranges.some((r) => r[0] <= ingredientId && r[1] >= ingredientId);
}

///////////////////////////////////////////////////////////////////////////////

main();
