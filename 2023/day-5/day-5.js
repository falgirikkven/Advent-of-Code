const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n\n");

const REGEX = /(\d+)/g;
const REGEXPAIR = /\d+\s+\d+/g;

const getSeedArray = (input) => {
    const seedSet = input[0].match(REGEX);
    const arr = seedSet.map((numStr) => parseInt(numStr, 10));
    return arr;
};

const getRangeSetArray = (input) => {
    const arr = [];
    for (let i = 1; i < input.length; i++) {
        const rangeSet = input[i].split("\n");
        rangeSet.shift();
        const ranges = rangeSet.map((set) =>
            set.match(REGEX).map((numStr) => parseInt(numStr, 10))
        );
        arr.push(ranges);
    }
    return arr;
};

const mapNumber = (origin, rangeSet) => {
    for (let i = 0; i < rangeSet.length; i++) {
        let min = rangeSet[i][1];
        let max = rangeSet[i][2] + min;
        if (origin >= min && origin < max) {
            return rangeSet[i][0] + (origin - min);
        }
    }
    return origin;
};

const getLocation = (seed, rangeSetArray) => {
    let num = seed;
    for (let i = 0; i < rangeSetArray.length; i++) {
        num = mapNumber(num, rangeSetArray[i]);
    }
    return num;
};

const lowestLocation = (input) => {
    const seedArray = getSeedArray(input);
    const rangeSetArray = getRangeSetArray(input);
    const locations = seedArray
        .map((seed) => getLocation(seed, rangeSetArray))
        .sort((a, b) => a - b);
    return locations[0];
};

const firstPart = lowestLocation(INPUT);
console.log("Part One", firstPart);

// TODO PART2
//const secondPart = lowestLocation(INPUT);
//console.log("Part Two", secondPart);
