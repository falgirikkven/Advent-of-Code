const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n\n");

const REGEX = /(\w+)/g;

const countStepsToDestiny = (nodes, instruction, start) => {
    let curr = start;
    let count = 0;
    let cursor = 0;
    while (curr.charAt(2) !== "Z") {
        curr = nodes[curr][instruction[cursor]];
        cursor = cursor < instruction.length - 1 ? cursor + 1 : 0;
        count++;
    }
    return count;
};

const partOne = (input) => {
    const instructions = input[0].split("");
    const nodes = input[1].split("\n").reduce((acc, curr) => {
        const matchs = curr.match(REGEX);
        acc[matchs[0]] = { L: matchs[1], R: matchs[2] };
        return acc;
    }, {});
    return countStepsToDestiny(nodes, instructions, "AAA");
};

// Thanks stackoverflow for this two functions
const gcd = (a, b) => (a ? gcd(b % a, a) : b);
const lcm = (a, b) => (a * b) / gcd(a, b);

const partTwo = (input) => {
    const instructions = input[0].split("");
    const nodes = {};
    const startNodes = [];

    input[1].split("\n").forEach((line) => {
        const matchs = line.match(REGEX);
        const node = matchs[0];
        nodes[node] = { L: matchs[1], R: matchs[2] };
        if (node.charAt(2) === "A") {
            startNodes.push(node);
        }
    });

    const stepsCounts = startNodes.map((start) =>
        countStepsToDestiny(nodes, instructions, start)
    );

    return stepsCounts.reduce(lcm);
};

const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
