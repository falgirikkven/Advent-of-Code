const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n")
    .map((line) => line.split("").map((num) => Number(num)));

const directions = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
];

const maxR = INPUT.length;
const maxC = INPUT[0].length;

const getTrailheads = (grid) => {
    const arr = [];
    for (let i = 0; i < maxR; i++) {
        for (let j = 0; j < maxC; j++) {
            if (INPUT[i][j] == 0) arr.push({ r: i, c: j, v: 0 });
        }
    }
    return arr;
};

const computeResults = (input) => {
    let score = 0;
    let rating = 0;
    const trailHeads = getTrailheads(input);
    for (const trailHead of trailHeads) {
        const seen = new Set();
        const queue = [trailHead];
        while (queue.length > 0) {
            const curr = queue.pop();
            for (const dir of directions) {
                let r = curr.r + dir.dr;
                let c = curr.c + dir.dc;
                if (
                    0 <= r &&
                    r < maxR &&
                    0 <= c &&
                    c < maxC &&
                    curr.v + 1 == input[r][c]
                ) {
                    let nv = input[r][c];
                    if (nv == 9) {
                        rating += 1;
                        seen.add(`${r};${c}`);
                    } else if (curr.v + 1 == nv) {
                        queue.push({ r: r, c: c, v: nv });
                    }
                }
            }
        }
        score += seen.size;
    }
    return { score, rating };
};

const results = computeResults(INPUT);

const partOne = () => {
    return results.score
};

const partTwo = (input) => {
    return results.rating
};

// 501
const firstPart = partOne();
console.log("Part One", firstPart);

// 1017
const secondPart = partTwo();
console.log("Part Two", secondPart);
