const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((line) => line.split(""));

const TOP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const directions = [TOP, RIGHT, DOWN, LEFT];

const directionValidStart = {
    [TOP]: ["J", "|", "L", "S"],
    [RIGHT]: ["L", "-", "F", "S"],
    [DOWN]: ["7", "|", "F", "S"],
    [LEFT]: ["J", "-", "7", "S"],
};

const directionValidEnd = {
    [TOP]: ["7", "|", "F", "S"],
    [RIGHT]: ["J", "-", "7", "S"],
    [DOWN]: ["J", "|", "L", "S"],
    [LEFT]: ["L", "-", "F", "S"],
};

const shift = {
    [TOP]: { row: -1, col: 0 },
    [RIGHT]: { row: 0, col: 1 },
    [DOWN]: { row: 1, col: 0 },
    [LEFT]: { row: 0, col: -1 },
};

const getGrid = (input) => {
    const n = input.length;
    const grid = new Array(n);
    for (let i = 0; i < n; i++) {
        const m = input[i].length;
        grid[i] = new Array(m);
        for (let j = 0; j < m; j++) {
            grid[i][j] = { row: i, col: j, tile: input[i][j] };
        }
    }
    return grid;
};

const searchStartingPoint = (grid) => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].tile === "S") {
                return grid[i][j];
            }
        }
    }
    return undefined;
};

const getValidNeighbor = (grid, loc) => {
    const neighbor = [];
    const row = loc.row;
    const col = loc.col;
    const tile = grid[row][col].tile;
    directions.forEach((direction) => {
        const delta = shift[direction];
        const nrow = row + delta.row;
        const ncol = col + delta.col;
        if (
            nrow >= 0 &&
            nrow < grid.length &&
            ncol >= 0 &&
            ncol < grid[nrow].length
        ) {
            const next = grid[nrow][ncol].tile;
            if (
                directionValidStart[direction].includes(tile) &&
                directionValidEnd[direction].includes(next)
            ) {
                neighbor.push(grid[nrow][ncol]);
            }
        }
    });
    return neighbor;
};

const findMainLoop = (grid, start) => {
    const queue = [start];
    const visited = new Set();
    start.dist = 0;
    while (queue.length) {
        const loc = queue.shift();
        if (!visited.has(loc)) {
            visited.add(loc);
            const neighbors = getValidNeighbor(grid, loc);
            let dist = loc.dist + 1;
            neighbors.forEach((element) => {
                if (element.dist === undefined) {
                    element.dist = dist;
                }
                queue.push(element);
            });
        }
    }

    return visited;
};

const stepsStart2Farthest = (input) => {
    const grid = getGrid(input);
    const start = searchStartingPoint(grid);
    const loop = findMainLoop(grid, start);
    const distSortedLoop = [...loop.entries()]
        .map((entry) => entry[0])
        .sort((a, b) => b.dist - a.dist);
    return distSortedLoop[0].dist;
};

const partTwo = (input) => {
    const grid = getGrid(input);
    const start = searchStartingPoint(grid);
    const loop = findMainLoop(grid, start);
    return loop;
};

const firstPart = stepsStart2Farthest(INPUT);
console.log("Part One", firstPart); // 6754

// TODO: part 2
//const secondPart = partTwo(INPUT);
//console.log("Part Two", secondPart);
