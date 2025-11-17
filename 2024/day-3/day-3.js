const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const regex = /mul\((\d+),(\d+)\)/g;
const computeLine = (line) => {
    const matches = [...line.matchAll(regex)];
    return matches.reduce((acc, curr) => acc + curr[1] * curr[2], 0);
};

// one check for the other
const regexDo = /(.+?)don't\(\)/;
const regexDoNot = /(.+?)do\(\)/;
const check = (line, shouldDo = true, acc = 0) => {
    if (line == null) return acc;

    let reg = regexDoNot;
    if (shouldDo) reg = regexDo;
    const match = line.match(reg);

    let sub = null;
    let compute = line;
    if (match) {
        sub = line.substring(match[0].length);
        compute = match[1];
    }
    if (shouldDo) {
        acc += computeLine(compute);
    }

    return check(sub, !shouldDo, acc);
};

const partOne = (input) => {
    return input.reduce((acc, curr) => acc + computeLine(curr), 0);
};

const partTwo = (input) => {
    return check(input.join(""))
};

// 174960292
const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

// 56275602
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
