const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-21"), "utf8")
  .trim();

const CODE_1 = "abcdefgh";
const CODE_2 = "fbgdceah";

function main() {
  const instructions = processInput();

  const result1 = scramble(CODE_1, instructions);
  const result2 = unscramble(CODE_2, instructions);

  console.log("Part One", result1); // Expected output: dbfgaehc
  console.log("Part Two", result2); // Expected output: aghfcdeb
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex2pos = /(swap|reverse|move).+\s(\d+).+\s(\d+)/;
  const regexSwapL = /swap\sletter\s(\w).+letter\s(\w)/;
  const regexRotateLR = /rotate\s(left|right)\s(\d+)\sstep/;
  const regexRotateBased = /rotate.+letter\s(\w)/;

  return INPUT.split("\n").map((line) => {
    const obj = {};
    let match;

    if ((match = line.match(regex2pos))) {
      obj.op = match[1] + "2pos";
      obj.arg1 = parseInt(match[2]);
      obj.arg2 = parseInt(match[3]);
    } else if ((match = line.match(regexSwapL))) {
      obj.op = "swap2char";
      obj.arg1 = match[1];
      obj.arg2 = match[2];
    } else if ((match = line.match(regexRotateLR))) {
      obj.op = "rotateLR";
      const sign = match[1] == "right" ? 1 : -1;
      obj.arg1 = sign * parseInt(match[2]);
    } else if ((match = line.match(regexRotateBased))) {
      obj.op = "rotateBased";
      obj.arg1 = match[1];
    }

    return obj;
  });
}

function scramble(str, instructions) {
  const operations = {
    swap2pos: swapPositions,
    swap2char: swapLetters,
    rotateLR: rotatePositions,
    rotateBased: rotatePositionBased,
    reverse2pos: reverseThroughPositions,
    move2pos: movePositions,
  };
  return operate(str, instructions, operations);
}

function unscramble(str, instructions) {
  const operations = {
    swap2pos: unSwapPositions,
    swap2char: unSwapLetters,
    rotateLR: unRotatePositions,
    rotateBased: unRotatePositionBased,
    reverse2pos: unReverseThroughPositions,
    move2pos: unMovePositions,
  };
  return operate(str, instructions, operations);
}

function operate(str, instructions, operations) {
  const array = str.split("");
  for (const instruction of instructions) {
    const operation = operations[instruction.op];
    const argument1 = instruction.arg1;
    const argument2 = instruction.arg2;
    operation(array, argument1, argument2);
  }

  instructions.reverse();
  return array.join("");
}

///////////////////////////////////////////////////////////////////////////////

function swapPositions(arr, index1, index2) {
  let swap = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = swap;
}

function swapLetters(arr, char1, char2) {
  const indexes1 = arr.reduce((acc, curr, ind) => {
    if (curr == char1) acc.push(ind);
    return acc;
  }, []);
  const indexes2 = arr.reduce((acc, curr, ind) => {
    if (curr == char2) acc.push(ind);
    return acc;
  }, []);
  for (const index of indexes1) {
    arr[index] = char2;
  }
  for (const index of indexes2) {
    arr[index] = char1;
  }
}

function rotatePositions(arr, amount, _) {
  const len = arr.length;
  const delta = amount < 0 ? Math.floor(len / -amount) * len : 0;
  const cache = new Array(len);
  for (let i = 0; i < len; i++) {
    const cursor = (i + amount + delta) % len;
    cache[cursor] = arr[i];
  }
  for (let i = 0; i < len; i++) {
    arr[i] = cache[i];
  }
}

function rotatePositionBased(arr, char, _) {
  const index = arr.indexOf(char);
  let amount = index + (index >= 4 ? 2 : 1);
  rotatePositions(arr, amount);
}

function reverseThroughPositions(arr, index1, index2) {
  const spliced = arr.splice(index1, index2 - index1 + 1);
  spliced.reverse();
  arr.splice(index1, 0, ...spliced);
}

function movePositions(arr, index1, index2) {
  const element = arr.splice(index1, 1);
  arr.splice(index2, 0, ...element);
}

function unSwapPositions(arr, index1, index2) {
  swapPositions(arr, index2, index1);
}

function unSwapLetters(arr, index1, index2) {
  swapLetters(arr, index2, index1);
}

function unRotatePositions(arr, amount, _) {
  rotatePositions(arr, -amount, _);
}

function unRotatePositionBased(arr, char, _) {
  const deltas = [-1, -1, 2, -2, 1, 5, 0, -4];
  const index = arr.indexOf(char);
  rotatePositions(arr, deltas[index]);
}

function unReverseThroughPositions(arr, index1, index2) {
  const spliced = arr.splice(index1, index2 - index1 + 1);
  spliced.reverse();
  arr.splice(index1, 0, ...spliced);
}

function unMovePositions(arr, index1, index2) {
  movePositions(arr, index2, index1);
}

///////////////////////////////////////////////////////////////////////////////

main();
