const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-18"), "utf8")
  .trim();

const OPERATIONS_1 = {
  snd: playSound,
  set: registerSet,
  add: registerAdd,
  mul: registerMultiply,
  mod: registerRemainder,
  rcv: recoverValue,
  jgz: jumpIfGreaterThanZero,
};

const OPERATIONS_2 = {
  snd: send,
  set: registerSet,
  add: registerAdd,
  mul: registerMultiply,
  mod: registerRemainder,
  rcv: receive,
  jgz: jumpIfGreaterThanZero,
};

// TODO: poolish this awful code
function main() {
  const { registerSet, instructions } = processInput();

  const result1 = runPart1(registerSet, instructions);
  const result2 = runPart2(registerSet, instructions);

  console.log("Part One", result1); // Expected output: 8600
  console.log("Part Two", result2); // Expected output: 7239
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const registerSet = new Set();

  const instructions = INPUT.split("\n").map((line) => {
    const tokens = line.split(" ");
    const obj = {};

    if (tokens.length == 2) {
      obj.operation = tokens.shift();
      obj.argument1 = tokens[0];
      obj.argument2 = null;
    } else if (tokens.length == 3) {
      obj.operation = tokens.shift();
      obj.argument1 = tokens[0];
      obj.argument2 = isNaN(tokens[1]) ? tokens[1] : parseInt(tokens[1]);
    }

    if (isNaN(obj.argument1)) registerSet.add(obj.argument1);
    return obj;
  });

  return { registerSet, instructions };
}

function runPart1(registerSet, instructions) {
  const len = instructions.length;
  const registers = createProgram(registerSet, 0);
  registers.programCounter = 0;
  registers.recover = null;
  registers.recovered = null;

  while (registers.programCounter < len && registers.recovered == null) {
    const instruction = instructions[registers.programCounter];
    const op = instruction.operation;
    const arg1 = instruction.argument1;
    const arg2 = instruction.argument2;
    OPERATIONS_1[op](registers, arg1, arg2);
  }

  return registers.recovered;
}

function runPart2(registerSet, instructions) {
  const instructionLen = instructions.length;
  const program0 = createProgram(registerSet, 0);
  const program1 = createProgram(registerSet, 1);

  program0.otherProgram = program1;
  program1.otherProgram = program0;

  let running = program0.isRunning || program1.isRunning;
  while (running) {
    if (program0.isRunning) runInstruction(instructions, program0);
    if (program1.isRunning) runInstruction(instructions, program1);
    running = program0.isRunning || program1.isRunning;
  }

  return program1.messageSent;
}

function createProgram(registerSet, pid) {
  const program = {};
  for (const register of registerSet) {
    program[register] = 0;
  }
  program.p = pid;
  program.otherProgram = null;
  program.programCounter = 0;
  program.messageSent = 0;
  program.messageQueue = [];
  program.isRunning = true;
  return program;
}

function runInstruction(instructions, registers) {
  const instruction = instructions[registers.programCounter];
  const op = instruction.operation;
  const arg1 = instruction.argument1;
  const arg2 = instruction.argument2;
  OPERATIONS_2[op](registers, arg1, arg2);
}

function getValue(registers, x) {
  return isNaN(x) ? registers[x] : x;
}

///////////////////////////////////////////////////////////////////////////////

function registerSet(registers, x, y) {
  registers[x] = getValue(registers, y);
  registers.programCounter += 1;
}

function registerAdd(registers, x, y) {
  registers[x] += getValue(registers, y);
  registers.programCounter += 1;
}

function registerMultiply(registers, x, y) {
  registers[x] *= getValue(registers, y);
  registers.programCounter += 1;
}

function registerRemainder(registers, x, y) {
  registers[x] %= getValue(registers, y);
  registers.programCounter += 1;
}

function jumpIfGreaterThanZero(registers, x, y) {
  const jump = getValue(registers, x) > 0 ? getValue(registers, y) : 1;
  registers.programCounter += jump;
}

function playSound(registers, x) {
  registers.recover = getValue(registers, x);
  registers.programCounter += 1;
}

function recoverValue(registers, x) {
  if (getValue(x) != 0) {
    registers.recovered = registers.recover;
  }
  registers.programCounter += 1;
}

function send(registers, x) {
  const value = getValue(registers, x);

  const programB = registers.otherProgram;
  programB.messageQueue.push(value);
  programB.isRunning = true;

  registers.messageSent += 1;
  registers.programCounter += 1;
}

function receive(registers, x) {
  if (registers.messageQueue.length == 0) {
    registers.isRunning = false;
    return;
  }

  const value = registers.messageQueue.shift();
  registers[x] = value;
  registers.programCounter += 1;
}

///////////////////////////////////////////////////////////////////////////////

main();
