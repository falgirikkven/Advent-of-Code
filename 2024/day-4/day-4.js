const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((line) => line.trim().split(""));

const directions = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
];

const partOne = (input) => {
    const word = "XMAS".split("");
    const rowCount = input.length;
    const colCount = input[0].length;
    let count = 0;
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            if (input[i][j] != word[0]) continue;
            for (const dir of directions) {
                let valid = true;
                let x = j;
                let y = i;
                for (let k = 1; k < word.length; k++) {
                    x += dir.x;
                    y += dir.y;
                    if (
                        !(x >= 0 && x < colCount) ||
                        !(y >= 0 && y < rowCount) ||
                        input[y][x] != word[k]
                    ) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    count += 1;
                }
            }
        }
    }
    return count;
};

const partTwo = (input) => {
    const word = ["MAS", "SAM"];
    const rowLim = input.length - 2;
    const colLim = input[0].length - 2;
    let count = 0;
    for (let i = 0; i < rowLim; i++) {
        for (let j = 0; j < colLim; j++) {
            // The const are named after the numeric keypad (I had no better idea)
            const char = input[i][j];
            if (char == "M" || char == "S") {
                const mid = input[i + 1][j + 1];

                const diag1 = `${char}${mid}${input[i + 2][j + 2]}`;
                const diag2 = `${input[i + 2][j]}${mid}${input[i][j + 2]}`;
                if (word.includes(diag1) && word.includes(diag2)) {
                    count += 1;
                }
            }
        }
    }
    return count;
};

// 2646
const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

// 2000
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
