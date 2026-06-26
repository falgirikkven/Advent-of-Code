const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-8"), "utf8")
  .trim();

const REGEX_ASCIIHEX = /\\x[0-9a-fA-F]{2}/g;
const REGEX_SLASHQUOTES = /(\\{2})|(\\\")/g;

// how many extra characters are needed
const PONDERATION_1 = [2, 3, 1]; // [double quotes, ascii; quotes or slash]
const PONDERATION_2 = [4, 1, 2]; // [double quotes, ascii; quotes or slash]

function main() {
  const lines = processInput();

  const result1 = countTotal(lines, PONDERATION_1);
  const result2 = countTotal(lines, PONDERATION_2);

  console.log("Part One", result1); // Expected output: 1350
  console.log("Part One", result2); // Expected output: 2085
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("");
}

function countTotal(lines, ponderation) {
  let count = 0;
  for (const line of lines) {
    count += countAuxiliarCharacters(line, ponderation);
  }
  return count;
}

// number of character in the string representation minus
// number of character in memory is equals to
// number of auxiliar characters
function countAuxiliarCharacters(str, ponderation) {
  const match1 = str.match(REGEX_ASCIIHEX);
  const match2 = str.match(REGEX_SLASHQUOTES);

  let count = ponderation[0]; // two double quotes
  count += match1 ? match1.length * ponderation[1] : 0;
  count += match2 ? match2.length * ponderation[2] : 0;

  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
