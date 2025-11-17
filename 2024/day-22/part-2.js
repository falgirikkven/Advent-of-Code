const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const initialSecretNumbers = [];
const numbersToGenerate = 2000;

function main() {
    processInput();

    // 2189
    const solution = solve();
    console.log("Part Two", solution);
}

function processInput() {
    const numbers = input.split("\r\n");
    for (num of numbers) initialSecretNumbers.push(BigInt(parseInt(num)));
}

function solve() {
    const sequencesData = generateSequenceData();

    const bestOffer = getBestOffer(sequencesData);

    return bestOffer;
}

function generateSequenceData() {
    const offers = {};
    const offered = {};

    for (const secretNumber of initialSecretNumbers) {
        let lastNumber = secretNumber;
        let lastOffer = parseInt(lastNumber % BigInt(10));

        const changes = [lastOffer];

        for (let i = 0; i < numbersToGenerate; i++) {
            let newNumber = generateRandomNumber(lastNumber);
            let newOffer = parseInt(newNumber % BigInt(10));
            let change = newOffer - lastOffer;

            lastNumber = newNumber;
            lastOffer = newOffer;

            if (changes.length < 4) {
                changes.push(change);
                continue;
            }

            changes[0] = changes[1];
            changes[1] = changes[2];
            changes[2] = changes[3];
            changes[3] = change;

            let sequence = `${changes[0]},${changes[1]},${changes[2]},${changes[3]}`;

            if (offered[sequence] == secretNumber) continue;
            offered[sequence] = secretNumber;

            if (offers[sequence] == undefined) offers[sequence] = 0;
            offers[sequence] += lastOffer;
        }
    }

    return offers;
}

function generateRandomNumber(seed) {
    let curr = seed;
    let temp;

    temp = curr * BigInt(64);
    curr ^= temp;
    curr %= BigInt(16777216);
    temp = curr / BigInt(32);
    curr ^= temp;
    curr %= BigInt(16777216);
    temp = curr * BigInt(2048);
    curr ^= temp;
    curr %= BigInt(16777216);

    return curr;
}

function getBestOffer(sequencesData) {
    let bestOffer = -1;

    for (const [_, offer] of Object.entries(sequencesData)) {
        if (offer > bestOffer) bestOffer = offer;
    }

    return bestOffer;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
