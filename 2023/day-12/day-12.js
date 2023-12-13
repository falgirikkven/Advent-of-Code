const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n")
    .map((line) => line.split(" "));

const countPossibleArrangements = (spring, arrange) => {
    const candidateArr = [];
    let damagedCount = 0;
    let questionMark = -1;
    // Arrenge for this spring
    for (let i = 0; i < spring.length; i++) {
        switch (spring[i]) {
            case "#":
                damagedCount++;
                break;
            case ".":
                if (damagedCount > 0) {
                    candidateArr.push(damagedCount);
                    damagedCount = 0;
                }
                break;
            case "?":
                questionMark = i;
                i = spring.length;
                break;
            default:
                break;
        }
    }
    if (damagedCount > 0) {
        candidateArr.push(damagedCount);
        damagedCount = 0;
    }
    // Check current arrange
    const currLenM1 = candidateArr.length - 1;
    const arrangeLenM1 = arrange.length - 1;
    // Check if the status of the arranges
    if (
        currLenM1 > arrangeLenM1 ||
        (currLenM1 < arrangeLenM1 && questionMark === -1)
    ) {
        return 0;
    }
    // Check the numbers except the last
    for (let i = 0; i < currLenM1; i++) {
        if (candidateArr[i] !== arrange[i]) return 0;
    }
    // If the length is the same then the las number must be the same
    if (currLenM1 === arrangeLenM1 && questionMark === -1) {
        if (candidateArr[currLenM1] !== arrange[arrangeLenM1]) return 0;
        else return 1;
    }

    let count = 0;
    spring[questionMark] = "#";
    count += countPossibleArrangements(spring, arrange);
    spring[questionMark] = ".";
    count += countPossibleArrangements(spring, arrange);
    spring[questionMark] = "?";

    return count;
};

const sumPossibleArrangements = (input) => {
    const counts = input.reduce((acc, curr) => {
        const spring = curr[0].split("");
        const arrange = curr[1].match(/(\d+)/g).map((elem) => parseInt(elem));
        const count = countPossibleArrangements(spring, arrange);
        acc.push(count);
        return acc;
    }, []);
    return counts.reduce((acc, curr) => acc + curr);
};

const firstPart = sumPossibleArrangements(INPUT);
console.log("Part One", firstPart);
