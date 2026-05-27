const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

function main() {
  const redTiles = processInput(INPUT);

  const polygon = createPolygon(redTiles);

  const largestArea = findLargestAreaInside(redTiles, polygon);

  let result = largestArea;

  console.log("Part Two", result);
  // Expected output: 1544362560
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const redTiles = [];

  const lines = input.split("\n");
  for (const line of lines) {
    const raw = line.split(",");

    const row = parseInt(raw.pop());
    const col = parseInt(raw.pop());

    redTiles.push({ row, col });
  }

  return redTiles;
}

function createPolygon(vertices) {
  const edges = [];

  for (let i = 0; i < vertices.length - 1; i++) {
    edges.push(createEdge(vertices[i], vertices[i + 1]));
  }
  edges.push(createEdge(vertices[vertices.length - 1], vertices[0]));

  return edges;
}

// X increases to the right, Y increases downwards
function createEdge(vertex1, vertex2) {
  const x1 = Math.min(vertex1.col, vertex2.col);
  const x2 = Math.max(vertex1.col, vertex2.col);
  const y1 = Math.min(vertex1.row, vertex2.row);
  const y2 = Math.max(vertex1.row, vertex2.row);
  return { left: x1, right: x2, top: y1, bottom: y2 };
}

function findLargestAreaInside(redTiles, polygon) {
  let largestArea = 0;
  const len = redTiles.length;

  for (let i = 0; i < len; i++) {
    const vertex1 = redTiles[i];
    for (let j = i + 1; j < len; j++) {
      const vertex2 = redTiles[j];

      const x1 = Math.min(vertex1.col, vertex2.col);
      const x2 = Math.max(vertex1.col, vertex2.col);
      const y1 = Math.min(vertex1.row, vertex2.row);
      const y2 = Math.max(vertex1.row, vertex2.row);

      const area = (x2 - x1 + 1) * (y2 - y1 + 1);

      if (area <= largestArea) continue;

      if (hasInterference(polygon, x1, x2, y1, y2)) {
        continue;
      }

      largestArea = area;
    }
  }

  return largestArea;
}

function hasInterference(polygon, left, right, top, bottom) {
  for (const edge of polygon) {
    const bx1 = edge.left >= right;
    const bx2 = edge.right <= left;
    const by1 = edge.top >= bottom;
    const by2 = edge.bottom <= top;

    if (!(bx1 || bx2 || by1 || by2)) return true;
  }

  return false;
}

///////////////////////////////////////////////////////////////////////////////

main();
