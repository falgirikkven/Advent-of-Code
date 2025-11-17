const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const getNumbersArray = (data) => {
    const regex = /(\d+)\D+(\d+)/;
    const arr1 = [];
    const arr2 = [];
    data.forEach((line) => {
        const match = line.match(regex);
        arr1.push(Number(match[1]));
        arr2.push(Number(match[2]));
    });
    arr1.sort((a, b) => a - b);
    arr2.sort((a, b) => a - b);
    return [arr1, arr2];
};

const [left, right] = getNumbersArray(INPUT);

const partOne = () => {
    let sum = 0;
    for (let i = 0; i < INPUT.length; i++) {
        sum += Math.abs(left[i] - right[i]);
    }
    return sum;
};

const partTwo = () => {
    let similarity = left.reduce((lacc, lcurr) => {
        const added = right.reduce((racc, rcurr) => {
            return racc + (rcurr == lcurr);
        }, 0);
        return lacc + lcurr * added;
    }, 0);

    return similarity;
};

// 2815556
const firstPart = partOne();
console.log("Part One", firstPart);

// 23927637
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
