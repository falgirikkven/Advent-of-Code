const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-16"), "utf8")
  .trim();

function main() {
  const movesSequence = processInput();

  const result1 = part1(movesSequence);
  const result2 = part2(movesSequence);

  console.log("Part One", result1); // Expected output: eojfmbpkldghncia
  console.log("Part Two", result2); // Expected output: iecopnahgdflmkjb
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regexSpin = /s(\d+)/;
  const regexExch = /x(\d+)\/(\d+)/;
  const regexPart = /p(\w)\/(\w)/;

  return INPUT.split(",").map((token) => {
    const obj = {};
    let match;
    if ((match = token.match(regexSpin))) {
      obj.op = "spin";
      obj.arg1 = parseInt(match[1]);
      obj.arg2 = null;
    } else if ((match = token.match(regexExch))) {
      obj.op = "exch";
      obj.arg1 = parseInt(match[1]);
      obj.arg2 = parseInt(match[2]);
    } else if ((match = token.match(regexPart))) {
      obj.op = "part";
      obj.arg1 = match[1];
      obj.arg2 = match[2];
    }
    return obj;
  });
}

function part1(sequence) {
  const programArray = createArray();
  return dance(sequence, programArray).join("");
}

function part2(sequence) {
  const rounds = 1e9;
  const programArray = createArray();
  const seen = {};
  let stage = 0;

  seen[programArray.join("")] = stage++;

  for (let i = 0; i < rounds; i++) {
    const key = dance(sequence, programArray).join("");
    if (seen[key] == null) {
      seen[key] = stage++;
      continue;
    }

    const cycleStart = seen[key];
    const cycleLength = stage - cycleStart;
    const stageWanted = cycleStart + ((rounds - cycleStart) % cycleLength);

    return getKeyByValue(seen, stageWanted);
  }

  return programArray.join(""); // Did you really wait that long?
}

function createArray() {
  const array = [];
  for (let i = 0; i < 16; i++) {
    array.push(String.fromCharCode(97 + i));
  }
  return array;
}

// Mutates 'array'
function dance(sequence, array) {
  const danceMoves = {
    spin: spin,
    exch: exchange,
    part: partner,
  };

  for (const move of sequence) {
    const arg1 = move.arg1;
    const arg2 = move.arg2;
    const operation = danceMoves[move.op];
    operation(array, arg1, arg2);
  }

  return array;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

///////////////////////////////////////////////////////////////////////////////

function spin(array, amount, _) {
  const spliced = array.splice(array.length - amount, amount);
  array.splice(0, 0, ...spliced);
}

function exchange(array, index1, index2) {
  const swap = array[index1];
  array[index1] = array[index2];
  array[index2] = swap;
}

function partner(array, value1, value2) {
  const index1 = array.indexOf(value1);
  const index2 = array.indexOf(value2);
  const swap = array[index1];
  array[index1] = array[index2];
  array[index2] = swap;
}

///////////////////////////////////////////////////////////////////////////////

main();
