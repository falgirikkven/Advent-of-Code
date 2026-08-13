const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-10"), "utf8")
  .trim();

function main() {
  const inputs = processInput();

  const result1 = knotHash(inputs.part1);
  const result2 = knotHash(inputs.part2, 64);

  console.log("Part One", result1); // Expected output: 4480
  console.log("Part Two", result2); // Expected output: c500ffe015c83b60fad2e4b7d59dabc4
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const salt = [17, 31, 73, 47, 23];
  const part1 = INPUT.split(",").map((e) => parseInt(e));
  const part2 = INPUT.split("").map((e) => e.charCodeAt(0));
  part2.push(...salt);
  return { part1, part2 };
}

function knotHash(lengthArray, rounds = 1) {
  const array = Array.from(Array(256).keys());
  let position = 0;
  let skipSize = 0;

  for (let j = 0; j < rounds; j++) {
    for (let i = 0; i < lengthArray.length; i++) {
      const value = lengthArray[i];

      reverseSegment(array, position, value);

      position = (position + value + skipSize) % 256;
      skipSize += 1;
    }
  }

  if (rounds == 1) return array[0] * array[1]; // part 1

  return getDenseHash(array).reduce((acc, curr) => acc + toHex(curr), "");
}

function reverseSegment(array, start, amount) {
  const swapArray = [];
  const len = array.length;

  for (let i = 0, cursor = start; i < amount; i++) {
    swapArray[i] = [cursor, array[cursor]];
    cursor = (cursor + 1) % len;
  }

  for (let i = 0; i < amount; i++) {
    const sourceData = swapArray[amount - i - 1][1];
    const targetIndex = swapArray[i][0];
    array[targetIndex] = sourceData;
  }
}

function getDenseHash(sparseHash) {
  const denseHash = [];

  for (let i = 0; i < 16; i++) {
    const initialPos = 16 * i;
    let value = 0;
    for (let j = 0; j < 16; j++) {
      value ^= sparseHash[initialPos + j];
    }
    denseHash.push(value);
  }

  return denseHash;
}

function toHex(byte) {
  let str = "";
  if (byte < 16) str += "0";
  return str + byte.toString(16);
}

///////////////////////////////////////////////////////////////////////////////

main();
