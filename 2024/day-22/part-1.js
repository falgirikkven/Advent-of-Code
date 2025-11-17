const fs = require("fs");
const path = require("path");
const input = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .trim();

const initialSecretNumbers = [];
const numbersToGenerate = 2000;

function main() {
    processInput();

    // 19927218456
    const firstPart = partOne();
    console.log("Part One", firstPart);
}

function processInput() {
    const numbers = input.split("\r\n");
    for (num of numbers) initialSecretNumbers.push(BigInt(parseInt(num)));
}

function partOne() {
    let sum = BigInt(0);

    for (secretNumber of initialSecretNumbers) {
        sum += generateRandomNumber(secretNumber);
    }

    return parseInt(sum);
}

function generateRandomNumber(seed) {
    let curr = seed;
    let temp;

    for (let i = 0; i < numbersToGenerate; i++) {
        temp = curr * BigInt(64);
        curr ^= temp;
        curr %= BigInt(16777216);

        temp = curr / BigInt(32);
        curr ^= temp;
        curr %= BigInt(16777216);

        temp = curr * BigInt(2048);
        curr ^= temp;
        curr %= BigInt(16777216);
    }

    return curr;
}

/* ************************************************************************* */

console.time("execution time");
main();
console.timeEnd("execution time");
