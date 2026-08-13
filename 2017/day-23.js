const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-23"), "utf8")
  .trim();

const OPERATIONS = {
  set: registerSet,
  sub: registerSubtract,
  mul: registerMultiply,
  jnz: jumpIfNotZero,
};

function main() {
  const instructions = processInput();

  const result1 = runProgram(instructions);
  const result2 = part2();

  console.log("Part One", result1); // Expected output: 4225
  console.log("Part Two", result2); // Expected output: 905
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((line) => {
    const tokens = line.split(" ");
    const obj = {};

    obj.operation = tokens[0];
    obj.argument1 = isNaN(tokens[1]) ? tokens[1] : parseInt(tokens[1]);
    obj.argument2 = isNaN(tokens[2]) ? tokens[2] : parseInt(tokens[2]);

    return obj;
  });
}

function runProgram(instructions) {
  const len = instructions.length;
  const registers = createRegisters();

  while (registers.programCounter < len) {
    const instruction = instructions[registers.programCounter];
    const op = instruction.operation;
    const arg1 = instruction.argument1;
    const arg2 = instruction.argument2;
    OPERATIONS[op](registers, arg1, arg2);
  }

  return registers.mulInvoked;
}

function createRegisters() {
  const registers = {};
  for (let i = 0; i < 8; i++) {
    const key = String.fromCharCode(97 + i);
    registers[key] = 0;
  }
  registers.programCounter = 0;
  registers.mulInvoked = 0;
  return registers;
}

// This has function was made after a careful inspection of my input
function part2() {
  let b = 106700;
  let h = 0;

  for (let i = 0; i <= 1000; i++, b += 17) {
    const ip = isPrime(b);
    if (!ip) h += 1;
  }

  return h;
}

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

function getValue(registers, x) {
  return isNaN(x) ? registers[x] : x;
}

///////////////////////////////////////////////////////////////////////////////

function registerSet(registers, x, y) {
  registers[x] = getValue(registers, y);
  registers.programCounter += 1;
}

function registerSubtract(registers, x, y) {
  registers[x] -= getValue(registers, y);
  registers.programCounter += 1;
}

function registerMultiply(registers, x, y) {
  registers.mulInvoked += 1;
  registers[x] *= getValue(registers, y);
  registers.programCounter += 1;
}

function jumpIfNotZero(registers, x, y) {
  const jump = getValue(registers, x) !== 0 ? getValue(registers, y) : 1;
  registers.programCounter += jump;
}

///////////////////////////////////////////////////////////////////////////////

main();
