const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const AllConnections = {};

function main() {
    processInput();

    // 1366
    const solution = solve();
    console.log("Part One", solution);
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
    const thriceConnections = getTripleSets();

    // Each unique set is repeated 3! times
    return thriceConnections.length / 6;
}

function getTripleSets() {
    const sets = [];

    for (const [node1, cons1] of Object.entries(AllConnections)) {
        for (const node2 of cons1) {
            const cons2 = AllConnections[node2];
            for (const node3 of cons2) {
                const cons3 = AllConnections[node3];

                if (node1 == node3 || cons3.indexOf(node1) == -1) continue;
                if (
                    node1.charAt(0) != "t" &&
                    node2.charAt(0) != "t" &&
                    node3.charAt(0) != "t"
                )
                    continue;

                sets.push(`${node1},${node2},${node3}`);
            }
        }
    }

    return sets;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
