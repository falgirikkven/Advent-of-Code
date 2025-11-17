const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const inWires = [];
const outWires = [];

function main() {
    processInput();

    // 1366
    const solution = solve();
    console.log("Part One", solution);
}

function processInput() {
    const paragraphs = input.split("\r\n\r\n");

    const ins = paragraphs.shift().split("\r\n");
    const ops = paragraphs.shift().split("\r\n");

    for (const line of ins) {
        console.log(line);
    }
}

function solve() {}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
