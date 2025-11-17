const fs = require("fs");
const path = require("path");
const INPUT = fs.readFileSync(path.resolve(__dirname, "./input.txt"), "utf8");

const directions = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
];

function parseInput() {
    const input = INPUT.split("\r\n").map((line) => line.split(""));
    const start = {};
    const end = {};
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            const char = input[i][j];
            if ("S" == char) {
                start.r = i;
                start.c = j;
            }
            if ("E" == char) {
                end.r = i;
                end.c = j;
            }
        }
    }
    const dir = 1;
    return { grid: input, start, end, dir };
}

const data = parseInput();

function getAllPathsUtil(u, d, isVisited, localPathList, pathsList) {
    if (u.r == d.r && u.c == d.c) {
        const path = [...localPathList];
        let d = localPathList[0].d;
        let cost = 0;
        for (let i = 1; i < localPathList.length; i++) {
            if (d != localPathList[i].d) {
                d = localPathList[i].d;
                cost += 1001;
            } else {
                cost += 1;
            }
        }
        pathsList.push({ path, cost });
        return;
    }

    isVisited[u.r][u.c] = true;

    for (let i = 0; i < 4; i++) {
        const r = u.r + directions[i].dr;
        const c = u.c + directions[i].dc;
        const obj = { r, c, d: i };
        if (data.grid[r][c] == "#" || isVisited[r][c]) continue;
        localPathList.push(obj);
        getAllPathsUtil(obj, d, isVisited, localPathList, pathsList);
        localPathList.splice(localPathList.indexOf(obj), 1);
    }
    isVisited[u.r][u.c] = false;
}

function getAllPaths() {
    const paths = [];
    const { grid, start, end, dir } = data;
    const isVisited = new Array(grid.length)
        .fill()
        .map((_) => new Array(grid[0].length).fill(false));

    let pathList = [];
    pathList.push({ r: start.r, c: start.c, d: dir });

    getAllPathsUtil(start, end, isVisited, pathList, paths);

    return paths.sort((a, b) => a.cost - b.cost);
}

const paths = getAllPaths();

function partOne() {
    return paths[0].cost;
}

function partTwo() {
    const { grid } = data;
    const mincost = paths[0].cost;
    let maxInd;
    for (let i = 1; i < paths.length; i++) {
        if (paths[i].cost != mincost) {
            maxInd = i;
            break;
        }
    }

    const uniques = new Set();
    for (let i = 0; i < maxInd; i++) {
        const path = paths[i].path;
        for (const p of path) {
            uniques.add(`${p.r};${p.c}`);
            grid[p.r][p.c] = "O";
        }
    }

    console.log(grid.map((e) => e.join("")).join("\r\n"));

    return uniques.size;
}

// 93436
const firstPart = partOne();
console.log("Part One", firstPart);

// 486
const secondPart = partTwo();
console.log("Part Two", secondPart);
