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

  console.log("Part Two", result);
  // Expected output: 19763
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const tokens = input.split(" "); //strtok
  tokens.shift(); // indicator light

  const joltages = convertToJoltageValues(tokens.pop());

  const len = tokens.length;
  const buttons = [];
  for (const token of tokens) {
    buttons.push(createButton(token, len));
  }

  return { joltages, buttons };
}

function convertToJoltageValues(str) {
  return str
    .substring(1, str.length - 1)
    .split(",")
    .map((n) => parseInt(n));
}

function createButton(str, size) {
  const tokens = str
    .substring(1, str.length - 1)
    .split(",")
    .map((e) => parseInt(e));
  return tokens;
}

function calculateFewestButtonPresses(machine) {
  const cache = cacheCombinations(machine);
  return cfbp_rs(machine.joltages, cache);
}

// calculateFewestButtonPresses_recursiveSearch
function cfbp_rs(joltages, cache) {
  if (joltages.some((e) => e < 0)) return Infinity;
  if (joltages.every((e) => e == 0)) return 0;

  let result = Infinity;

  const pattern = joltagesToPattern(joltages);
  const combinations = cache[pattern];

  if (!combinations) {
    return result;
  }

  for (const combination of combinations) {
    const newJoltages = combination.joltages.map(
      (e, ind) => (joltages[ind] - e) / 2,
    );
    let candidate = combination.presses + 2 * cfbp_rs(newJoltages, cache);
    if (candidate < result) result = candidate;
  }

  return result;
}

function cacheCombinations(machine) {
  const cache = {};

  const len = machine.joltages.length;
  const combinations = allCombinations(machine.buttons);
  combinations.push([]); // empty combination
  for (const combination of combinations) {
    let presses = combination.length;

    const joltages = new Array(len).fill(0);

    for (const button of combination) {
      for (const index of button) {
        joltages[index] += 1;
      }
    }

    const pattern = joltagesToPattern(joltages);

    if (cache[pattern] == undefined) {
      cache[pattern] = [];
    }

    cache[pattern].push({ presses, joltages });
  }

  return cache;
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

function joltagesToPattern(joltages) {
  return joltages.reduce((acc, curr) => acc + (curr % 2).toString(), "");
}

///////////////////////////////////////////////////////////////////////////////

main();
