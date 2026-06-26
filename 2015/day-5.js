const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-5"), "utf8")
  .trim();

function main() {
  const lines = processInput();

  const result1 = countNiceString(lines, isStringNiceV1);
  const result2 = countNiceString(lines, isStringNiceV2);

  console.log("Part One", result1); // Expected output: 238
  console.log("Part Two", result2); // Expected output: 69
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n");
}

function countNiceString(lines, niceModel) {
  let result = 0;
  for (const line of lines) {
    if (niceModel(line)) result += 1;
  }
  return result;
}

function isStringNiceV1(str) {
  const regexThreeVowels = /\w*[aeiou]\w*[aeiou]\w*[aeiou]\w*/;
  const regexDoubleLetter = /(.)\1+/;
  const regexNaughtyPairs = /(ab|cd|pq|xy)/;
  if (!regexThreeVowels.test(str)) {
    return 0;
  }
  if (!regexDoubleLetter.test(str)) {
    return 0;
  }
  if (regexNaughtyPairs.test(str)) {
    return 0;
  }

  return 1;
}

function isStringNiceV2(str) {
  const regexDoublePair = /(.{2}).*\1/;
  const regexLetterRepeated = /(.).\1/;
  if (!regexDoublePair.test(str)) {
    return 0;
  }
  if (!regexLetterRepeated.test(str)) {
    return 0;
  }

  return 1;
}

///////////////////////////////////////////////////////////////////////////////

main();
