const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const REGEX1 = /(\d)/g;
const REGEX2 = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
const numMap = new Map([
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
]);

const parseNum = (whichArr, index) => {
    let digit = numMap.get(whichArr[index]);
    if (digit === undefined) {
        digit = whichArr[index];
    }
    return digit;
};

const getSum = (regex) => {
    return INPUT.reduce((acc, curr) => {
        const matchs = Array.from(curr.matchAll(regex), (match) => match[1]);
        const num = parseInt(
            parseNum(matchs, 0) + parseNum(matchs, matchs.length - 1)
        );

        return acc + num;
    }, 0);
};

const firstPart = getSum(REGEX1);
console.log("Part One", firstPart);

const secondPart = getSum(REGEX2);
console.log("Part Two", secondPart);
