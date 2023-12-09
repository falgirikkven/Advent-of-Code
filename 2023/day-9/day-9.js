const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

// next=true to predict the next value, false to predict the previous
const predictValue = (sequence, next) => {
    const differentiations = [[...sequence]];
    let curr = differentiations[0];
    while (curr.length > 1 && !curr.every((num) => num === 0)) {
        const nextStep = [];
        for (let i = 0; i < curr.length - 1; i++) {
            nextStep.push(curr[i + 1] - curr[i]);
        }
        differentiations.push(nextStep);
        curr = nextStep;
    }

    if (next) {
        for (let i = differentiations.length - 2; i >= 0; i--) {
            const currArr = differentiations[i];
            const nextArr = differentiations[i + 1];
            currArr.push(
                currArr[currArr.length - 1] + nextArr[nextArr.length - 1]
            );
        }
        return differentiations[0][differentiations[0].length - 1];
    } else {
        for (let i = differentiations.length - 2; i >= 0; i--) {
            const currArr = differentiations[i];
            const nextArr = differentiations[i + 1];
            currArr.unshift(currArr[0] - nextArr[0]);
        }
        return differentiations[0][0];
    }

};

const sumExtrapolatedValues = (input, next) => {
    const sequenceArr = input
        .map((line) => line.split(" "))
        .map((numArr) => numArr.map((num) => parseInt(num, 10)));
    const predictedArr = sequenceArr.map((seq) => predictValue(seq,next));

    return predictedArr.reduce((acc, curr) => acc + curr, 0);
};

const firstPart = sumExtrapolatedValues(INPUT, true);
console.log("Part One", firstPart);

const secondPart = sumExtrapolatedValues(INPUT, false);
console.log("Part Two", secondPart);
