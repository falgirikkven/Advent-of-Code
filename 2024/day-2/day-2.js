const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const getReportsArray = (data) => {
    const regex = /(\d+)/g;
    return data.map((line) => line.match(regex).map((num) => Number(num)));
};

const reports = getReportsArray(INPUT);

const check = (report) => {
    let isSafe = true;
    let sgn = report[0] > report[1] ? -1 : 1;
    for (let i = 0; i < report.length - 1; i++) {
        const diff = (report[i + 1] - report[i]) * sgn;
        if (diff < 1 || diff > 3) {
            isSafe = false;
            break;
        }
    }
    return isSafe;
};

const partOne = () => {
    return reports.reduce((acc, report) => acc + check(report), 0);
};

const partTwo = () => {
    let safeCount = 0;
    for (const report of reports) {
        let isSafe = false;

        for (let i = 0; i < report.length; i++) {
            const copy = report.slice();
            copy.splice(i, 1);
            isSafe = check(copy);
            if (isSafe) {
                break;
            }
        }

        if (isSafe) safeCount++;
    }

    return safeCount;
};

// 490
const firstPart = partOne();
console.log("Part One", firstPart);

// 536
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
