const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

REGEX = /(\d+)/g;

const getRaces = (input) => {
    const times = input[0].match(REGEX).map((time) => parseInt(time, 10));
    const distances = input[1].match(REGEX).map((dist) => parseInt(dist, 10));
    const races = [];
    for (let i = 0; i < times.length; i++) {
        const race = {};
        race.time = times[i];
        race.distance = distances[i];
        races.push(race);
    }
    return races;
};

const countWaysToBeatRace = (race) => {
    const t = race.time;
    const d = race.distance;
    const disc = Math.sqrt(t * t - 4 * d);
    if (isNaN(disc)) return 0;
    const tmin = Math.ceil((t - disc) / 2);
    const tmax = Math.ceil((t + disc) / 2);
    if (t % 2 === 0) {
        // even time cases
        return tmax - tmin - 1 + Math.ceil(disc - Math.trunc(disc));
    }
    return tmax - tmin; // odd time cases
};

const countWaysToBeatRecord = (input) => {
    const races = getRaces(input);
    const ways = races.map((race) => countWaysToBeatRace(race));
    // Is not expected to have 0 in the array
    return ways.reduce((acc, curr) => acc * curr, 1);
};

const unkernNumberLine = (str) => {
    return parseInt(
        str.match(REGEX).reduce((acc, curr) => acc + curr, ""),
        10
    );
};

const countWaysToBeatUnkernedRecord = (input) => {
    const race = {};
    race.time = unkernNumberLine(input[0]);
    race.distance = unkernNumberLine(input[1]);
    return countWaysToBeatRace(race);
};

const firstPart = countWaysToBeatRecord(INPUT);
console.log("Part One", firstPart);

const secondPart = countWaysToBeatUnkernedRecord(INPUT);
console.log("Part Two", secondPart);
