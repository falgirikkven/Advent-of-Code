const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-23"), "utf8")
  .trim();

const EGGS_1 = 7;
const EGGS_2 = 12;

function main() {
  const instructions = processInput();

  const result1 = runProgram(instructions, EGGS_1);
  const result2 = part2(EGGS_2);

  console.log("Part One", result1); // Expected output: 12703
  console.log("Part Two", result2); // Expected output: 479009263
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

function runProgram(instructions, eggs) {
  const operations = {
    cpy: copyRegister,
    inc: increaseRegister,
    dec: decreaseRegister,
    jnz: jumpIfNotZero,
    tgl: toggleOperation,
  };

  const LIM = 16617171;
  let wd = 0;
  const registers = { a: eggs, b: 0, c: 0, d: 0, pc: 0 }; // pc: program counter

  const len = instructions.length;
  const toggled = new Array(len).fill(0);
  registers.toggled = toggled;

  while (registers.pc < len && wd++ < LIM) {
    const instruction = instructions[registers.pc];
    const op = toggleIfMust(instruction.operation, registers);
    const arg1 = instruction.argument1;
    const arg2 = instruction.argument2;
    operations[op](registers, arg1, arg2);
  }

  return registers.a;
}

function toggleIfMust(operation, registers) {
  if (registers.toggled[registers.pc] === 0) return operation;

  const toggles = {
    inc: "dec",
    dec: "inc",
    tgl: "inc",
    jnz: "cpy",
    cpy: "jnz",
  };
  return toggles[operation];
}

function getValue(registers, x) {
  return isNaN(x) ? registers[x] : x;
}

// This has function was made after a careful inspection of my input
function part2(a) {
  if (a !== 12) return undefined; // Only for a=12
  let b = a - 2;
  let c = 97;
  let d = 79;
  a = a * (a - 1) * factorial(b);
  a += c * d;
  return a;

  /*
  // This is for all positive a until the first 'tgl'
  if (a < 3) return undefined; // Infinite loop
  let b = a - 2;
  let c = 2 * b;
  let d = 0;
  a = a * (a - 1);
  */
}

function factorial(num) {
  if (num === 0) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}

///////////////////////////////////////////////////////////////////////////////

function copyRegister(registers, x, y) {
  registers[y] = getValue(registers, x);
  registers.pc += 1;
}

function increaseRegister(registers, x, _) {
  registers[x] += 1;
  registers.pc += 1;
}

function decreaseRegister(registers, x, _) {
  registers[x] -= 1;
  registers.pc += 1;
}

function jumpIfNotZero(registers, x, y) {
  const jump = getValue(registers, x) === 0 ? 1 : getValue(registers, y);
  registers.pc += jump;
}

function toggleOperation(registers, x, _) {
  const key = registers.pc + getValue(registers, x);
  if (key >= 0 && key < registers.toggled.length) {
    registers.toggled[key] ^= 1;
  }
  registers.pc += 1;
}

///////////////////////////////////////////////////////////////////////////////

main();
