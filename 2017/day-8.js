const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-8"), "utf8")
  .trim();

function main() {
  const data = processInput();

  const results = runInstructions(data);

  const result1 = results.highestValueFinal;
  const result2 = results.highestValueSeen;

  console.log("Part One", result1); // Expected output: 4647
  console.log("Part Two", result2); // Expected output: 5590
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const str1 = "(?<register>\\w+)\\s(?<operation>inc|dec)\\s(?<amount>-?\\d+)";
  const str2 =
    "(?<register>\\w+)\\s(?<operation>>|<|>=|<=|==|!=)\\s(?<amount>-?\\d+)";

  const regexAction = new RegExp(str1);
  const regexCondition = new RegExp(str2);

  const registers = new Set();
  const instructions = [];

  INPUT.split("\n").forEach((line) => {
    const tokens = line.split("if");

    const matchAction = tokens.shift().match(regexAction);
    const matchCondition = tokens.shift().match(regexCondition);

    const action = {};
    action.register = matchAction.groups.register;
    //action.operation = matchAction.groups.operation;
    //action.amount = parseInt(matchAction.groups.amount);
    const sign = matchAction.groups.operation == "inc" ? 1 : -1;
    action.amount = parseInt(matchAction.groups.amount) * sign;

    const condition = {};
    condition.register = matchCondition.groups.register;
    condition.operation = matchCondition.groups.operation;
    condition.amount = parseInt(matchCondition.groups.amount);

    instructions.push({ action, condition });
    registers.add(action.register);
    registers.add(condition.register);
  });

  return { instructions, registers };
}
function runInstructions(data) {
  const conditionals = {
    ">": (registers, key, amount) => registers[key] > amount,
    "<": (registers, key, amount) => registers[key] < amount,
    ">=": (registers, key, amount) => registers[key] >= amount,
    "<=": (registers, key, amount) => registers[key] <= amount,
    "==": (registers, key, amount) => registers[key] == amount,
    "!=": (registers, key, amount) => registers[key] != amount,
  };

  const registers = {};
  data.registers.forEach((key) => {
    registers[key] = 0;
  });

  let highestValueSeen = 0;
  for (const instruction of data.instructions) {
    const condition = instruction.condition;
    const cKey = condition.register;
    const cAmount = condition.amount;
    const conditional = conditionals[condition.operation];
    if (conditional(registers, cKey, cAmount)) {
      const action = instruction.action;
      const value = registers[action.register] + action.amount;
      registers[action.register] = value;
      highestValueSeen = highestValueSeen > value ? highestValueSeen : value;
    }
  }

  let highestValueFinal = -Infinity;
  for (const [key, value] of Object.entries(registers)) {
    highestValueFinal = highestValueFinal > value ? highestValueFinal : value;
  }

  return { highestValueFinal, highestValueSeen };
}

///////////////////////////////////////////////////////////////////////////////

main();
