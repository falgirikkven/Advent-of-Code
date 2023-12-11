const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((line) => line.split(""));

const getWhereExpand = (input) => {
    const rowExpanded = input.reduce((acc, curr, index) => {
        if (curr.every((elem) => elem === ".")) {
            acc.push(index);
        }
        return acc;
    }, []);
    const colExpanded = [];
    for (let j = 0; j < input[0].length; j++) {
        let count = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i][j] === ".") count++;
        }
        if (count === input[0].length) {
            colExpanded.push(j + 1);
        }
    }
    return { row: rowExpanded, col: colExpanded };
};

const getGalaxyArr = (grid) => {
    return grid.reduce((acc, line, i) => {
        line.forEach((element, j) => {
            if (element === "#") {
                acc.push({ row: i, col: j });
            }
        });
        return acc;
    }, []);
};

const computeDist = (initial, final, expand, factor) => {
    if (final < initial) {
        let swap = final;
        final = initial;
        initial = swap;
    }
    let dist = 0;
    for (let i = initial + 1; i <= final; i++) {
        if (expand.includes(i)) {
            dist += factor + 1;
        } else {
            dist += 1;
        }
    }
    return dist;
};

const sumShortestDists = (grid, factor = 1) => {
    const galaxies = getGalaxyArr(grid);
    const expandeds = getWhereExpand(grid);
    const rowExpanded = expandeds.row;
    const colExpanded = expandeds.col;
    const shortestDist = [];
    const n = galaxies.length - 1;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            let drow = computeDist(
                galaxies[i].row,
                galaxies[j].row,
                rowExpanded,
                factor
            );
            let dcol = computeDist(
                galaxies[i].col,
                galaxies[j].col,
                colExpanded,
                factor
            );
            let dist = drow + dcol;
            shortestDist.push(dist);
        }
    }
    return shortestDist.reduce((acc, curr) => acc + curr, 0);
};

const firstPart = sumShortestDists(INPUT);
console.log("Part One", firstPart);

const secondPart = sumShortestDists(INPUT, 1e6 - 1);
console.log("Part Two", secondPart);
