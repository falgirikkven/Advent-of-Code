const fs = require("fs");
const path = require("path");
const INPUT = fs.readFileSync(path.resolve(__dirname, "./input.txt"), "utf8");

const countDigits = (num) => {
    let count = 0;
    while (num > 0) {
        num = Math.floor(num / 10);
        count++;
    }
    return count;
};

const cache = new Array(76).fill().map((obj) => new Map());
const blink = (n, t) => {
    let ret = cache[t].get(n);
    if (ret) {
        return ret;
    }
    if (t == 0) {
        ret = 1;
    } else if (n == 0) {
        ret = blink(1, t - 1);
    } else {
        let dc = countDigits(n);
        if (dc % 2 == 0) {
            let div = Math.pow(10, dc / 2);
            let right = Math.floor(n / div);
            let left = n % div;
            ret = blink(right, t - 1) + blink(left, t - 1);
        } else {
            ret = blink(n * 2024, t - 1);
        }
    }
    cache[t].set(n, ret);
    return ret;
};

const countAfterBlinks = (numArr, blinkCount) => {
    let count = 0;
    for (let i = 0; i < numArr.length; i++) {
        count += blink(numArr[i], blinkCount);
    }
    return count;
};

const partOne = (input) => {
    const initialStones = input.match(/(\d+)/g).map((num) => Number(num));
    return countAfterBlinks(initialStones, 25);
};

const partTwo = (input) => {
    const initialStones = input.match(/(\d+)/g).map((num) => Number(num));
    return countAfterBlinks(initialStones, 75);
};

// 213625
const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

// 252442982856820
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
