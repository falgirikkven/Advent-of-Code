const INPUT = "amgozmfv";

const GRID_SIZE = 128;

function main() {
  const data = countData(INPUT, GRID_SIZE);

  const result1 = data.squares;
  const result2 = data.groups;

  console.log("Part One", result1); // Expected output: 8222
  console.log("Part Two", result2); // Expected output: 1086
}

///////////////////////////////////////////////////////////////////////////////

function createGrid(keyString, size) {
  const grid = new Array(size);
  for (let i = 0; i < size; i++) {
    const row = new Array(128);
    const hash = knotHash(keyString + "-" + i);

    for (let j = 0; j < 16; j++) {
      const num = hash[j];
      for (let k = 0, cursor = 128; k < 8; k++) {
        row[8 * j + k] = (num & cursor) >> (7 - k);
        cursor = cursor >> 1;
      }
    }

    grid[i] = row;
  }

  return grid;
}

function countData(keyString, size) {
  const grid = createGrid(keyString, size);

  const rows = size;
  const cols = 128;
  const data = { grid, rowMax: rows - 1, colMax: cols - 1, squares: 0 };
  let groups = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] == 0) continue;
      groups += 1;
      cd_recursion(data, i, j);
    }
  }

  return { squares: data.squares, groups };
}

function cd_recursion(data, r, c) {
  data.squares += 1;
  data.grid[r][c] = 0;

  if (r > 0 && data.grid[r - 1][c]) cd_recursion(data, r - 1, c);
  if (r < data.rowMax && data.grid[r + 1][c]) cd_recursion(data, r + 1, c);

  if (c > 0 && data.grid[r][c - 1]) cd_recursion(data, r, c - 1);
  if (c < data.colMax && data.grid[r][c + 1]) cd_recursion(data, r, c + 1);
}

///////////////////////////////////////////////////////////////////////////////

// Slighted edited from day 10
function knotHash(string) {
  const lengthArray = string.split("").map((e) => e.charCodeAt(0));
  lengthArray.push(17, 31, 73, 47, 23); // Salt
  const array = Array.from(Array(256).keys());
  let position = 0;
  let skipSize = 0;

  for (let j = 0; j < 64; j++) {
    for (let i = 0; i < lengthArray.length; i++) {
      const value = lengthArray[i];

      reverseSegment(array, position, value);

      position = (position + value + skipSize) % 256;
      skipSize += 1;
    }
  }

  return getDenseHash(array);
}

function reverseSegment(array, start, amount) {
  const swapArray = [];
  const len = array.length;

  for (let i = 0, cursor = start; i < amount; i++) {
    swapArray[i] = [cursor, array[cursor]];
    cursor = (cursor + 1) % len;
  }

  for (let i = 0; i < amount; i++) {
    const sourceData = swapArray[amount - i - 1][1];
    const targetIndex = swapArray[i][0];
    array[targetIndex] = sourceData;
  }
}

function getDenseHash(sparseHash) {
  const denseHash = [];

  for (let i = 0; i < 16; i++) {
    const initialPos = 16 * i;
    let value = 0;
    for (let j = 0; j < 16; j++) {
      value ^= sparseHash[initialPos + j];
    }
    denseHash.push(value);
  }

  return denseHash;
}

///////////////////////////////////////////////////////////////////////////////

main();
