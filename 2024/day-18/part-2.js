const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), "utf8");

const height = 70;
const width = 70;

const inf = 1e9;
const grid = [];

const coordinatesList = [];

function main() {
    createMap();

    processInput();

    // 30,12
    const secondPart = partTwo();
    console.log("Part Two", secondPart);
}

function createMap() {
    for (let row = 0; row <= width; row++) {
        const line = [];

        grid.push(line);

        for (let col = 0; col <= height; col++) {
            line.push(createCell(row, col));
        }
    }
}

function createCell(row, col) {
    return { row, col, blockLevel: inf, level: -1 };
}

function processInput() {
    const lines = input.split("\r\n");

    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i].match(/(\d+)/g);

        const row = parseInt(coords[1]);
        const col = parseInt(coords[0]);

        grid[row][col].blockLevel = i;
        coordinatesList.push({ row, col });
    }
}

/* ************************************************************************* */

function partTwo() {
    let low = 0;
    let high = coordinatesList.length - 1;

    while (true) {
        if (low + 1 == high) {
            const coords = coordinatesList[high];
            return `${coords.col},${coords.row}`;
        }

        const level = Math.floor((low + high) / 2);

        const free = walk(level);

        if (free) low = level;
        else high = level;
    }
}

function walk(level) {
    const startingCell = grid[0][0];

    startingCell.level = level;

    const cellStack = [startingCell];

    while (cellStack.length > 0) {
        const cell = cellStack.pop();

        const row = cell.row;
        const col = cell.col;

        if (row == height && col == width) return true;

        pickCell(row, col + 1, level, cellStack);
        pickCell(row, col - 1, level, cellStack);
        pickCell(row + 1, col, level, cellStack);
        pickCell(row - 1, col, level, cellStack);
    }

    return false;
}

function pickCell(row, col, level, cellStack) {
    if (row < 0 || col < 0) return;
    if (row > height || col > width) return;

    const cell = grid[row][col];

    if (cell.blockLevel <= level) return;
    if (cell.level == level) return;

    cell.level = level;
    cellStack.push(cell);
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
