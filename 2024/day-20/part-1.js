const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

let width;
let height;

let startingCell;
//let endingCell;

const map = [];
const skipables = [];

const inf = 1e9;

function main() {
    processInput();

    walkMap();

    // 1375
    const firstPart = partOne();
    console.log("Part One", firstPart);
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
            //else if ("E" == char) endingCell = map[row][col];
        }
    }
}

function createCell(row, col, blocked) {
    return { row, col, block: blocked, skip: null, distance: inf };
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
        const newRow = row + deltaRow;
        const newCol = col + deltaCol;

        if (newRow < 0 || newCol < 0) return;
        if (newRow >= height || newCol >= width) return;

        if (map[newRow][newCol].block) return;
        if (skipables.some((elem) => elem.row == row && elem.col == col))
            return;

        cell.skip = { deltaRow, deltaCol };
        skipables.push(cell);
        return;
    }

    if (cell.distance <= distance) return;

    cell.distance = distance;
    cellStack.push(cell);
}

/* ************************************************************************* */

function partOne() {
    let count = 0;

    for (const skipable of skipables) {
        const row = skipable.row;
        const col = skipable.col;
        const deltaRow = skipable.skip.deltaRow;
        const deltaCol = skipable.skip.deltaCol;
        const distance1 = map[row + deltaRow][col + deltaCol].distance;
        const distance2 = map[row - deltaRow][col - deltaCol].distance;

        const difference = Math.abs(distance1 - distance2) - 2;
        if (100 <= difference) count += 1;
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
                if (cell.skipable) c = "8";
                else c = "#";
            }

            s += c;
        }

        console.log(s);
    }
}

console.time("execution time");
main();
console.timeEnd("execution time");
