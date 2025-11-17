const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const AllConnections = {};
let largestSet = [];

function main() {
    processInput();

    console.log(AllConnections);
    // TODO
    const solution = solve();
    console.log("Part Two", solution);
}

function processInput() {
    const connections = input.split("\r\n");

    for (let i = 0; i < connections.length; i++) {
        const connection = connections[i].trim().split("-");
        const con0 = connection[0];
        const con1 = connection[1];

        if (AllConnections[con0] == undefined) AllConnections[con0] = [];
        if (AllConnections[con1] == undefined) AllConnections[con1] = [];

        if (AllConnections[con0].indexOf(con1) == -1)
            AllConnections[con0].push(con1);
        if (AllConnections[con1].indexOf(con0) == -1)
            AllConnections[con1].push(con0);
    }
}

function solve() {
    const largestSet = getLargestSet();

    return 0;
}

function getLargestSet() {
    let largestSet;

    for (const start in AllConnections) {
        const set = getLargestSetNode(start);
        console.log(set);
    }

    return 0;
}

function getLargestSetNode(startNode) {
    const connections = AllConnections[startNode];
    const set = new Set();

    for (let i = 0; i < connections.length; i++) {
        for (let j = 0; j < connections.length; j++) {
            if (i == j) continue;
        }
    }
    return set;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
