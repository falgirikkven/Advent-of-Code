const INPUT = 265149;

function main() {
  const result1 = findDistance(INPUT);
  const result2 = findValues(INPUT);

  console.log("Part One", result1); // Expected output: 438
  console.log("Part Two", result2); // Expected output: 266330
}

///////////////////////////////////////////////////////////////////////////////

function findDistance(number) {
  let nearestOddSquare = Math.ceil(Math.sqrt(number));
  nearestOddSquare += nearestOddSquare % 2 == 0 ? 1 : 0;
  if (number == nearestOddSquare) return number - 1;

  const delta = nearestOddSquare - 1;
  let corner = nearestOddSquare * nearestOddSquare - delta;
  for (let i = 0; i < 4; i++) {
    if (number >= corner) {
      return Math.abs(number - (corner + delta / 2)) + delta / 2;
    }
    corner -= delta;
  }

  return null;
}

function findValues(upTo) {
  const directions = [
    { dr: 1, dc: 0 }, // Down
    { dr: 0, dc: 1 }, // Right
    { dr: -1, dc: 0 }, // Up
    { dr: 0, dc: -1 }, // Left
    // Diagonals
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: -1, dc: -1 },
  ];
  let dIndex = 0;
  let dChangeCounter = 0;
  let dChangeAux = 0;

  const cache = { "0;0": 1 };
  let row = 0;
  let col = 0;

  let lastAdded;
  for (let i = 1; i < 1e4; i++) {
    if (dChangeCounter == 0) {
      dChangeCounter = (dChangeAux >> 1) + 1;
      dChangeAux += 1;
      dIndex = (dIndex + 1) & 3;
    }
    row += directions[dIndex].dr;
    col += directions[dIndex].dc;

    let sum = 0;
    for (const dir of directions) {
      const val = cache[`${row + dir.dr};${col + dir.dc}`] ?? 0;
      sum += val;
    }

    if (sum > upTo) return sum;

    cache[`${row};${col}`] = sum;
    dChangeCounter -= 1;
  }

  return null;
}

///////////////////////////////////////////////////////////////////////////////

main();
