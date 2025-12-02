const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const getLists = (data) => {
  const regex = /(\d+)/g;
  return data.split("\n").reduce(
    (acc, line) => {
      const match = line.match(regex);
      acc[0].push(Number(match[0]));
      acc[1].push(Number(match[1]));
      return acc;
    },
    [[], []]
  );
};

const [list1, list2] = getLists(input);

function partOne() {
  // Prevent array mutation
  const l1 = [...list1].sort();
  const l2 = [...list2].sort();

  let dist = 0;
  for (let i = 0; i < l1.length; i++) {
    dist += Math.abs(l2[i] - l1[i]);
  }

  return dist;
}

function partTwo() {
  const numberCount = list2.reduce((acc, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1;
    return acc;
  }, {});

  return list1.reduce((acc, curr) => acc + curr * (numberCount[curr] ?? 0), 0);
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 2815556

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 23927637
