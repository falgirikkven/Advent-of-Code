const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const REGEX_GAME = /Game (\d+)/;
const REGEX_COLOR = /(\d+) (red|green|blue)/g;
const MAPMAX = new Map([
    ["red", 12],
    ["green", 13],
    ["blue", 14],
]);

const isConfigPossible = (game) => {
    const matchs = Array.from(game.matchAll(REGEX_COLOR), (match) => [
        match[1],
        match[2],
    ]);
    return matchs.every((element) => {
        const cubes = parseInt(element[0]);
        const maxCubes = MAPMAX.get(element[1]);
        if (cubes > maxCubes) {
            return false;
        }
        return true;
    });
};

const sumIdPossibleGames = (input) => {
    return input.reduce((acc, curr) => {
        const gameId = parseInt(curr.match(REGEX_GAME)[1]);
        if (isConfigPossible(curr)) acc += gameId;
        return acc;
    }, 0);
};

const getPowerSet = (game) => {
    const minMap = new Map([
        ["red", 0],
        ["green", 0],
        ["blue", 0],
    ]);
    const matchs = Array.from(game.matchAll(REGEX_COLOR), (match) => [
        match[1],
        match[2],
    ]);
    matchs.forEach((element) => {
        const cubes = parseInt(element[0]);
        if (minMap.get(element[1]) < cubes) {
            minMap.set(element[1], cubes);
        }
    });
    return [...minMap.values()].reduce((a, b) => a * b, 1);
};

const sumPowerSets = (input) => {
    return input.reduce((acc, curr) => {
        const powerSet = getPowerSet(curr);
        return acc + powerSet;
    }, 0);
};

const firstPart = sumIdPossibleGames(INPUT);
console.log("Part One", firstPart);

const secondPart = sumPowerSets(INPUT);
console.log("Part Two", secondPart);
