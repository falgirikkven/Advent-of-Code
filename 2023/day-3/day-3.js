const fs = require("fs");
const path = require("path");
const { start } = require("repl");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((row) => row.split(""));

const getAdjacentSymbol = (matrix, i, j) => {
    let n = i < matrix.length - 1 ? 1 : 0;
    let m = j < matrix[i].length - 1 ? 1 : 0;
    for (let di = i > 0 ? -1 : 0; di <= n; di++) {
        for (let dj = j > 0 ? -1 : 0; dj <= m; dj++) {
            let c = matrix[i + di][j + dj];
            if ((di != 0 || dj != 0) && isNaN(c) && c !== ".") {
                return c;
            }
        }
    }
    return "";
};

const sumSchematicNumbers = (input) => {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        let symbol = "";
        let number = 0;
        for (let j = 0; j < input[i].length; j++) {
            const curr = input[i][j];
            if (isNaN(curr)) {
                sum += number * (symbol !== "");
                number = 0;
                symbol = "";
                continue;
            } else {
                number = number * 10 + parseInt(curr);
            }
            let c = getAdjacentSymbol(input, i, j);
            symbol = c !== "" ? c : symbol;
        }
        sum += number * (symbol !== "");
    }
    return sum;
};

const searchNumberAt = (matrix, i, j) => {
    if (isNaN(matrix[i][j])) {
        return undefined;
    }
    let start = j;
    let end = j;
    while (start >= 0 && !isNaN(matrix[i][start])) {
        start--;
    }
    while (end < matrix[i].length && !isNaN(matrix[i][end])) {
        end++;
    }
    number = 0;
    for (let k = start + 1; k < end; k++) {
        number = number * 10 + parseInt(matrix[i][k]);
    }
    return [number, end - j];
};

const getGearValue = (matrix, i, j) => {
    if (matrix[i][j] !== "*") return 0;
    let n = i < matrix.length - 1 ? 1 : 0;
    let m = j < matrix[i].length - 1 ? 1 : 0;
    numbers = [];
    for (let di = i > 0 ? -1 : 0; di <= n; di++) {
        for (let dj = j > 0 ? -1 : 0; dj <= m; dj++) {
            searchResult = searchNumberAt(matrix, i + di, j + dj);
            if (searchResult !== undefined) {
                dj += searchResult.pop();
                numbers.push(searchResult.pop());
            }
        }
    }
    if (numbers.length === 2) {
        return numbers[0] * numbers[1];
    }
    return 0;
};

const sumGearRatios = (input) => {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            sum += getGearValue(input, i, j);
        }
    }
    return sum;
};

const firstPart = sumSchematicNumbers(INPUT);
console.log("Part One", firstPart);

const secondPart = sumGearRatios(INPUT);
console.log("Part Two", secondPart);
