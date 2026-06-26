const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-23"), "utf8")
  .trim();

const OPERATION_SET = new Map([
  ["hlf", (r) => (registers[r] = Math.floor(registers[r] / 2))],
  ["tpl", (r) => (registers[r] *= 3)],
  ["inc", (r) => (registers[r] += 1)],
  ["jmp", (offset) => (accumulator += offset - 1)],
  [
    "jie",
    (r, offset) => (accumulator += (offset - 1) * ((registers[r] & 1) ^ 1)),
  ],
  ["jio", (r, offset) => (accumulator += (offset - 1) * (registers[r] === 1))],
]);

const registers = { a: 0, b: 0 };
let accumulator = 0;

function main() {
  const instructions = processInput();

  const result1 = runProgram(instructions);
  const result2 = runProgram(instructions, 1);

  console.log("Part One", result1); // Expected output: 170
  console.log("Part Two", result2); // Expected output: 247
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex1 = /(\w+)\s(\w+|(?:[\+\-]\d+))$/;
  const regex2 = /(\w+)\s(\w),\s([\+\-]\d+)/;
  return INPUT.split("\n").map((l) => {
    const obj = {};
    let match = l.match(regex1);
    if (match != null) {
      obj.operation = match[1];
      let arg = parseInt(match[2]);
      if (isNaN(arg)) {
        obj.arguments = [match[2]];
      } else {
        obj.arguments = [arg];
      }
    } else {
      match = l.match(regex2);
      obj.operation = match[1];
      const arg1 = match[2];
      const arg2 = parseInt(match[3]);
      obj.arguments = [arg1, arg2];
    }
    return obj;
  });
}

function runProgram(instructions, initialA = 0) {
  registers.a = initialA;
  registers.b = 0;
  accumulator = 0;

  const len = instructions.length;
  while (accumulator < len) {
    const inst = instructions[accumulator];
    OPERATION_SET.get(inst.operation)(inst.arguments[0], inst.arguments[1]);
    accumulator++;
  }

  return registers.b;
}

///////////////////////////////////////////////////////////////////////////////

main();
