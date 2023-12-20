const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((line) => line.split("").map(Number));

const TOP = 1;
const RIGHT = 2;
const DOWN = 4;
const LEFT = 8;

const directions = [TOP, RIGHT, DOWN, LEFT];

const directionSteer = {
    [TOP]: [RIGHT, LEFT],
    [RIGHT]: [TOP, DOWN],
    [DOWN]: [RIGHT, LEFT],
    [LEFT]: [TOP, DOWN],
};

const directionsShift = {
    [TOP]: { row: -1, col: 0 },
    [RIGHT]: { row: 0, col: 1 },
    [DOWN]: { row: 1, col: 0 },
    [LEFT]: { row: 0, col: -1 },
};

class Node {
    row;
    col;
    direction;
    times;
    heatLost;
    constructor(row, col, direction, times, heatLost) {
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.times = times;
        this.heatLost = heatLost;
    }
    toString() {
        return `${this.row}-${this.col}-${this.direction}-${this.times}`;
    }
}

const findPath = (grid, start, goal, lims) => {
    const n = grid.length; // number of rows
    const m = grid[0].length; // number of cols
    const gr = goal.row;
    const gc = goal.col;
    const min = lims.min; // steps needed before be able to steer
    const max = lims.max; // maximum number of steps in straight line

    const visited = new Set();
    const priorityQueue = [];

    // Add start neighbors
    directions.forEach((dir) => {
        const nr = start.row + directionsShift[dir].row;
        const nc = start.col + directionsShift[dir].col;
        if (nr >= 0 && nr < n && nc >= 0 && nc < m) {
            const node = new Node(nr, nc, dir, 1, grid[nr][nc]);
            priorityQueue.push(node);
        }
    });

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.heatLost - b.heatLost);
        const data = priorityQueue.shift();
        const r = data.row;
        const c = data.col;
        const d = data.direction;
        const t = data.times;
        const hl = data.heatLost;

        if (r === gr && c === gc && t >= min) {
            return hl;
        }
        if (visited.has(data.toString())) {
            continue;
        }
        visited.add(data.toString());

        if (t < max) {
            const nr = r + directionsShift[d].row;
            const nc = c + directionsShift[d].col;
            if (nr >= 0 && nr < n && nc >= 0 && nc < m) {
                const node = new Node(nr, nc, d, t + 1, hl + grid[nr][nc]);
                priorityQueue.push(node);
            }
        }

        if (t >= min) {
            directionSteer[d].forEach((dir) => {
                const nr = r + directionsShift[dir].row;
                const nc = c + directionsShift[dir].col;
                if (nr >= 0 && nr < n && nc >= 0 && nc < m) {
                    const node = new Node(nr, nc, dir, 1, hl + grid[nr][nc]);
                    priorityQueue.push(node);
                }
            });
        }
    }
    return -1; // failure
};

// took me 1 minute to execute
const partOne = (input) => {
    const start = { row: 0, col: 0 };
    const goal = { row: input.length - 1, col: input[0].length - 1 };
    const lims = { min: 1, max: 3 };
    const lostHeat = findPath(input, start, goal, lims);
    return lostHeat;
};

// took me 5 minutes to execute
const partTwo = (input) => {
    const start = { row: 0, col: 0 };
    const goal = { row: input.length - 1, col: input[0].length - 1 };
    const lims = { min: 4, max: 10 };
    const lostHeat = findPath(input, start, goal, lims);
    return lostHeat;
};

const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);

// TODO: try to reduce execution time