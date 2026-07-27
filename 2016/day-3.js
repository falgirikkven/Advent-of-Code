const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-3"), "utf8")
  .trim();

function main() {
  const triangles = processInput();

  const result1 = countValidTriangles(triangles);
  const result2 = countVerticallyValidTriangles(triangles);

  console.log("Part One", result1); // Expected output: 982
  console.log("Part Two", result2); // Expected output: 1826
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\d+)\s+(\d+)\s+(\d+)/;
  return INPUT.split("\n").map((line) => {
    const matches = line.match(regex);
    const nums = [];
    nums.push(parseInt(matches[1]));
    nums.push(parseInt(matches[2]));
    nums.push(parseInt(matches[3]));
    return nums;
  });
}

function isValidTriangle(triangle) {
  return (
    triangle[0] + triangle[1] > triangle[2] &&
    triangle[1] + triangle[2] > triangle[0] &&
    triangle[2] + triangle[0] > triangle[1]
  );
}

function countValidTriangles(triangles) {
  return triangles.reduce((acc, curr) => {
    if (isValidTriangle(curr)) acc += 1;
    return acc;
  }, 0);
}

function countVerticallyValidTriangles(triangles) {
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < triangles.length; j += 3) {
      const triangle = [
        triangles[j][i],
        triangles[j + 1][i],
        triangles[j + 2][i],
      ];
      if (isValidTriangle(triangle)) count += 1;
    }
  }
  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
