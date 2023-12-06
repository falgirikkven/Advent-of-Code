const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const PLAYPOINTS = new Map([
    ["X", 1],
    ["Y", 2],
    ["Z", 3],
]);

const OUTCOMES = new Map([
    [
        "A",
        (myPlay) => {
            if (myPlay === "X") return 3;
            if (myPlay === "Y") return 6;
            if (myPlay === "Z") return 0;
        },
    ],
    [
        "B",
        (myPlay) => {
            if (myPlay === "X") return 0;
            if (myPlay === "Y") return 3;
            if (myPlay === "Z") return 6;
        },
    ],
    [
        "C",
        (myPlay) => {
            if (myPlay === "X") return 6;
            if (myPlay === "Y") return 0;
            if (myPlay === "Z") return 3;
        },
    ],
]);

const PLAYNEEDED = new Map([
    [
        "A",
        (neededPlay) => {
            if (neededPlay == "X") return "Z";
            if (neededPlay == "Y") return "X";
            if (neededPlay == "Z") return "Y";
        },
    ],
    [
        "B",
        (neededPlay) => {
            if (neededPlay == "X") return "X";
            if (neededPlay == "Y") return "Y";
            if (neededPlay == "Z") return "Z";
        },
    ],
    [
        "C",
        (neededPlay) => {
            if (neededPlay == "X") return "Y";
            if (neededPlay == "Y") return "Z";
            if (neededPlay == "Z") return "X";
        },
    ],
]);

const getMatchScore = (match) => {
    const opponentPlay = match[0];
    const myPlay = match[1];
    const score = PLAYPOINTS.get(myPlay) + OUTCOMES.get(opponentPlay)(myPlay);
    return score;
};

const countTotalScore = (input) => {
    return input.reduce((acc, curr) => {
        const match = curr.split(" ");
        return acc + getMatchScore(match);
    }, 0);
};

// I couldn't come up with a better name
const countTotalScoreTwo = (input) => {
    return input.reduce((acc, curr) => {
        const play = curr.split(" ");
        const opponentPlay = play[0];
        const neededPlay = play[1];
        const myPlay = PLAYNEEDED.get(opponentPlay)(neededPlay);
        return acc + getMatchScore([opponentPlay, myPlay]);
    }, 0);
};

const firstPart = countTotalScore(INPUT);
console.log("Part One", firstPart);

const secondPart = countTotalScoreTwo(INPUT);
console.log("Part Two", secondPart);
