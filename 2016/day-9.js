const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-9"), "utf8")
  .trim();

const REGEX1 = /^(\w+)(?=\(|$)/;
const REGEX2 = /\((\d+)x(\d+)\)/;

function main() {
  const uncompressedFile = INPUT;

  const result1 = countLength(uncompressedFile);
  const result2 = countLength(uncompressedFile, true);

  console.log("Part One", result1); // Expected output: 152851
  console.log("Part Two", result2); // Expected output: 11797310782
}

///////////////////////////////////////////////////////////////////////////////

function countLength(uncompressedFile, deepCount = false) {
  let count = 0;
  let match = uncompressedFile.match(REGEX1);
  if (match != null) {
    const matchLen = match[0].length;
    count += matchLen;
    uncompressedFile = uncompressedFile.slice(matchLen);
  }

  while ((match = uncompressedFile.match(REGEX2)) != null) {
    const matchLen = match[0].length;
    const catchLen = parseInt(match[1]);
    const times = parseInt(match[2]);

    let delta;
    if (deepCount) {
      const subStr = uncompressedFile.slice(matchLen, matchLen + catchLen);
      delta = countLength(subStr, true);
    } else {
      delta = catchLen;
    }

    count += delta * times;
    uncompressedFile = uncompressedFile.slice(matchLen + catchLen);

    match = uncompressedFile.match(REGEX1);
    if (match != null) {
      const matchLen2 = match[0].length;
      count += matchLen2;
      uncompressedFile = uncompressedFile.slice(matchLen2);
    }
  }

  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
