const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n")
    .map((line) => line.split(""));

const maxR = INPUT.length;
const maxC = INPUT[0].length;

const getNodes = () => {
    const map = new Map();
    for (let i = 0; i < maxR; i++) {
        for (let j = 0; j < maxC; j++) {
            const char = INPUT[i][j];
            if (char != ".") {
                let group = map.get(char);
                if (!group) {
                    group = [];
                    map.set(char, group);
                }
                group.push([i, j]);
            }
        }
    }
    return map;
};

const nodes = getNodes();

const partOne = () => {
    const uniqueLocs = new Set();
    nodes.forEach((value) => {
        const len = value.length;
        for (let i = 0; i < len - 1; i++) {
            for (let j = i + 1; j < len; j++) {
                let loc1 = value[i];
                let loc2 = value[j];
                let dr = loc1[0] - loc2[0];
                let dc = loc1[1] - loc2[1];
                let rr;
                let cc;
                rr = loc1[0] + dr;
                cc = loc1[1] + dc;
                if (0 <= rr && rr < maxR && 0 <= cc && cc < maxC) {
                    uniqueLocs.add(`${rr};${cc}`);
                }
                rr = loc2[0] - dr;
                cc = loc2[1] - dc;
                if (0 <= rr && rr < maxR && 0 <= cc && cc < maxC) {
                    uniqueLocs.add(`${rr};${cc}`);
                }
            }
        }
    });
    return uniqueLocs.size;
};

const partTwo = () => {
    const uniqueLocs = new Set();
    nodes.forEach((value) => {
        const len = value.length;
        for (let i = 0; i < len - 1; i++) {
            for (let j = i + 1; j < len; j++) {
                let loc1 = value[i];
                let loc2 = value[j];
                let dr = loc1[0] - loc2[0];
                let dc = loc1[1] - loc2[1];
                let rr;
                let cc;
                rr = loc1[0];
                cc = loc1[1];
                while (0 <= rr && rr < maxR && 0 <= cc && cc < maxC) {
                    uniqueLocs.add(`${rr};${cc}`);
                    rr += dr;
                    cc += dc;
                }
                rr = loc2[0];
                cc = loc2[1];
                while (0 <= rr && rr < maxR && 0 <= cc && cc < maxC) {
                    uniqueLocs.add(`${rr};${cc}`);
                    rr -= dr;
                    cc -= dc;
                }
            }
        }
    });
    return uniqueLocs.size;
};

// 291
const firstPart = partOne();
console.log("Part One", firstPart);

// 1015
const secondPart = partTwo();
console.log("Part Two", secondPart);
