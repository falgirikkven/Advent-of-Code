const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

const countWinningNumbers = (card) => {
    const numbers = card
        .split(":")[1]
        .split("|")
        .map((elem) => elem.match(/(\d+)/g).map((num) => parseInt(num, 10)));
    const winningNumbers = numbers[0];
    const playerNumbers = numbers[1];
    return playerNumbers.reduce((accumulator, playerNum) => {
        let has = winningNumbers.some((winingNum) => winingNum === playerNum);
        if (has) {
            accumulator++;
        }
        return accumulator;
    }, 0);
};

const countTotalPoints = (card) => {
    let wn = countWinningNumbers(card);
    let count = 0;
    if (wn-- > 0) {
        count += 1;
        while (wn-- > 0) {
            count *= 2;
        }
    }
    return count;
};

const sumTotalPoints = (cardsArr) => {
    return cardsArr.reduce((acc, currCard) => {
        return acc + countTotalPoints(currCard);
    }, 0);
};

const countTotalScratchcards = (cardsArr) => {
    const countWiningNumArr = cardsArr.map((currCard) =>
        countWinningNumbers(currCard)
    );
    const len = countWiningNumArr.length;
    const cardsCopyArr = new Array(len).fill(1);
    countWiningNumArr.forEach((cwn, index) => {
        const start = index + 1;
        const end = start + cwn;
        const iMax = end < len ? end : len;
        const copies = cardsCopyArr[index];
        for (let i = start; i < iMax; i++) {
            cardsCopyArr[i] += copies;
        }
    });
    return cardsCopyArr.reduce((acc, curr) => acc + curr, 0);
};

const firstPart = sumTotalPoints(INPUT);
console.log("Part One", firstPart);

const secondPart = countTotalScratchcards(INPUT);
console.log("Part Two", secondPart);
