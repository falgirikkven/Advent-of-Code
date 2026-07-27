const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-1"), "utf8")
  .trim();

function main() {
  const instructions = processInput();

  const { destination, firstTwiceVisited } = followSequence(instructions);

  const location1 = destination;
  const location2 = firstTwiceVisited;

  const result1 = manhattanDistance(location1.x, location1.y);
  const result2 = manhattanDistance(location2.x, location2.y);

  console.log("Part One", result1); // Expected output: 146
  console.log("Part Two", result2); // Expected output: 131
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(L|R)(\d+)/g;
  const matches = INPUT.matchAll(regex);
  const result = [];
  for (const match of matches) {
    const sign = match[1] == "R" ? 1 : -1;
    const module = parseInt(match[2]);
    result.push([sign, module]);
  }

  return result;
}

function followSequence(sequence) {
  let x = 0;
  let y = 0;
  const facing = [0, 1]; // Facing north

  const visits = new Set();
  let firstTwiceVisited;

  for (const instruction of sequence) {
    const sign = instruction[0];
    const module = instruction[1];

    const cache = -facing[0];
    facing[0] = sign * facing[1];
    facing[1] = sign * cache;

    if (firstTwiceVisited == null) {
      for (let i = 1; i < module; i++) {
        const nx = x + i * facing[0];
        const ny = y + i * facing[1];
        const key = `${nx},${ny}`;
        if (visits.has(key)) {
          firstTwiceVisited = { x: nx, y: ny };
          break;
        }
        visits.add(key);
      }
    }

    x += module * facing[0];
    y += module * facing[1];
  }

  const destination = { x, y };
  return { destination, firstTwiceVisited };
}

function manhattanDistance(x, y) {
  return Math.abs(x) + Math.abs(y);
}

///////////////////////////////////////////////////////////////////////////////

main();
