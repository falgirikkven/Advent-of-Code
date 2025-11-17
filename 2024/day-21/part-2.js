const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const doorKeypad = {
    7: { row: 0, col: 0 },
    8: { row: 0, col: 1 },
    9: { row: 0, col: 2 },
    4: { row: 1, col: 0 },
    5: { row: 1, col: 1 },
    6: { row: 1, col: 2 },
    1: { row: 2, col: 0 },
    2: { row: 2, col: 1 },
    3: { row: 2, col: 2 },
    0: { row: 3, col: 1 },
    A: { row: 3, col: 2 },
};

const directionalKeypad = {
    //"empty" = { row: 0, col: 0 }, // Not used
    "^": { row: 0, col: 1 },
    A: { row: 0, col: 2 },
    "<": { row: 1, col: 0 },
    v: { row: 1, col: 1 },
    ">": { row: 1, col: 2 },
};

const doorSequences = new Map();
const directionalSequences = new Map();
const codes = [];
const cache = {};

const robots = 25;

function main() {
    createSequencesMap(doorKeypad, doorSequences, 3);

    createSequencesMap(directionalKeypad, directionalSequences, 0);

    processInput();

    // 281212077733592
    const secondPart = partTwo();
    console.log("Part Two", secondPart);
}

function createSequencesMap(sourceObject, targetMap, badrow) {
    const keys = Object.entries(sourceObject);
    for (const [source, srcPos] of keys) {
        for (const [target, trgPos] of keys) {
            let deltaRow = trgPos.row - srcPos.row;
            let deltaCol = trgPos.col - srcPos.col;
            let charRow = "v";
            let charCol = ">";
            if (deltaRow < 0) {
                deltaRow = -deltaRow;
                charRow = "^";
            }
            if (deltaCol < 0) {
                deltaCol = -deltaCol;
                charCol = "<";
            }

            const sequences = [];
            let sequence;
            targetMap.set(`${source},${target}`, sequences);

            if (srcPos.row != badrow || trgPos.col != 0) {
                sequence = "A";
                for (let i = 0; i < deltaRow; i++)
                    sequence = charRow + sequence;
                for (let j = 0; j < deltaCol; j++)
                    sequence = charCol + sequence;
                sequences.push(sequence);
            }

            let b = deltaCol != 0 && deltaRow != 0;
            if ((trgPos.row != badrow || srcPos.col != 0) && b) {
                sequence = "A";
                for (let j = 0; j < deltaCol; j++)
                    sequence = charCol + sequence;
                for (let i = 0; i < deltaRow; i++)
                    sequence = charRow + sequence;
                sequences.push(sequence);
            }
        }
    }
}

function processInput() {
    const lines = input.split("\r\n");

    for (const line of lines) {
        codes.push(line.split(""));
    }
}

/* ************************************************************************* */

function partTwo() {
    let complexitiesSum = 0;

    for (const code of codes) {
        complexitiesSum += calculateComplexity(code);
    }

    return complexitiesSum;
}

function calculateComplexity(code) {
    const initialSequences = generateInitialSequences(code);

    const shortestLength = calculateShortestLength(initialSequences);

    const codeNumber = Number(code.slice(0, -1).join(""));

    return shortestLength * codeNumber;
}

function generateInitialSequences(code) {
    let sequences = [""];

    let lastButton = "A";

    for (const char of code) {
        const arr = [];

        const combinations = doorSequences.get(`${lastButton},${char}`);

        for (const combination of combinations) {
            for (const sequence of sequences) arr.push(sequence + combination);
        }

        lastButton = char;
        sequences = arr;
    }

    return sequences;
}

function calculateShortestLength(initialSequences) {
    let minimumLength = Infinity;

    for (const sequence of initialSequences) {
        const length = calculateSequenceLength(sequence);

        if (minimumLength > length) minimumLength = length;
    }

    return minimumLength;
}

function calculateSequenceLength(sequence) {
    let length = 0;

    const tokens = splitSequence(sequence);

    for (const token of tokens) length += calculateTokenLength(token, robots);

    return length;
}

function splitSequence(sequence) {
    const tokens = [];

    let token = "";

    for (const char of sequence) {
        token += char;

        if ("A" == char) {
            tokens.push(token);
            token = "";
        }
    }

    return tokens;
}

function calculateTokenLength(token, depth) {
    if (depth == 0) return token.length;
    const key = `${token};${depth}`;
    if (cache[key] != undefined) return cache[key];

    let length = 0;

    let lastButton = "A";

    for (const char of token) {
        const lengths = [];
        const combinations = directionalSequences.get(`${lastButton},${char}`);

        for (const combination of combinations)
            lengths.push(calculateTokenLength(combination, depth - 1));

        lastButton = char;
        length += Math.min(...lengths);
    }

    cache[key] = length;
    return length;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
