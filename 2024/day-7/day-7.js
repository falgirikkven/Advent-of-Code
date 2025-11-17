const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const rules = INPUT.map((line) =>
    line.match(/(\d+)/g).map((num) => Number(num))
);

const evaluateRule = (rule, concatenate = false) => {
    const result = rule[0];
    let queue1 = [];
    let queue2 = [];
    let swap;
    queue1.push(rule[1]);

    for (let i = 2; i < rule.length; i++) {
        const next = rule[i];
        while (queue1.length > 0) {
            const curr = queue1.pop();
            queue2.push(curr + next);
            queue2.push(curr * next);
            if (concatenate) queue2.push(Number(`${curr}${next}`));
        }
        swap = queue1;
        queue1 = queue2;
        queue2 = swap;
    }

    while (queue1.length > 0) {
        if (queue1.pop() == result) return result;
    }
    return 0;
};

const partOne = () => {
    return rules.reduce((acc, curr) => (acc += evaluateRule(curr)), 0);
};

const partTwo = () => {
    return rules.reduce((acc, curr) => (acc += evaluateRule(curr, true)), 0);
};

// 1260333054159
const firstPart = partOne();
console.log("Part One", firstPart);

// 162042343638683
const secondPart = partTwo();
console.log("Part Two", secondPart);
