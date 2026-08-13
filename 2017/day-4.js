const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-4"), "utf8")
  .trim();

function main() {
  const passphrases = processInput();

  const result1 = countMatching(passphrases, areTokensUniques);
  const result2 = countMatching(passphrases, canBeRearranged);

  console.log("Part One", result1); // Expected output: 451
  console.log("Part Two", result2); // Expected output: 223
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((line) => line.split(" "));
}

function countMatching(datas, condition) {
  return datas.reduce((acc, curr) => acc + (condition(curr) ? 1 : 0), 0);
}

function areTokensUniques(words) {
  const uniques = new Set();
  for (const word of words) uniques.add(word);
  return uniques.size == words.length;
}

function canBeRearranged(words) {
  const matrixCharCodes = words.map((word) => {
    return word.split("").map((e) => e.codePointAt(0));
  });
  for (const wordCharCodes of matrixCharCodes) {
    wordCharCodes.sort((a, b) => a - b);
  }

  for (let i = 0; i < matrixCharCodes.length; i++) {
    let flag = false;
    for (let j = i + 1; j < matrixCharCodes.length; j++) {
      const word1 = matrixCharCodes[i];
      const word2 = matrixCharCodes[j];
      const wLen1 = word1.length;
      if (wLen1 !== word2.length) continue;
      let flagBroken = false;
      for (let k = 0; k < wLen1; k++) {
        if (word1[k] != word2[k]) {
          flagBroken = true;
          break;
        }
      }
      if (!flagBroken) {
        flag = true;
        break;
      }
    }

    if (flag) return false;
  }
  return true;
}

///////////////////////////////////////////////////////////////////////////////

main();
