const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split(",");

const computeHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
        hash *= 17;
        hash %= 256;
    }
    return hash;
};

const partOne = (input) => {
    return input.reduce((acc, curr) => acc + computeHash(curr), 0);
};

const partTwo = (input) => {
    const boxes = {};
    for (let i = 0; i < 256; i++) {
        boxes[i] = [];
    }
    input.forEach((str) => {
        const label = str.match(/\w+/)[0];
        const lens = str.match(/\d+/g);
        const hash = computeHash(label);
        const box = boxes[hash];
        let index = -1;
        for (let i = 0; i < box.length; i++) {
            if (box[i].label == label) {
                index = i;
                break;
            }
        }
        if (lens !== null) {
            if (index != -1) {
                box[index].lens = lens[0];
            } else {
                box.push({ label: label, lens: lens[0] });
            }
        } else if (index != -1) {
            box.splice(index, 1);
        }
    });
    let focusPower = 0;
    for (const [boxid, labels] of Object.entries(boxes)) {
        if (labels.length === 0) continue;
        let boxFactor = parseInt(boxid, 10) + 1;
        let lensPower = 0;
        for (let i = 0; i < labels.length; i++) {
            let slot = i + 1;
            let focal = parseInt(labels[i].lens, 10);
            lensPower += focal * slot;
        }
        focusPower += boxFactor * lensPower;
    }
    return focusPower;
};

const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
