const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((elem) => elem.split(""));

// similar to day 10
const NORTH = 0;
const WEST = 1;
const SOUTH = 2;
const EAST = 3;

const directions = [NORTH, WEST, SOUTH, EAST];

const rowLoops = {
    normal: {
        init: (_) => 0,
        cond: (i, n) => i < n,
        inc: 1,
    },
    inverted: {
        init: (n) => n - 1,
        cond: (i, _) => i >= 0,
        inc: -1,
    },
};

const colLoops = {
    normal: {
        init: (_) => 0,
        cond: (j, m) => j < m,
        inc: 1,
    },
    inverted: {
        init: (m) => m - 1,
        cond: (j, _) => j >= 0,
        inc: -1,
    },
};

const directionData = {
    [NORTH]: {
        rowLoop: rowLoops.normal,
        colLoop: colLoops.normal,
        drow: -1,
        dcol: 0,
    },
    [WEST]: {
        rowLoop: rowLoops.normal,
        colLoop: colLoops.normal,
        drow: 0,
        dcol: -1,
    },
    [SOUTH]: {
        rowLoop: rowLoops.inverted,
        colLoop: colLoops.normal,
        drow: 1,
        dcol: 0,
    },
    [EAST]: {
        rowLoop: rowLoops.normal,
        colLoop: colLoops.inverted,
        drow: 0,
        dcol: 1,
    },
};

const moveRocks = (arr, dir) => {
    const n = arr.length;
    const m = arr[0].length;
    const data = directionData[dir];
    const ild = data.rowLoop;
    const jld = data.colLoop;
    for (let i = ild.init(n); ild.cond(i, n); i += ild.inc) {
        for (let j = jld.init(m); jld.cond(j, m); j += jld.inc) {
            if (arr[i][j] === "O") {
                let ni = i + data.drow;
                let nj = j + data.dcol;
                while (
                    ni >= 0 &&
                    ni < n &&
                    nj >= 0 &&
                    nj < m &&
                    arr[ni][nj] === "."
                ) {
                    ni += data.drow;
                    nj += data.dcol;
                }
                ni -= data.drow;
                nj -= data.dcol;
                arr[i][j] = ".";
                arr[ni][nj] = "O";
            }
        }
    }
};

const computeLoad = (arr) => {
    const n = arr.length;
    const m = arr[0].length;
    let total = 0;
    for (let i = 0; i < n; i++) {
        let load = 0;
        for (let j = 0; j < m; j++) {
            if (arr[i][j] === "O") load += 1;
        }
        total += load * (n - i);
    }
    return total;
};

const partOne = (input) => {
    const arr = new Array(input.length);
    for (let i = 0; i < input.length; i++) {
        arr[i] = [...input[i]];
    }
    moveRocks(arr, NORTH);
    return computeLoad(arr);
};

const partTwo = (input) => {
    const arr = new Array(input.length);
    for (let i = 0; i < input.length; i++) {
        arr[i] = [...input[i]];
    }
    // This is kinda cheating: calculate somes load values and then find the
    // length of the repeating pattern
    const computedLoads = [];
    const cycles = 200;
    for (let i = 0; i < cycles; i++) {
        // Do a cycle
        directions.forEach((dir) => moveRocks(arr, dir));
        computedLoads.push(computeLoad(arr));
    }
    // To prevent false positives a pattern should appear 5 times in a row
    // So this will be probabilistic rather than deterministic
    const checks = 5;
    const maxLength = Math.floor(cycles / checks);
    const pattern = [];
    for (let i = 4; i < maxLength; i++) {
        let equal = true;
        for (let j = 0; j < i; j++) {
            let curr = computedLoads[cycles - 1 - j];
            let prev = computedLoads[cycles - 1 - j - i];
            if (curr !== prev) {
                equal = false;
                break;
            }
        }
        if (equal) {
            for (let k = 2; k < checks; k++) {
                for (let j = 0; j < i; j++) {
                    let curr = computedLoads[cycles - 1 - j];
                    let prev = computedLoads[cycles - 1 - j - i * k];
                    if (curr !== prev) {
                        k = checks;
                        equal = false;
                        break;
                    }
                } // end for j
            } // end for k
            if (equal) {
                for (let j = 0; j < i; j++) {
                    pattern.push(computedLoads[cycles - 1 - j]);
                }
                break;
            } // end if
        } // end if
    } // end for i
    const len = pattern.length;
    let nrpl = 0; // non repeating pattern length
    let cursor = 0;
    for (let i = cycles - 1; i >= 0; i--) {
        if (computedLoads[i] !== pattern[cursor]) {
            nrpl = i + 1;
            break;
        }
        cursor = (cursor + 1) % len;
    }
    // shift index
    let shift = 0;
    for (let i = 0; i < len; i++) {
        let equal = true;
        for (let j = 0; j < len; j++) {
            cursor = (len - j + shift) % len;
            if (computedLoads[j + nrpl] !== pattern[cursor]) {
                equal = false;
                break;
            }
        }
        if (equal) break;
        shift += 1;
    }
    let index = (1000000000 - nrpl) % len;
    return pattern[(len + shift - index + 1) % len];
};

const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
