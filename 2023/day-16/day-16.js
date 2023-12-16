const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((line) => line.split(""));

const TOP = 1;
const RIGHT = 2;
const DOWN = 4;
const LEFT = 8;

// Slash: /
const directionSlash = {
    [TOP]: RIGHT,
    [RIGHT]: TOP,
    [DOWN]: LEFT,
    [LEFT]: DOWN,
};

// Backslash: \
const directionBackslash = {
    [TOP]: LEFT,
    [RIGHT]: DOWN,
    [DOWN]: RIGHT,
    [LEFT]: TOP,
};

const shift = {
    [TOP]: { row: -1, col: 0 },
    [RIGHT]: { row: 0, col: 1 },
    [DOWN]: { row: 1, col: 0 },
    [LEFT]: { row: 0, col: -1 },
};

const getGrid = (input) => {
    const grid = new Array(input.length);
    for (let i = 0; i < input.length; i++) {
        grid[i] = new Array(input[i].length);
        for (let j = 0; j < input[i].length; j++) {
            grid[i][j] = { row: i, col: j, tile: input[i][j], dir: 0 };
        }
    }
    return grid;
};

// this could be a map
const getFork = (tile, dir) => {
    if (tile === "|" && (dir === RIGHT || dir === LEFT)) {
        return [TOP, DOWN];
    }
    if (tile === "-" && (dir === TOP || dir === DOWN)) {
        return [RIGHT, LEFT];
    }
    return null;
};

const pushNextValid = (arr, grid, loc, dir) => {
    const i = loc.row + shift[dir].row;
    const j = loc.col + shift[dir].col;
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
        arr.push({ loc: grid[i][j], dir: dir });
    }
};

const getValidNeighbor = (grid, loc, dir) => {
    const neighbor = [];
    const tile = loc.tile;
    const fork = getFork(tile, dir);
    if (fork === null) {
        if (tile === ".") {
            // do nothing
        } else if (tile == "\\") {
            dir = directionBackslash[dir];
        } else if (tile == "/") {
            dir = directionSlash[dir];
        }
        pushNextValid(neighbor, grid, loc, dir);
    } else {
        pushNextValid(neighbor, grid, loc, fork[0]);
        pushNextValid(neighbor, grid, loc, fork[1]);
    }
    return neighbor;
};

const energizeTiles = (grid, start, direction) => {
    const queue = [{ loc: start, dir: direction }];
    const visited = new Set();
    while (queue.length) {
        const data = queue.shift();
        const loc = data.loc;
        const dir = data.dir;
        const wasVisited = visited.has(loc) && (loc.dir & dir) !== 0;
        if (!wasVisited) {
            visited.add(loc);
            loc.dir |= dir;
            const neighbors = getValidNeighbor(grid, loc, dir);
            // at most there can be two
            neighbors.forEach((element) => {
                queue.push(element);
            });
        }
    }

    return visited;
};

const countEnergizedTiles = (input, initial, dir) => {
    const grid = getGrid(input);
    const start = grid[initial[0]][initial[1]];
    return energizeTiles(grid, start, dir).size;
};

const partOne = (input) => {
    const initial = [0, 0];
    const direction = RIGHT;
    return countEnergizedTiles(input, initial, direction);
};

const partTwo = (input) => {
    const n = input.length;
    const m = input[0].length;
    let maximun = Number.NEGATIVE_INFINITY;
    let initial = new Array(2);
    let direction;
    initial[1] = 0;
    direction = RIGHT;
    for (let i = 0; i < n; i++) {
        initial[0] = i;
        let count = countEnergizedTiles(input, initial, direction);
        if (count > maximun) {
            maximun = count;
        }
    }
    direction = LEFT;
    initial[1] = m - 1;
    for (let i = 0; i < n; i++) {
        initial[0] = i;
        let count = countEnergizedTiles(input, initial, direction);
        if (count > maximun) {
            maximun = count;
        }
    }
    direction = DOWN;
    initial[0] = 0;
    for (let j = 0; j < m; j++) {
        initial[1] = j;
        let count = countEnergizedTiles(input, initial, direction);
        if (count > maximun) {
            maximun = count;
        }
    }
    direction = TOP;
    initial[0] = n - 1;
    for (let j = 0; j < m; j++) {
        initial[1] = j;
        let count = countEnergizedTiles(input, initial, direction);
        if (count > maximun) {
            maximun = count;
        }
    }
    return maximun;
};

const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
