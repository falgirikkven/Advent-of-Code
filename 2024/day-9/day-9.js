const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("")
    .map((num) => Number(num));

const parseDiskMap = (data) => {
    return data.flatMap((num, ind) =>
        Array(num).fill(ind % 2 === 0 ? ind / 2 : ".")
    );
};

const computeCheckSum = (diskMap) => {
    return diskMap.reduce((acc, curr, ind) => {
        return curr == "." ? acc : acc + curr * ind;
    }, 0);
};

const countAdjElem = (arr, ind) => {
    let count = 1;
    for (let j = ind + 1; arr[j] === arr[ind]; j++) count++;
    return count;
};

const partOne = (input) => {
    const diskMap = parseDiskMap(input);
    let l = 0;
    let h = diskMap.length - 1;
    while (l < h) {
        while (!isNaN(diskMap[l]) && l < h) l += 1;
        while (isNaN(diskMap[h]) && l < h) h -= 1;
        let swap = diskMap[l];
        diskMap[l] = diskMap[h];
        diskMap[h] = swap;
    }

    return computeCheckSum(diskMap);
};

const partTwo = (input) => {
    const diskMap = parseDiskMap(input);
    const topInd = Math.ceil(input.length / 2) - 1;
    for (let num = topInd; num >= 0; num--) {
        let ind = diskMap.indexOf(num);
        let len = countAdjElem(diskMap, ind);
        for (let j = 0; j < ind; j++) {
            if (diskMap[j] === "." && countAdjElem(diskMap, j) >= len) {
                diskMap.splice(ind, len, ...Array(len).fill("."));
                diskMap.splice(j, len, ...Array(len).fill(num));
                break;
            }
        }
    }
    return computeCheckSum(diskMap);
};

// 6259790630969
const firstPart = partOne(INPUT);
console.log("Part One", firstPart);

// 6289564433984
const secondPart = partTwo(INPUT);
console.log("Part Two", secondPart);
