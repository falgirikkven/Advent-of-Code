const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-6"), "utf8")
  .trim();

const MOST_COMMON = false;
const LEAST_COMMON = true;

function main() {
  const recordedLines = processInput();

  const result1 = getMessage(recordedLines, MOST_COMMON);
  const result2 = getMessage(recordedLines, LEAST_COMMON);

  console.log("Part One", result1); // Expected output: qrqlznrl
  console.log("Part Two", result2); // Expected output: kgzdfaon
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((line) => line.split(``));
}

function getMessage(lines, mode = false) {
  const message = [];
  const strLen = lines[0].length;

  for (let j = 0; j < strLen; j++) {
    const counts = new Map();
    for (let i = 0; i < lines.length; i++) {
      const token = lines[i][j];
      let value = counts.get(token);
      if (value == null) {
        value = 0;
        counts.set(token, 0);
      }
      counts.set(token, value + 1);
    }

    const countsArr = Array.from(counts).sort((a, b) => b[1] - a[1]);
    if (mode == MOST_COMMON) message.push(countsArr[0][0]);
    if (mode == LEAST_COMMON) message.push(countsArr[countsArr.length - 1][0]);
  }

  return message.join("");
}

///////////////////////////////////////////////////////////////////////////////

main();
