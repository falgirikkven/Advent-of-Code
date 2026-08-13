const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-9"), "utf8")
  .trim();

function main() {
  const streamCharacters = processInput();

  const result1 = countScore(streamCharacters);
  const result2 = "TODO";

  console.log("Part One", result1); // Expected output: 11089
  console.log("Part Two", result2); // Expected output: 5288
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("");
}

function countScore(characterArray) {
  let score = 0;
  let nextScore = 0;

  let ignoreNext = false;
  let inGarbage = false;
  let garbageStateChange = false;

  let gabageCount = 0;

  for (let i = 0; i < characterArray.length; i++) {
    garbageStateChange = false;
    if (ignoreNext) {
      ignoreNext = false;
      continue;
    }
    const char = characterArray[i];
    switch (char) {
      case "!": {
        ignoreNext = true;
        break;
      }
      case "<": {
        if (!inGarbage) {
          inGarbage = true;
          garbageStateChange = true;
        }
        break;
      }
      case ">": {
        inGarbage = false;
        break;
      }
      case "{": {
        if (!inGarbage) nextScore += 1;
        break;
      }
      case "}": {
        if (!inGarbage && nextScore > 0) {
          score += nextScore;
          nextScore -= 1;
        }
        break;
      }
    }
    if (inGarbage && !garbageStateChange && !ignoreNext) {
      gabageCount += 1;
    }
  }

  return { score, gabageCount };
}

///////////////////////////////////////////////////////////////////////////////

main();
