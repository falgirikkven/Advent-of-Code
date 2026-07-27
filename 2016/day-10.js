const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-10"), "utf8")
  .trim();

const VALUE_TO_SEEK_1 = 61;
const VALUE_TO_SEEK_2 = 17;

const LOWER = Math.min(VALUE_TO_SEEK_1, VALUE_TO_SEEK_2);
const HIGHER = Math.max(VALUE_TO_SEEK_1, VALUE_TO_SEEK_2);

const assignments = {};
const transactions = {};
const entities = new Set();

function main() {
  processInput();

  const { entitiesValues, botName } = runRobots();

  const result1 = getBotNumber(botName);
  const result2 = multiplyFirstThreeOutputs(entitiesValues);

  console.log("Part One", result1); // Expected output: 161
  console.log("Part Two", result2); // Expected output: 133163
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const bot =
    "bot\\s(?<botID>\\d+)" +
    ".+to\\s(?<lowerEntity>bot|output)\\s(?<lowerID>\\d+)" +
    ".+to\\s(?<higherEntity>bot|output)\\s(?<higherID>\\d+)";
  const regexValue = /value\s(?<value>\d+).+bot\s(?<botID>\d+)/;
  const regexBot = new RegExp(bot);

  INPUT.split("\n").forEach((e) => {
    let match;
    if ((match = e.match(regexValue))) {
      const key = "bot" + match.groups.botID;
      const value = parseInt(match.groups.value);
      if (assignments[key] == null) assignments[key] = [];
      assignments[key].push(value);
    } else if ((match = e.match(regexBot))) {
      const key = "bot" + match.groups.botID;
      const lower = match.groups.lowerEntity + match.groups.lowerID;
      const higher = match.groups.higherEntity + match.groups.higherID;
      transactions[key] = { lower, higher };
      entities.add(key);
      entities.add(lower);
      entities.add(higher);
    }
  });
}

function runRobots() {
  const entitiesValues = {};
  entities.forEach((key) => {
    entitiesValues[key] = [];
  });
  let botName = "";

  let queue1 = [];
  let queue2 = [];

  for (const [key, arr] of Object.entries(assignments)) {
    entitiesValues[key].push(...arr);
    if (entitiesValues[key].length == 2) queue1.push(key);
  }

  while (queue1.length > 0) {
    const top = queue1.pop();
    const transaction = transactions[top];
    const stack = entitiesValues[top];
    const lower = entitiesValues[transaction.lower];
    const higher = entitiesValues[transaction.higher];
    const min = Math.min(...stack);
    const max = Math.max(...stack);
    lower.push(min);
    higher.push(max);
    stack.length = 0;

    if (min == LOWER && max == HIGHER) botName = top;

    if (lower.length == 2) queue2.push(transaction.lower);
    if (higher.length == 2) queue2.push(transaction.higher);

    if (queue1.length == 0) {
      let swap = queue1;
      queue1 = queue2;
      queue2 = swap;
    }
  }

  return { entitiesValues, botName };
}

///////////////////////////////////////////////////////////////////////////////

function getBotNumber(str) {
  return parseInt(str.match(/(\d+)/)[1]);
}

function multiplyFirstThreeOutputs(values) {
  const val0 = values.output0;
  const val1 = values.output1;
  const val2 = values.output2;
  return val0 * val1 * val2;
}

main();
