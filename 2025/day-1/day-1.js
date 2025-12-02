const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const startingPoint = 50;
const dialSize = 100;

const processInput = () => {
  const regex = /(L|R)(\d+)/;
  const lines = input.split("\n");
  return lines.map((line) => {
    const match = line.match(regex);
    const sign = match[1] === "L" ? -1 : match[1] === "R" ? 1 : undefined;
    const num = parseInt(match[2]);
    return sign * num;
  });
};

const rotations = processInput();

const solve = () => {
  let currentPoint = startingPoint;
  let zeroPointingCount = 0;
  let zeroMeetCount = 0;
  for (const rotation of rotations) {
    const quotient = Math.floor(Math.abs(rotation / dialSize));
    const rest = rotation % dialSize;
    const flag = currentPoint !== 0;

    zeroMeetCount += quotient;
    currentPoint += rest;

    if (currentPoint === 0 && flag) {
      zeroMeetCount += 1;
    } else if (currentPoint < 0) {
      zeroMeetCount += flag ? 1 : 0;
      currentPoint += dialSize;
    } else if (currentPoint >= dialSize) {
      zeroMeetCount += flag ? 1 : 0;
      currentPoint -= dialSize;
    }

    if (currentPoint === 0) {
      zeroPointingCount += 1;
    }
  }
  return { zeroPointingCount, zeroMeetCount };
};

const { zeroPointingCount, zeroMeetCount } = solve();

function partOne() {
  return zeroPointingCount;
}

function partTwo() {
  return zeroMeetCount;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 1092

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 6616
