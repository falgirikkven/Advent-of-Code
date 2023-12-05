const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n\n");

const getSortedCaloriesArray = (input) => {
    const totalCaloriesArr = input.map((caloriesStr) => {
        const caloriesArr = caloriesStr.split("\n");
        const totalCalories = caloriesArr.reduce(
            (acc, curr) => acc + parseInt(curr, 10),
            0
        );
        return totalCalories;
    });
    totalCaloriesArr.sort((a, b) => b - a);
    return totalCaloriesArr;
};

const getHighestCalories = (input) => {
    const sorted = getSortedCaloriesArray(input);
    const result = sorted[0];
    return result;
};

const getThreeHighest = (input) => {
    const sorted = getSortedCaloriesArray(input);
    const result = sorted[0] + sorted[1] + sorted[2];
    return result;
};

const firstPart = getHighestCalories(INPUT);
console.log("Part One", firstPart);

const secondPart = getThreeHighest(INPUT);
console.log("Part Two", secondPart);
