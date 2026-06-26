const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-12"), "utf8")
  .trim();

function main() {
  const json = processInput();

  const result1 = sumJSON(json);
  const result2 = sumJSON(json, "red");

  console.log("Part One", result1); // Expected output: 111754
  console.log("Part Two", result2); // Expected output: 65402
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return JSON.parse(INPUT);
}

function sumJSON(whichJSON, ignore = null) {
  if (typeof whichJSON === "string") return 0;
  if (typeof whichJSON === "number") return whichJSON;

  if (Array.isArray(whichJSON)) {
    return whichJSON.reduce((acc, curr) => acc + sumJSON(curr, ignore), 0);
  } else if (typeof whichJSON === "object") {
    let sum = 0;
    for (const key in whichJSON) {
      if (whichJSON[key] == ignore) {
        return 0;
      }
    }
    for (const [_, value] of Object.entries(whichJSON)) {
      sum += sumJSON(value, ignore);
    }
    return sum;
  }
}

///////////////////////////////////////////////////////////////////////////////

main();
