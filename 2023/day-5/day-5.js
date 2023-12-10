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
        const rangesRawData = input[i].split("\n");
        rangesRawData.shift();
        const ranges = rangesRawData
            .map((set) =>
                set.match(REGEX).map((numStr) => parseInt(numStr, 10))
            )
            .map((data) => {
                const range = {};
                range.dest = parseInt(data[0], 10);
                range.start = parseInt(data[1], 10);
                range.offset = parseInt(data[2], 10);
                range.end = range.start + range.offset - 1;
                return range;
            });
        arr.push(ranges);
    }
    return arr;
};

const mapNumber = (origin, rangeSet) => {
    for (let i = 0; i < rangeSet.length; i++) {
        const range = rangeSet[i];
        const offset = origin - range.start;
        if (offset >= 0 && offset < range.offset) {
            return range.dest + offset;
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

const getSeedRangeArray = (line) => {
    const seedSet = line.match(REGEXPAIR).map((data) => {
        const matchs = data.match(REGEX);
        const range = [];
        range.push(parseInt(matchs[0], 10));
        range.push(range[0] + parseInt(matchs[1], 10) - 1);
        return range;
    });
    return seedSet;
};

const getRelationsArray = (input) => {
    const arr = [];
    for (let i = 1; i < input.length; i++) {
        const relationsRawData = input[i].split("\n");
        relationsRawData.shift();
        // Get relations from the input file
        const relations = relationsRawData
            .map((dataSet) =>
                dataSet.match(REGEX).map((numStr) => parseInt(numStr), 10)
            )
            .map((data) => {
                const relation = {};
                relation.lower = parseInt(data[1], 10);
                relation.upper = relation.lower + parseInt(data[2], 10) - 1;
                relation.shift = parseInt(data[0], 10) - relation.lower;
                return relation;
            })
            .sort((a, b) => a.lower - b.lower);
        // Fill any gap
        const filled = [];
        if (relations[0].lower != Number.NEGATIVE_INFINITY) {
            const newFiller = {};
            newFiller.lower = Number.NEGATIVE_INFINITY;
            newFiller.upper = relations[0].lower - 1;
            newFiller.shift = 0;
            filled.push(newFiller);
        }
        filled.push(relations[0]);
        for (let j = 1; j < relations.length; j++) {
            const prev = relations[j - 1];
            const curr = relations[j];
            const gap = curr.lower - prev.upper;
            if (gap > 1) {
                const newFiller = {};
                newFiller.lower = prev.upper + 1;
                newFiller.upper = curr.lower - 1;
                newFiller.shift = 0;
                filled.push(newFiller);
            }
            filled.push(curr);
        }
        let last = relations[relations.length - 1];
        if (last.upper != Number.POSITIVE_INFINITY) {
            const newFiller = {};
            newFiller.lower = last.upper + 1;
            newFiller.upper = Number.POSITIVE_INFINITY;
            newFiller.shift = 0;
            filled.push(newFiller);
        }
        // Add this parsed, sorted and filled data
        arr.push(filled);
    }

    return arr;
};

const mapRange = (range, relation) => {
    const mapped = [];
    let min = range[0];
    let max = range[1];
    for (let i = 0; i < relation.length; i++) {
        const rule = relation[i];
        if (min > rule.upper) {
            continue;
        }
        let currmax = max < rule.upper ? max : rule.upper;
        mapped.push([min + rule.shift, currmax + rule.shift]);
        min = currmax + 1;
        if (min > max) break;
    }
    return mapped;
};

const partTwo = (input) => {
    const seedRanges = getSeedRangeArray(input[0]);
    const relationsArray = getRelationsArray(input);
    let ranges = seedRanges;
    for (let i = 0; i < relationsArray.length; i++) {
        const relation = relationsArray[i];
        const newRange = ranges.reduce((acc, range) => {
            const mapped = mapRange(range, relation);
            acc.push(...mapped);
            return acc;
        }, []);
        ranges = newRange;
    }

    const sortedRantes = ranges.sort((a, b) => a[0] - b[0]);
    return sortedRantes[0][0];
};

const firstPart = lowestLocation(INPUT);
console.log("Part One", firstPart);

const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);

// This code is might be ugly but it does what it has to do without brute force
