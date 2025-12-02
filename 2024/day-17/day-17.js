const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const parseData = (data) => {
  const regex = /(\d+)/g;
  const splitedData = data.split("\n");
  const registers = {};
  registers.A = Number(splitedData[0].match(regex)[0]);
  registers.B = Number(splitedData[1].match(regex)[0]);
  registers.C = Number(splitedData[2].match(regex)[0]);
  const program = splitedData[4].match(regex).map((e) => Number(e));
  const output = [];
  return { registers, program, output };
};

const { registers, program, output } = parseData(input);
let instruction = 0;

const operations = new Map([
  [0, (o) => Math.floor(registers.A / Math.pow(2, combo(o)))],
  [1, (o) => registers.B ^ o],
  [2, (o) => combo(o) % 8],
  [3, (o) => (registers.A == 0 ? -1 : o)],
  [4, (_) => registers.B ^ registers.C],
  [5, (o) => combo(o) % 8],
  [6, (o) => Math.floor(registers.A / Math.pow(2, combo(o)))],
  [7, (o) => Math.floor(registers.A / Math.pow(2, combo(o)))],
]);

function combo(literal) {
  if (literal == 4) return registers.A;
  else if (literal == 5) return registers.B;
  else if (literal == 6) return registers.C;
  return literal;
}

const saveRegister = (opcode, res) => {
  if (opcode === 0) registers.A = res;
  else if (opcode === 1) registers.B = res;
  else if (opcode === 2) registers.B = res;
  // opcode === 3 alter instruction pointer
  else if (opcode === 4) registers.B = res;
  else if (opcode === 5) output.push(res);
  else if (opcode === 6) registers.B = res;
  else if (opcode === 7) registers.C = res;
};

function partOne() {
  output.length = 0;
  instruction = 0;
  let haltValue = program.length;
  while (instruction < haltValue) {
    let opcode = program[instruction];
    let operand = program[instruction + 1];
    const restult = operations.get(opcode)(operand);

    saveRegister(opcode, restult);

    if (opcode == 3 && restult != -1) instruction = restult;
    else instruction += 2;
  }

  return output;
}

// This function is deduced after analyzing the input of my puzzle
const magic_number = 8;
function magic_function(a) {
  let A = a;
  let B = BigInt(0);
  let C = BigInt(0);

  B = A % BigInt(8) ^ BigInt(3);
  C = A >> B;
  A = A / BigInt(8);
  B = B ^ C ^ BigInt(5);
  const o = B % BigInt(8);

  return o;
}

function dfs(regA, digit, founds) {
  if (magic_function(regA) !== BigInt(program[program.length - digit])) return;
  const newA = regA * BigInt(magic_number);

  if (digit === program.length) {
    founds.push(regA);
    return;
  }

  for (let i = 0; i < magic_number; i++) {
    dfs(newA + BigInt(i), digit + 1, founds);
  }
}

function partTwo() {
  const founds = [];
  for (let i = 0; i < magic_number; i++) {
    dfs(BigInt(i), 1, founds);
  }
  return founds.sort()[0];
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 1,5,0,5,2,0,1,3,5

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 236581108670061
