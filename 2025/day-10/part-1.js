const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const CHAR_OFF = ".";
const CHAR_ON = "#";

function main() {
  let result = 0;

  const lines = INPUT.split("\n");
  for (const line of lines) {
    const machine = processInput(line);

    result += calculateFewestButtonPresses(machine);
  }

  console.log("Part One", result);
  // Expected output: 500
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const tokens = input.split(" "); //strtok
  tokens.pop(); //joltage

  const indicatorLight = convertToLightValue(tokens.shift());

  const len = tokens.length;
  const buttons = [];
  for (const token of tokens) {
    buttons.push(createButtonValue(token, len));
  }

  return { indicatorLight, buttons };
}

function convertToLightValue(str) {
  return str
    .substring(1, str.length - 1)
    .split("")
    .reduce((acc, curr, ind) => {
      if (curr == CHAR_ON) return acc + 2 ** ind;
      if (curr == CHAR_OFF) return acc;
      throw "convertToLight error: unexpected token";
      return acc;
    }, 0);
}

function createButtonValue(str, size) {
  const tokens = str.substring(1, str.length - 1).split(",");
  const res = tokens.reduce((acc, curr) => acc + 2 ** parseInt(curr), 0);
  return res;
}

function calculateFewestButtonPresses(machine) {
  const indicator = machine.indicatorLight;
  const combnations = allCombinations(machine.buttons);
  for (const combination of combnations) {
    let result = combination.reduce((acc, curr) => acc ^ curr, 0);
    if (result === indicator) {
      return combination.length;
    }
  }

  return -1;
}

function allCombinations(collection) {
  const result = [];
  const len = collection.length;
  if (len < 1) return result;

  const queue = collection.map((e, ind) => [[e], ind]);
  while (queue.length) {
    const top = queue.shift();
    const topArr = top[0];
    const lastIndex = top[1];

    for (let i = lastIndex + 1; i < len; i++) {
      const newArr = topArr.slice();
      newArr.push(collection[i]);
      queue.push([newArr, i]);
    }

    result.push(topArr);
  }
  return result;
}

///////////////////////////////////////////////////////////////////////////////

main();
