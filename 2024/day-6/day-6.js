const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n")
    .map((line) => line.split(""));

const directions = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
];

const getStart = (grid) => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == "^") {
                return { row: i, col: j };
            }
        }
    }
};

const start = getStart(INPUT);

const partOne = (input) => {
    const maxR = input.length;
    const maxC = input[0].length;
    const set = new Set();
    let dir = 0;
    let { row, col } = start;
    while (1) {
        set.add(`${row};${col}`);
        let { dr, dc } = directions[dir];
        let rr = row + dr;
        let cc = col + dc;
        if (!(0 <= rr && rr < maxR && 0 <= cc && cc < maxC)) {
            break;
        }
        if (input[rr][cc] == "#") {
            dir = (dir + 1) % 4;
        } else {
            row = rr;
            col = cc;
        }
    }
    return set.size;
};

const partTwo = (input) => {
    const maxR = input.length;
    const maxC = input[0].length;
    let count = 0;
    for (let i = 0; i < maxR; i++) {
        for (let j = 0; j < maxC; j++) {
            const seen = new Set();
            let dir = 0;
            let { row, col } = start;
            while (1) {
                const curr = `${row};${col};${dir}`;
                if (seen.has(curr)) {
                    count += 1;
                    break;
                }
                seen.add(curr);
                let { dr, dc } = directions[dir];
                let rr = row + dr;
                let cc = col + dc;
                if (!(0 <= rr && rr < maxR && 0 <= cc && cc < maxC)) {
                    break;
                }
                if (input[rr][cc] == "#" || (rr == i && cc == j)) {
                    dir = (dir + 1) % 4;
                } else {
                    row = rr;
                    col = cc;
                }
            }
        }
    }
    return count;
};

// 4826
const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

// 1721
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
