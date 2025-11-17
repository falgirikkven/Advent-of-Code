const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n")
    .map((line) => line.split(""));

const directions = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
];

const diagonals = [
    { dr: -1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
];

const maxR = INPUT.length;
const maxC = INPUT[0].length;

const isInside = (r, c) => {
    return 0 <= r && r < maxR && 0 <= c && c < maxC;
};

const checkEdges = (neighboors, char) => {
    let ret = 0;
    // Convex Corners
    // UL
    if (!(neighboors[0] || neighboors[3])) ret += 1;
    // UR
    if (!(neighboors[0] || neighboors[1])) ret += 1;
    // BL
    if (!(neighboors[2] || neighboors[1])) ret += 1;
    // BR
    if (!(neighboors[2] || neighboors[3])) ret += 1;

    // Concave corners
    // UL
    if (!neighboors[4] && neighboors[0] && neighboors[3]) ret += 1;
    // UR
    if (!neighboors[5] && neighboors[0] && neighboors[1]) ret += 1;
    // BL
    if (!neighboors[6] && neighboors[2] && neighboors[1]) ret += 1;
    // BR
    if (!neighboors[7] && neighboors[2] && neighboors[3]) ret += 1;

    return ret;
};

const getRegionData = (visited, row, col) => {
    const char = visited[row][col];
    const seen = new Set();
    const queue = [{ r: row, c: col }];
    seen.add(`${row};${col}`);

    const region = Array(maxR)
        .fill()
        .map(() => Array(maxC).fill(0));

    // create the region
    while (queue.length > 0) {
        const curr = queue.pop();
        visited[curr.r][curr.c] = ".";
        region[curr.r][curr.c] = 1;
        for (const dir of directions) {
            let r = curr.r + dir.dr;
            let c = curr.c + dir.dc;
            let v = `${r};${c}`;
            if (isInside(r, c) && char == visited[r][c] && !seen.has(v)) {
                seen.add(v);
                queue.push({ r, c });
            }
        }
    }

    seen.clear();
    seen.add(`${row};${col}`);
    queue.push({ r: row, c: col });

    let area = 0;
    let perimeter = 0;
    let sides = 0;

    // area, perimeter and sides
    while (queue.length > 0) {
        const curr = queue.pop();
        area += 1;
        const neighboors = []; // is neighbord equal to curr
        for (const dir of directions) {
            let r = curr.r + dir.dr;
            let c = curr.c + dir.dc;
            if (isInside(r, c) && region[r][c]) {
                let v = `${r};${c}`;
                if (!seen.has(v)) {
                    seen.add(v);
                    queue.push({ r, c });
                }
            } else {
                perimeter += 1;
            }
            if (isInside(r, c)) {
                neighboors.push(region[r][c] == 1);
            } else {
                neighboors.push(false);
            }
        }
        for (const dir of diagonals) {
            let r = curr.r + dir.dr;
            let c = curr.c + dir.dc;
            if (isInside(r, c)) {
                neighboors.push(region[r][c] == 1);
            } else {
                neighboors.push(false);
            }
        }
        sides += checkEdges(neighboors, curr);
    }

    return { char, area, perimeter, sides };
};

const getRegionsData = (input) => {
    let visited = [];
    for (let r = 0; r < maxR; r++) {
        visited[r] = input[r].slice();
    }

    const regDatas = [];
    for (let row = 0; row < maxR; row++) {
        for (let col = 0; col < maxC; col++) {
            if (visited[row][col] != ".") {
                regDatas.push(getRegionData(visited, row, col));
            }
        }
    }
    return regDatas;
};

const regionsData = getRegionsData(INPUT);

const partOne = () => {
    return regionsData.reduce((acc, curr) => {
        acc += curr.area * curr.perimeter;
        return acc;
    }, 0);
};

const partTwo = () => {
    return regionsData.reduce((acc, curr) => {
        acc += curr.area * curr.sides;
        return acc;
    }, 0);
};

// 1424006
const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

// 858684
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
