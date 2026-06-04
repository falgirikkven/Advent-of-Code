const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const SHAPE_DIM = 3;
const GRID_SHAPE_PART = "#";
const GRID_SHAPE_EMPTY = ".";

function main() {
  const { shapes, regions } = processInput(INPUT);

  let result = 0;

  for (const region of regions) {
    if (canFitAll(region, shapes)) {
      result += 1;
    }
  }

  console.log("Part One", result);
  // Expected output: 410
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const splitted = input.split("\n\n");

  const regions = createRegions(splitted.pop());

  const shapes = [];
  for (const line of splitted) {
    shapes.push(createShape(line));
  }

  console.log(" shapes", shapes, "\nregions", regions);
  return { shapes, regions };
}

function createRegions(str) {
  const regExp1 = /(.+):\s(.+)/;
  const regExp2 = /(\d+)/g;
  return str.split("\n").map((line) => {
    const matches = line.match(regExp1);
    const dimenssions = matches[1].match(regExp2).map((n) => parseInt(n));
    const quantityIndexes = matches[2].match(regExp2).map((n) => parseInt(n));
    return { dimenssions, quantityIndexes };
  });
}

function createShape(str) {
  let num = 0;
  const rawData = str.split("\n");
  rawData.shift(); // first row is irrelevant
  for (let i = 0; i < SHAPE_DIM; i++) {
    for (let j = 0; j < SHAPE_DIM; j++) {
      const c = rawData[i].charAt(j);
      if (c == GRID_SHAPE_PART) num += 1;
      else if (c != GRID_SHAPE_EMPTY) throw "createShape: invalid character";
    }
  }
  return num;
}

// Cheap solution
function canFitAll(region, shapes) {
  let count = 0;
  const max = region.dimenssions[0] * region.dimenssions[1];
  for (let i = 0; i < shapes.length; i++) {
    count += shapes[i] * region.quantityIndexes[i];
  }

  if (count <= max) return true;
  return false;
}

///////////////////////////////////////////////////////////////////////////////

main();
