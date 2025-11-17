const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const patternsAvailables = [];
const designsToCreate = [];

const cache = {};

function main() {
    processInput();

    // 691316989225259
    const secondPart = partTwo();
    console.log("Part Two", secondPart);
}

function processInput() {
    const paragrapgh = input.split("\r\n\r\n");

    const patterns = paragrapgh[0].trim().split(", ");
    for (str of patterns) patternsAvailables.push(str.trim());

    const lines = paragrapgh[1].trim().split("\r\n");
    for (str of lines) designsToCreate.push(str.trim());
}

/* ************************************************************************* */

function partTwo() {
    let count = 0;

    for (const design of designsToCreate) {
        count += countPossibleWays(design);
    }

    return count;
}

function countPossibleWays(design) {
    if (cache[design] != undefined) return cache[design];

    let count = 0;
    for (const pattern of patternsAvailables) {
        if (!design.startsWith(pattern)) continue;

        const remain = design.replace(pattern, "");

        if (remain == "") {
            count += 1;
            continue;
        }

        count += countPossibleWays(remain);
    }

    cache[design] = count;

    return count;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
