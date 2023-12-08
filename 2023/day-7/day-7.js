const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\n");

// jack: "J" stands for jack (true) or joker (false)
const cardValue = (card, jack) => {
    let number = parseInt(card);
    if (isNaN(number)) {
        switch (card) {
            case "A":
                number = 14;
                break;
            case "K":
                number = 13;
                break;
            case "Q":
                number = 12;
                break;
            case "J":
                number = 11 * jack + !jack;
                break;
            case "T":
                number = 10;
                break;
            default:
                number = 0;
                break;
        }
    }
    return number;
};

// cards should be a five caracters string
const cardsType = (cards, jack) => {
    const analysis = cards.split("").reduce((acc, card) => {
        acc[card] ? acc[card]++ : (acc[card] = 1);
        return acc;
    }, {});

    const counts = Object.values(analysis);
    const len = counts.length;

    if (jack || !Object.hasOwn(analysis, "J")) {
        if (len === 1) return 7; // FIVE_OF_A_KIND
        else if (len === 2 && counts.includes(4)) return 6; // FOUR_OF_A_KIND
        else if (len === 2 && counts.includes(3)) return 5; // FULL_HOUSE
        else if (len === 3 && counts.includes(3)) return 4; // THREE_OF_A_KIND
        else if (len === 3 && counts.includes(2)) return 3; // TWO_PAIR
        else if (len === 4) return 2; // PAIR
        return 1; // HIGH_CARD
    } else {
        if (len === 2 || len === 1) {
            return 7; // FIVE_OF_A_KIND
        } else if (len === 3) {
            let nonjoker = 5 - analysis["J"];
            if (counts.includes(nonjoker - 1)) return 6; // FOUR_OF_A_KIND
            if (counts.includes(nonjoker - 2)) return 5; // FULL_HOUSE
        } else if (len === 4) {
            return 4; // THREE_OF_A_KIND
        }
        return 2; // PAIR
    }
};

// cards should be a five caracters string
const cardsLabels = (cards, jack) => {
    const labels = cards.split("").map((card) => cardValue(card, jack));
    return labels;
};

const computeHand = (str, jack) => {
    const splitted = str.split(" ");
    const hand = {};
    hand.cards = splitted[0];
    hand.wager = parseInt(splitted[1], 10);
    hand.type = cardsType(hand.cards, jack);
    hand.labels = cardsLabels(hand.cards, jack);
    return hand;
};

const compareHands = (hand1, hand2) => {
    let res = hand1.type - hand2.type;
    if (res === 0) {
        for (let i = 0; i < hand1.labels.length; i++) {
            res = hand1.labels[i] - hand2.labels[i];
            if (res !== 0) {
                break;
            }
        }
    }
    return res;
};

// jack: "J" stands for jack (true) or joker (false)
const countTotalWinnings = (input, jack) => {
    const sortedHands = input
        .map((str) => computeHand(str, jack))
        .sort((hand1, hand2) => compareHands(hand1, hand2));
    return sortedHands.reduce(
        (acc, curr, ind) => acc + curr.wager * (ind + 1),
        0
    );
};

const firstPart = countTotalWinnings(INPUT, true);
console.log("Part One", firstPart);

const secondPart = countTotalWinnings(INPUT, false);
console.log("Part Two", secondPart);