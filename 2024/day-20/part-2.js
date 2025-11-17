const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

let width;
let height;

let startingCell;

const map = [];

const inf = 1e9;
const minimunDistance = 100;
const K = 20;

function main() {
    processInput();

    walkMap();

    // 983054
    const secondPart = partTwo();
    console.log("Part Two", secondPart);
}

function processInput() {
    const lines = input.split("\r\n").map((line) => line.trim().split(""));

    height = lines.length;
    width = lines[0].length;
    for (let row = 0; row < height; row++) {
        const newLine = [];
        map.push(newLine);

        for (let col = 0; col < width; col++) {
            const char = lines[row][col];

            newLine.push(createCell(row, col, "#" == char));

            if ("S" == char) startingCell = map[row][col];
        }
    }
}

function createCell(row, col, blocked) {
    return { row, col, block: blocked, distance: inf };
}

function walkMap() {
    startingCell.distance = 0;

    const cellStack = [startingCell];

    while (cellStack.length > 0) {
        const cell = cellStack.pop();

        const row = cell.row;
        const col = cell.col;
        const distance = cell.distance + 1;

        pickCell(row, col, distance, cellStack, 0, 1);
        pickCell(row, col, distance, cellStack, 0, -1);
        pickCell(row, col, distance, cellStack, 1, 0);
        pickCell(row, col, distance, cellStack, -1, 0);
    }
}

function pickCell(currRow, currCol, distance, cellStack, deltaRow, deltaCol) {
    const row = currRow + deltaRow;
    const col = currCol + deltaCol;

    if (row < 0 || col < 0) return;
    if (row >= height || col >= width) return;

    const cell = map[row][col];

    if (cell.block) {
        return;
    }

    if (cell.distance <= distance) return;

    cell.distance = distance;
    cellStack.push(cell);
}

/* ************************************************************************* */

function partTwo() {
    let count = 0;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const cell = map[row][col];
            if (!cell.block) count += findAllShortcuts(row, col, cell.distance);
        }
    }

    return count;
}

function findAllShortcuts(currentRow, currentCol, currentDistance) {
    let count = 0;

    for (let deltaRow = -K; deltaRow <= K; deltaRow++) {
        const row = currentRow + deltaRow;
        if (row < 0) continue;
        if (row >= height) break;

        for (let deltaCol = -K; deltaCol <= K; deltaCol++) {
            const col = currentCol + deltaCol;
            if (col < 0) continue;
            if (col >= width) break;

            const distance = Math.abs(deltaRow) + Math.abs(deltaCol);

            if (distance == 0) continue;
            if (distance > K) continue;

            const cell = map[row][col];

            if (cell.block) continue;

            const difference = cell.distance - currentDistance - distance;

            if (difference >= minimunDistance) count += 1;
        }
    }

    return count;
}

/* ************************************************************************* */

function showMap() {
    for (const lines of map) {
        let s = "";

        for (const cell of lines) {
            let c = ".";
            if (cell.block) {
                c = "#";
            }

            s += c;
        }

        console.log(s);
    }
}

console.time("execution time");
main();
console.timeEnd("execution time");
