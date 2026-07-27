const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-8"), "utf8")
  .trim();

const ROW_COUNT = 6;
const COL_COUNT = 50;

const CHAR_OFF = ".";
const CHAR_ON = "#";

const OPERATIONS = {
  rect: (grid, width, height) => {
    for (let c = 0; c < width; c++) {
      for (let r = 0; r < height; r++) {
        grid[r][c] = CHAR_ON;
      }
    }
  },
  rotate_row: (grid, row, shift) => {
    const pool = new Array(COL_COUNT);
    for (let i = 0; i < COL_COUNT; i++) {
      const cursor = (i + shift) % COL_COUNT;
      pool[cursor] = grid[row][i];
    }
    for (let i = 0; i < COL_COUNT; i++) {
      grid[row][i] = pool[i];
    }
  },
  rotate_col: (grid, col, shift) => {
    const pool = new Array(ROW_COUNT);
    for (let i = 0; i < ROW_COUNT; i++) {
      const cursor = (i + shift) % ROW_COUNT;
      pool[cursor] = grid[i][col];
    }
    for (let i = 0; i < ROW_COUNT; i++) {
      grid[i][col] = pool[i];
    }
  },
};

function main() {
  const instructions = processInput();

  const grid = litPixels(instructions);

  const result1 = countLit(grid);
  const result2 = display(grid);

  console.log("Part One", result1); // Expected output: 115
  console.log("Part Two", result2); // Expected output: EFEYKFRFIJ
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex1 = /(rect)\s(\d+)x(\d+)/;
  const regex2 = /(rotate)\s(row|column)\s+[xy]=(\d+)\sby\s(\d+)/;
  return INPUT.split("\n").map((l) => {
    let match;
    if ((match = l.match(regex1))) {
      const obj = { args: [] };
      obj.function = match[1];
      obj.args.push(parseInt(match[2]));
      obj.args.push(parseInt(match[3]));
      return obj;
    }
    if ((match = l.match(regex2))) {
      const obj = { args: [] };
      if (match[2] == "row") {
        obj.function = match[1] + "_row";
      } else if (match[2] == "column") {
        obj.function = match[1] + "_col";
      }
      obj.args.push(parseInt(match[3]));
      obj.args.push(parseInt(match[4]));
      return obj;
    }
    return undefined;
  });
}

function litPixels(instructions) {
  const grid = new Array(ROW_COUNT)
    .fill(0)
    .map((l) => new Array(COL_COUNT).fill(CHAR_OFF));
  for (const instruction of instructions) {
    OPERATIONS[instruction.function](grid, ...instruction.args);
  }
  return grid;
}

function countLit(grid) {
  let count = 0;
  for (const row of grid) {
    for (const e of row) {
      if (e == CHAR_ON) count += 1;
      else if (e != CHAR_OFF) throw `2016-D8-countLit: unexpected character`;
    }
  }

  return count;
}

function display(grid) {
  let str = "\n";
  for (const row of grid) {
    str += row.join("") + "\n";
  }
  return str;
}

///////////////////////////////////////////////////////////////////////////////

main();
