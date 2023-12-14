const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n\n")
    .map((elem) => elem.split("\n"));

const computeLine = (line) => {
    let ret = 0;
    let val = 1;
    for (let i = line.length - 1; i >= 0; i--) {
        if (line[i] == "#") {
            ret += val;
        }
        val *= 2;
    }
    return ret;
};

// a and b should be positive integers
const isValidSmudge = (a, b) => {
    if (a < b) {
        let swap = a;
        a = b;
        b = swap;
    }
    let probe = 1;
    let lim = a;
    while (probe <= lim) {
        if ((b | probe) == a) {
            return true;
        }
        probe *= 2;
    }
    return false;
};

const getReflection = (nums) => {
    const half = Math.ceil(nums.length / 2);
    let ret = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        let check = true;
        let n = i + 1;
        if (n >= half) n = nums.length - i - 1;
        for (let j = 0; j < n; j++) {
            if (nums[i - j] !== nums[i + j + 1]) {
                check = false;
                break;
            }
        }
        if (check) {
            ret = i + 1;
        }
    }
    return ret;
};

const getReflectionCheckSmudge = (nums) => {
    const half = Math.ceil(nums.length / 2);
    let ret = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        let check = true;
        let smudge = false;
        let n = i + 1;
        if (n >= half) n = nums.length - i - 1;
        for (let j = 0; j < n; j++) {
            let a = nums[i - j];
            let b = nums[i + j + 1];
            if (a !== b) {
                if (!smudge && isValidSmudge(a, b)) {
                    smudge = true;
                } else {
                    check = false;
                    break;
                }
            }
        }
        if (check && smudge) {
            ret = i + 1;
            break;
        }
    }
    return ret;
};

const summarizePatterns = (input, smudge = false) => {
    const rowValues = input.map((chunk) => {
        const arr = chunk.map((line) => computeLine(line));
        if (smudge) {
            return getReflectionCheckSmudge(arr);
        } else {
            return getReflection(arr);
        }
    });
    const row = rowValues.reduce((acc, curr) => acc + curr, 0);
    const colValues = input.map((chunk) => {
        const arr = [];
        for (let j = 0; j < chunk[0].length; j++) {
            line = "";
            for (let i = 0; i < chunk.length; i++) {
                line = chunk[i][j] + line;
            }
            arr.push(computeLine(line));
        }
        if (smudge) {
            return getReflectionCheckSmudge(arr);
        } else {
            return getReflection(arr);
        }
    });

    const col = colValues.reduce((acc, curr) => acc + curr, 0);
    return row * 100 + col;
};

const firstPart = summarizePatterns(INPUT);
console.log("Part One", firstPart);

const secondPart = summarizePatterns(INPUT, true);
console.log("Part Two", secondPart);
