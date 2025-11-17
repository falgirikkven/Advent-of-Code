const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), "utf8");

const width = 70;
const height = 70;

const bytesToPick = 1024;

const inf = 1e9;
const grid = [];

function main() {
    createMap();

    processInput();

    // 374
    const firstPart = partOne();
    console.log("Part One", firstPart);
}

function createMap() {
    for (let row = 0; row <= height; row++) {
        const line = [];

        grid.push(line);

        for (let col = 0; col <= width; col++) {
            line.push(createCell(row, col));
        }
    }
}

function createCell(row, col) {
    return { row, col, block: false, distance: inf };
}

function processInput() {
    const lines = input.split("\r\n");

    for (let i = 0; i < bytesToPick; i++) {
        const coords = lines[i].match(/(\d+)/g);

        const row = parseInt(coords[1]);
        const col = parseInt(coords[0]);

        grid[row][col].block = true;
    }
}

/* ************************************************************************* */

function partOne() {
    const startingCell = grid[0][0];

    startingCell.distance = 0;

    const cellStack = [startingCell];

    while (cellStack.length > 0) {
        const cell = cellStack.pop();

        const row = cell.row;
        const col = cell.col;
        const distance = cell.distance + 1;

        pickCell(row, col + 1, distance, cellStack);
        pickCell(row, col - 1, distance, cellStack);
        pickCell(row + 1, col, distance, cellStack);
        pickCell(row - 1, col, distance, cellStack);
    }

    const endingCell = grid[height][width];
    return endingCell.distance;
}

function pickCell(row, col, distance, cellStack) {
    if (row < 0 || col < 0) return;
    if (row > height || col > width) return;

    const cell = grid[row][col];

    if (cell.block) return;
    if (cell.distance <= distance) return;

    cell.distance = distance;
    cellStack.push(cell);
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
