const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim()
    .split("\n");

const shift = {
    U: { row: -1, col: 0 },
    R: { row: 0, col: 1 },
    D: { row: 1, col: 0 },
    L: { row: 0, col: -1 },
};

const getMovements = (input, part2 = false) => {
    if (part2) {
        return input.map((line) => {
            const parsed = line.match(/#([0-9a-fA-F]{5})(\d)/);
            const data = {};
            data.dir = "RDLU"[parseInt(parsed[2])];
            data.steps = parseInt(parsed[1], 16);
            return data;
        });
    }
    return input.map((line) => {
        const parsed = line.match(/(\w)\s(\d+)/);
        const data = {};
        data.dir = parsed[1];
        data.steps = parseInt(parsed[2]);
        return data;
    });
};

// Shoelace formula
const calculateArea = (movs) => {
    let area = 0;
    let prevRow = 0;
    let prevCol = 0;
    for (const data of movs) {
        const s = shift[data.dir];
        let row = prevRow + s.row * data.steps;
        let col = prevCol + s.col * data.steps;
        // Inner plus border
        area += prevCol * row - prevRow * col + data.steps;
        prevRow = row;
        prevCol = col;
    }

    return area / 2 + 1;
};

const solve = (input, isPart2 = false) => {
    const movements = getMovements(input, isPart2);
    const area = calculateArea(movements);
    return area;
};

const firstPart = solve(INPUT, false);
console.log("Part One", firstPart);

const secondPart = solve(INPUT, true);
console.log("Part Two", secondPart);
