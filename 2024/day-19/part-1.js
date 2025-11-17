const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const patternsAvailables = [];
const designsToCreate = [];

function main() {
    processInput();

    // 233
    const firstPart = partOne();
    console.log("Part One", firstPart);
}

function processInput() {
    const paragrapgh = input.split("\r\n\r\n");

    const patterns = paragrapgh[0].trim().split(", ");
    for (str of patterns) patternsAvailables.push(str.trim());

    const lines = paragrapgh[1].trim().split("\r\n");
    for (str of lines) designsToCreate.push(str.trim());
}

/* ************************************************************************* */

function partOne() {
    let count = 0;

    for (const design of designsToCreate) {
        if (isDesignPossible(design)) count++;
    }

    return count;
}

function isDesignPossible(design) {
    if ("" == design) return true;

    for (const pattern of patternsAvailables) {
        if (!design.startsWith(pattern)) continue;

        const remain = design.replace(pattern, "");

        if (isDesignPossible(remain)) return true;
    }

    return false;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
