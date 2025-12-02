const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = (data) => {
  const splitted = data
    .split("\n\n")
    .map((p) => p.split("\n").map((l) => l.split("")));
  const keys = [];
  const locks = [];
  splitted.forEach((elem) => {
    let start = 0;
    let end = elem.length;
    let delta = 1;
    if (elem[0][0] == ".") {
      start = elem.length - 1;
      end = -1;
      delta = -1;
    }

    const arr = [];
    for (let i = 0; i < elem[0].length; i++) {
      let c = -1;
      for (let j = start; j !== end; j += delta) {
        if (elem[j][i] == ".") {
          arr.push(c);
          break;
        }
        c += 1;
      }
    }

    if (delta === 1) {
      locks.push(arr);
    } else if (delta === -1) {
      keys.push(arr);
    }
  });

  const overlapTH = splitted[0].length - 2;
  return { keys, locks, overlapTH };
};

const { keys, locks, overlapTH } = processInput(input);

function partOne() {
  let count = 0;
  keys.forEach((key) => {
    locks.forEach((lock) => {
      let b = true;
      for (let i = 0; i < key.length; i++) {
        if (key[i] + lock[i] > overlapTH) {
          b = false;
          break;
        }
      }
      if (b) count += 1;
    });
  });

  return count;
}

function partTwo() {
  return 0;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 3114

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output:
