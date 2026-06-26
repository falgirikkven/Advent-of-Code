const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-10"), "utf8")
  .trim();

const ROUNDS_1 = 40;
const ROUNDS_2 = 50;

function main() {
  const sequence = processInput();

  const newSequence1 = playLookAndSay(sequence, ROUNDS_1);
  const newSequence2 = playLookAndSay(sequence, ROUNDS_2);

  const result1 = newSequence1.length;
  const result2 = newSequence2.length;

  console.log("Part One", result1); // Expected output: 329356
  console.log("Part Two", result2); // Expected output: 4666278
}

///////////////////////////////////////////////////////////////////////////////

/*
function processInput() {
  return INPUT;
}

// This version always work but it is slow
function playLookAndSay(sequence, rounds) {
  let oldSequence = sequence;

  for (let i = 0; i < rounds; i++) {
    let newSequence = "";
    let count = 0;
    let char = oldSequence.charAt(0);
    for (let j = 0; j < oldSequence.length; j++) {
      if (oldSequence.charAt(j) == char) {
        count++;
      } else {
        newSequence = newSequence.concat(count, char);
        count = 1;
        char = oldSequence.charAt(j);
      }
    }
    oldSequence = newSequence.concat(count, char);
  }

  return oldSequence;
}
*/

function processInput() {
  return INPUT.split("").map((e) => parseInt(e));
}

// This version should work as long every number in the array is below 10
function playLookAndSay(sequence, rounds) {
  let oldSequence = sequence;

  for (let i = 0; i < rounds; i++) {
    let newSequence = [];
    let count = 0;
    let num = oldSequence[0];
    for (let j = 0; j < oldSequence.length; j++) {
      if (oldSequence[j] == num) {
        count++;
      } else {
        newSequence.push(count);
        newSequence.push(num);
        count = 1;
        num = oldSequence[j];
      }
    }
    newSequence.push(count);
    newSequence.push(num);
    oldSequence = newSequence;
  }

  return oldSequence;
}

///////////////////////////////////////////////////////////////////////////////

main();
