const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-6"), "utf8")
  .trim();

const GRID_SIZE = 1000;

const OPERATION_ON = 1;
const OPERATION_OFF = 2;
const OPERATION_TOOGLE = 3;

const OPERATION_MAP_1 = new Map();
const OPERATION_MAP_2 = new Map();

const GRID_1 = [];
const GRID_2 = [];

function main() {
  const instructions = processInput();

  initializeOperationsMaps();

  initializeGrids();

  followInstructions(instructions, OPERATION_MAP_1, GRID_1);
  followInstructions(instructions, OPERATION_MAP_2, GRID_2);

  const result1 = sumGrid(GRID_1);
  const result2 = sumGrid(GRID_2);

  console.log("Part One", result1); // Expected output: 400410
  console.log("Part Two", result2); // Expected output: 15343601
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/;
  return INPUT.split("\n").map((line) => {
    const instruction = {};
    const match = line.match(regex);
    instruction.operation = getOperation(match[1]);
    instruction.row_i = parseInt(match[2]);
    instruction.col_i = parseInt(match[3]);
    instruction.row_f = parseInt(match[4]);
    instruction.col_f = parseInt(match[5]);

    return instruction;
  });
}

function getOperation(str) {
  let operation = -1;
  switch (str) {
    case "turn on": {
      operation = OPERATION_ON;
      break;
    }
    case "turn off": {
      operation = OPERATION_OFF;
      break;
    }
    case "toggle": {
      operation = OPERATION_TOOGLE;
      break;
    }
    default:
      throw "getOperation: invalid operation";
  }
  return operation;
}

function initializeOperationsMaps() {
  const operationArray1 = [
    {
      key: OPERATION_ON,
      value: function (_) {
        return 1;
      },
    },
    {
      key: OPERATION_OFF,
      value: function (_) {
        return 0;
      },
    },
    {
      key: OPERATION_TOOGLE,
      value: function (value) {
        return value == 0 ? 1 : 0;
      },
    },
  ];

  const operationArray2 = [
    {
      key: OPERATION_ON,
      value: function (value) {
        return value + 1;
      },
    },
    {
      key: OPERATION_OFF,
      value: function (value) {
        return value > 0 ? value - 1 : 0;
      },
    },
    {
      key: OPERATION_TOOGLE,
      value: function (value) {
        return value + 2;
      },
    },
  ];

  for (const operation of operationArray1) {
    OPERATION_MAP_1.set(operation.key, operation.value);
  }
  for (const operation of operationArray2) {
    OPERATION_MAP_2.set(operation.key, operation.value);
  }
}

function initializeGrids() {
  for (let i = 0; i < GRID_SIZE; i++) {
    const arr1 = new Array(GRID_SIZE).fill(0);
    const arr2 = new Array(GRID_SIZE).fill(0);
    GRID_1.push(arr1);
    GRID_2.push(arr2);
  }
}

function followInstructions(instructions, operationMap, grid) {
  for (const instruction of instructions) {
    const op = operationMap.get(instruction.operation);
    for (let row = instruction.row_i; row <= instruction.row_f; row++) {
      for (let col = instruction.col_i; col <= instruction.col_f; col++) {
        grid[row][col] = op(grid[row][col]);
      }
    }
  }
}

function sumGrid(grid) {
  let sum = 0;
  for (const row of grid) {
    for (const col of row) {
      sum += col;
    }
  }
  return sum;
}

///////////////////////////////////////////////////////////////////////////////

main();
