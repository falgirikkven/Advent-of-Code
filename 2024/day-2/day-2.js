const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const SECURITY_THRESHOLD = 3;

const getReportsArray = (data) => {
  const regex = /(\d+)/g;
  return data
    .split("\n")
    .map((line) => line.match(regex).map((num) => Number(num)));
};

const checkLevelSafety = (level) => {
  const sign = Math.sign(level[1] - level[0]);
  if (sign === 0) return false;

  for (let i = 1; i < level.length; i++) {
    const diff = level[i] - level[i - 1];
    if (
      diff == 0 ||
      Math.sign(diff) != sign ||
      Math.abs(diff) > SECURITY_THRESHOLD
    ) {
      return false;
    }
  }

  return true;
};

const reports = getReportsArray(input);

function partOne() {
  return reports.reduce((acc, curr) => acc + checkLevelSafety(curr), 0);
}

const checkLevelSafetyWithTolerance = (level) => {
  if (checkLevelSafety(level)) return true;

  for (let i = 0; i < level.length; i++) {
    const copiedLevel = [...level];
    copiedLevel.splice(i, 1);
    if (checkLevelSafety(copiedLevel)) return true;
  }

  return false;
};

function partTwo() {
  return reports.reduce(
    (acc, curr) => acc + checkLevelSafetyWithTolerance(curr),
    0
  );
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 490

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 536
