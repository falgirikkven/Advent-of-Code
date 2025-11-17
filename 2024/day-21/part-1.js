const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const doorKeypad = {};
const doorSequences = new Map();
const directionalKeypad = {};
const directionalSequences = new Map();
const codes = [];

function main() {
    defineKeypads();

    createSequencesMap(doorKeypad, doorSequences, 3);

    createSequencesMap(directionalKeypad, directionalSequences, 0);

    processInput();

    // 231564
    const firstPart = partOne();
    console.log("Part One", firstPart);
}

// Where each button of the keypad is
function defineKeypads() {
    doorKeypad["7"] = { row: 0, col: 0 };
    doorKeypad["8"] = { row: 0, col: 1 };
    doorKeypad["9"] = { row: 0, col: 2 };
    doorKeypad["4"] = { row: 1, col: 0 };
    doorKeypad["5"] = { row: 1, col: 1 };
    doorKeypad["6"] = { row: 1, col: 2 };
    doorKeypad["1"] = { row: 2, col: 0 };
    doorKeypad["2"] = { row: 2, col: 1 };
    doorKeypad["3"] = { row: 2, col: 2 };
    //doorKeypad["empty"] = { row: 3, col: 0 }; // Not used
    doorKeypad["0"] = { row: 3, col: 1 };
    doorKeypad["A"] = { row: 3, col: 2 };

    //directionalKeypad["empty"] = { row: 0, col: 0 }; // Not used
    directionalKeypad["^"] = { row: 0, col: 1 };
    directionalKeypad["A"] = { row: 0, col: 2 };
    directionalKeypad["<"] = { row: 1, col: 0 };
    directionalKeypad["v"] = { row: 1, col: 1 };
    directionalKeypad[">"] = { row: 1, col: 2 };
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

function partOne() {
    let complexitiesSum = 0;

    for (const code of codes) {
        const sequence1 = getAllSequences([code], doorSequences);
        const sequence2 = getAllSequences(sequence1, directionalSequences);
        const sequence3 = getAllSequences(sequence2, directionalSequences);

        console.log(sequence2[0].length*29);

        const minimumLength = Math.min(...sequence3.map((e) => e.length));
        const codeNumber = Number(code.slice(0, -1).join(""));

        complexitiesSum += minimumLength * codeNumber;
    }

    return complexitiesSum;
}

function getAllSequences(stringArray, sequenceMap) {
    const sequences = [];

    for (const string of stringArray) {
        let stack1 = [{ sequence: "", prev: "A" }];
        let stack2 = [];
        let swap;

        for (const char of string) {
            while (stack1.length > 0) {
                const top = stack1.pop();
                const combination = sequenceMap.get(`${top.prev},${char}`);

                combination.forEach((elem) => {
                    const clone = Object.assign({}, top);
                    clone.sequence += elem;
                    clone.prev = char;
                    stack2.push(clone);
                });
            }

            swap = stack1;
            stack1 = stack2;
            stack2 = swap;
        }

        stack1.forEach((elem) => {
            sequences.push(elem.sequence);
        });
    }

    return sequences;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
