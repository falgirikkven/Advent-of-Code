const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-2"), "utf8")
  .trim();

const DELTAS = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

const KEYPAD_1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const KEYPAD_2 = [
  [, , 1, ,],
  [, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [, "A", "B", "C"],
  [, , "D", ,],
];

const STARTING_INDEXES_1 = [1, 1]; // 5
const STARTING_INDEXES_2 = [2, 0]; // 5

function main() {
  const instructions = processInput();

  const result1 = getBathroomCode(instructions, KEYPAD_1, STARTING_INDEXES_1);
  const result2 = getBathroomCode(instructions, KEYPAD_2, STARTING_INDEXES_2);

  console.log("Part One", result1); // Expected output: 73597
  console.log("Part Two", result2); // Expected output: A47DA
}

function getBathroomCode(instructions, keypad, startingIndexes) {
  const pressed = [];
  const indexes = [...startingIndexes];
  const rlen = keypad.length;
  const clen = keypad[0].length;

  for (const line of instructions) {
    for (const instruction of line) {
      const deltas = DELTAS[instruction];
      const nr = indexes[0] + deltas[0];
      const nc = indexes[1] + deltas[1];
      if (nr < 0 || nr >= rlen || nc < 0 || nc >= clen) continue;
      if (keypad[nr] == null || keypad[nr][nc] == null) continue;
      indexes[0] = nr;
      indexes[1] = nc;
    }
    pressed.push(keypad[indexes[0]][indexes[1]]);
  }

  return pressed.join("");
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").map((l) => l.split(""));
}

///////////////////////////////////////////////////////////////////////////////

main();
