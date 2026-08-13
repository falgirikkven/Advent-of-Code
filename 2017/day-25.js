const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-25"), "utf8")
  .trim();

const RIGHT = 1;
const LEFT = -1;

function main() {
  const turingMachine = processInput();

  const result1 = diagnoseCheckSum(turingMachine);

  console.log("Part One", result1); // Expected output: 4225
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const paragraphs = INPUT.split("\n\n");
  const { initialState, stepsToDo } = getProblemLimits(paragraphs.shift());

  const regexStateKey = /In\sstate\s(\w)\:/s;
  const regexRule =
    /If.+?is\s(0|1):.+?value\s(0|1).+?\s(right|left).+?state\s([A-Z]{1})./gs;

  const states = paragraphs.reduce((accumulator, current) => {
    const key = current.match(regexStateKey)[1];
    const value = {};
    const matches = current.matchAll(regexRule);
    for (const match of matches) {
      const subKey = match[1];
      const subValue = {};
      subValue.write = match[2];
      subValue.move = match[3] == "right" ? RIGHT : LEFT;
      subValue.nextState = match[4];
      value[subKey] = subValue;
    }

    accumulator[key] = value;
    return accumulator;
  }, {});

  return { states, initialState, stepsToDo };
}

// I have no better name for this function
function getProblemLimits(paragraphStr) {
  const regexLimits = /.+?state\s(\w).+?\s(\d+)\ssteps./s;
  const match = paragraphStr.match(regexLimits);

  const initialState = match[1];
  const stepsToDo = parseInt(match[2]);

  return { initialState, stepsToDo };
}

function diagnoseCheckSum(turingMachine) {
  const tape = solve(turingMachine);

  return Object.entries(tape).reduce((acc, [key, value]) => {
    return acc + parseInt(value);
  }, 0);
}

function solve(turingMachine) {
  const states = turingMachine.states;
  const tape = {};
  let stateKey = turingMachine.initialState;
  let cursor = 0;

  for (let i = 0; i < turingMachine.stepsToDo; i++) {
    if (tape[cursor] == null) tape[cursor] = "0";
    const tapeValue = tape[cursor];
    const rule = states[stateKey][tapeValue];
    tape[cursor] = rule.write;
    cursor += rule.move;
    stateKey = rule.nextState;
  }

  return tape;
}

///////////////////////////////////////////////////////////////////////////////

main();
