const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-12"), "utf8")
  .trim();

const OPERATIONS = {
  cpy: (registers, x, y) => {
    registers[y] = isNaN(x) ? registers[x] : x;
    registers.pc += 1;
  },
  inc: (registers, x, _) => {
    registers[x] += 1;
    registers.pc += 1;
  },
  dec: (registers, x, _) => {
    registers[x] -= 1;
    registers.pc += 1;
  },
  jnz: (registers, x, y) => {
    const val1 = isNaN(x) ? registers[x] : x;
    const val2 = val1 === 0 ? 1 : isNaN(y) ? registers[y] : y;
    registers.pc += val2;
  },
};

function main() {
  const instructions = processInput();

  const result1 = runProgram(instructions);
  const result2 = runProgram(instructions, 1);

  console.log("Part One", result1); // Expected output: 318020
  console.log("Part Two", result2); // Expected output: 9227674
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((line) => {
    const tokens = line.split(" ");
    const obj = {};
    obj.operation = tokens.shift();
    obj.argument1 = isNaN(tokens[0]) ? tokens[0] : parseInt(tokens[0]);
    obj.argument2 = isNaN(tokens[1]) ? tokens[1] : parseInt(tokens[1]);
    return obj;
  });
}

function runProgram(instructions, c = 0) {
  const registers = { a: 0, b: 0, c, d: 0, pc: 0 }; // pc: program counter
  const len = instructions.length;

  while (registers.pc < len) {
    const instruction = instructions[registers.pc];
    const op = instruction.operation;
    const arg1 = instruction.argument1;
    const arg2 = instruction.argument2;
    OPERATIONS[op](registers, arg1, arg2);
  }

  return registers.a;
}

///////////////////////////////////////////////////////////////////////////////

main();
