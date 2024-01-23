const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

// works fine for part 1 but runs very slow for part 2

const shift = {
    U: { row: -1, col: 0 },
    R: { row: 0, col: 1 },
    D: { row: 1, col: 0 },
    L: { row: 0, col: -1 },
};

// orientation: 1 clockwise, -1 counterclockwise
const orientedShift = (mov, orient) => {
    if (mov == "U") {
        if (orient === 1) {
            return shift.R;
        } else if (orient === -1) {
            return shift.L;
        }
    } else if (mov == "R") {
        if (orient === 1) {
            return shift.D;
        } else if (orient === -1) {
            return shift.U;
        }
    } else if (mov == "D") {
        if (orient === 1) {
            return shift.L;
        } else if (orient === -1) {
            return shift.R;
        }
    } else if (mov == "L") {
        if (orient === 1) {
            return shift.U;
        } else if (orient === -1) {
            return shift.D;
        }
    }
    return null;
};

const direction = ["R", "D", "L", "U"];

const getMovements = (input, part2 = false) => {
    if (part2) {
        return input.map((line) => {
            const parsed = line.match(/#([0-9a-fA-F]{5})(\d)/);
            const data = [];
            data.push(direction[parseInt(parsed[2])]);
            data.push(parseInt(parsed[1], 16));
            return data;
        });
    }
    return input.map((line) => {
        const parsed = line.match(/(\w)\s(\d+)/);
        const data = [];
        data.push(parsed[1]);
        data.push(parseInt(parsed[2]));
        return data;
    });
};

// orientation: 1 clockwise, -1 counterclockwise
const mapEdges = (movements, orientation) => {
    const mapped = new Set();
    const filler = [];
    let row = 0;
    let col = 0;
    mapped.add(`${row};${col}`);
    for (let i = 0; i < movements.length; i++) {
        const s = shift[movements[i][0]];
        const os = orientedShift(movements[i][0], orientation);
        const n = movements[i][1];
        for (let j = 0; j < n; j++) {
            row += s.row;
            col += s.col;
            mapped.add(`${row};${col}`);
            filler.push({ row: row + os.row, col: col + os.col });
        }
    }
    while (filler.length > 0) {
        const head = filler.shift();
        const elem = `${head.row};${head.col}`;
        if (mapped.has(elem)) {
            continue;
        }
        mapped.add(elem);
        filler.push({ row: head.row + 1, col: head.col });
        filler.push({ row: head.row - 1, col: head.col });
        filler.push({ row: head.row, col: head.col + 1 });
        filler.push({ row: head.row, col: head.col - 1 });
    }
    return mapped;
};

// 1 clockwise, -1 counterclockwise
const getClockwiseOrientation = (movements) => {
    let orientation = 0;
    let row = 0;
    let col = 0;
    let state = { row: 0, col: 0, s: 1 };
    for (let i = 0; i < movements.length; i++) {
        row += shift[movements[i][0]].row * movements[i][1];
        col += shift[movements[i][0]].col * movements[i][1];
        // initial value
        if (orientation === 0) {
            if (row !== 0 && state.row === 0) {
                state.row = state.s++;
            }
            if (col !== 0 && state.col === 0) {
                state.col = state.s++;
            }
            if (state.row !== 0 && state.col !== 0) {
                let opp = row * col;
                if (opp === 0) console.log("orientation error"); // DEBUG
                if (state.row === 1) {
                    orientation = Math.sign(opp * -1);
                } else if (state.col === 1) {
                    orientation = Math.sign(opp);
                }
                state.row = Math.sign(row);
                state.col = Math.sign(col);
                state.s = 0;
            }
        }
        // check changes
        else {
            let sign;
            let change = false;
            sign = Math.sign(row);
            if (sign != 0 && state.row !== sign) {
                state.row = sign;
                change = true;
            }
            sign = Math.sign(col);
            if (sign != 0 && state.col !== sign) {
                state.col = sign;
                change = true;
            }
            if (change) {
                orientation *= -1;
            }
        }
    }
    return orientation;
};

const solve = (input, isPart2) => {
    const movements = getMovements(input, isPart2);
    const orientation = getClockwiseOrientation(movements);
    const mapped = mapEdges(movements, orientation);
    return mapped.size;
};

const firstPart = solve(INPUT, false);
console.log("Part One", firstPart);

//const secondPart = solve(INPUT, true);
//console.log("Part Two", secondPart);
