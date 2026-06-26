const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-3"), "utf8")
  .trim();

function main() {
  const movements = processInput();

  const santaVisitsSet = getUniqueVisits(movements);
  const teamVisitsSet = getSplittedUniqueVisits(movements); // team: santa and robo

  const result1 = santaVisitsSet.size;
  const result2 = teamVisitsSet.size;

  console.log("Part One", result1); // Expected output: 2565
  console.log("Part Two", result2); // Expected output: 2639
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("");
}

function getSplittedUniqueVisits(movements) {
  const len = movements.length;
  const santaMovs = [];
  const robotMovs = [];

  for (let i = 0; i < len; i += 2) santaMovs.push(movements[i]);
  for (let i = 1; i < len; i += 2) robotMovs.push(movements[i]);

  const santaSet = getUniqueVisits(santaMovs);
  const robotSet = getUniqueVisits(robotMovs);

  const mergedVisits = new Set([...santaSet, ...robotSet]);

  return mergedVisits;
}

function getUniqueVisits(movements) {
  const arr = [
    { key: "^", value: { dr: -1, dc: 0 } },
    { key: "v", value: { dr: 1, dc: 0 } },
    { key: ">", value: { dr: 0, dc: 1 } },
    { key: "<", value: { dr: 0, dc: -1 } },
  ];
  const orderMap = new Map(arr.map((obj) => [obj.key, obj.value]));

  let result = 0;

  let row = 0;
  let col = 0;

  const visited = new Set([coordsToString(row, col)]);

  for (const mov of movements) {
    const order = orderMap.get(mov);
    row += order.dr;
    col += order.dc;
    visited.add(coordsToString(row, col));
  }

  return visited;
}

function coordsToString(row, col) {
  return `${row}x${col}`;
}

///////////////////////////////////////////////////////////////////////////////

main();
