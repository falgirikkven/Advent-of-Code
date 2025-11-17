const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n\r\n");

const rules = INPUT[0].split("\n").reduce((acc, curr) => {
    const match = curr.match(/(\d+)\|(\d+)/);
    const num1 = Number(match[1]);
    const num2 = Number(match[2]);
    let arr = acc.get(num1);
    if (arr == undefined) {
        arr = [];
        acc.set(num1, arr);
    }
    arr.push(num2);
    return acc;
}, new Map());

const orders = INPUT[1]
    .split("\n")
    .map((line) => line.match(/(\d+)/g).map((num) => Number(num)));

const isOrderValid = (order) => {
    for (let i = 1; i < order.length; i++) {
        const rule = rules.get(order[i]);
        if (!rule) continue;
        for (let j = 0; j < i; j++) {
            if (rule.includes(order[j])) {
                return false;
            }
        }
    }
    return true;
};

const arrangeOrder = (nums) => {
    const arranged = [...nums];
    do {
        for (let i = 1; i < arranged.length; i++) {
            const rule = rules.get(arranged[i]);
            if (!rule) continue;
            for (let j = 0; j < i; j++) {
                if (rule.includes(arranged[j])) {
                    let swap = arranged[i];
                    arranged[i] = arranged[j];
                    arranged[j] = swap;
                }
            }
        }
    } while (!isOrderValid(arranged));
    return arranged;
};

const results = orders.reduce(
    (acc, curr) => {
        if (isOrderValid(curr)) {
            acc[0] += curr[Math.floor(curr.length / 2)];
        } else {
            acc[1] += arrangeOrder(curr)[Math.floor(curr.length / 2)];
        }
        return acc;
    },
    [0, 0]
);

const partOne = () => {
    return results[0];
};

const partTwo = () => {
    return results[1];
};

// 5064
const firstPart = partOne();
console.log("Part One", firstPart);

// 5152
const secondPart = partTwo();
console.log("Part Two", secondPart);
