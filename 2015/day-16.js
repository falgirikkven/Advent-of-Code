const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-16"), "utf8")
  .trim();

const TICKER_TAPE_MESSAGE = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

const REGEX_AUNT = /Sue (\d+)/;

const REGEX_ITEMS = {
  children: /children: (\d+)/,
  cats: /cats: (\d+)/,
  samoyeds: /samoyeds: (\d+)/,
  pomeranians: /pomeranians: (\d+)/,
  akitas: /akitas: (\d+)/,
  vizslas: /vizslas: (\d+)/,
  goldfish: /goldfish: (\d+)/,
  trees: /trees: (\d+)/,
  cars: /cars: (\d+)/,
  perfumes: /perfumes: (\d+)/,
};

function main() {
  const auntStuffArray = processInput();

  const result1 = searchAunt(auntStuffArray, conditionMatcher1);
  const result2 = searchAunt(auntStuffArray, conditionMatcher2);

  console.log("Part One", result1); // Expected output: 373
  console.log("Part Two", result2); // Expected output: 260
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n").reduce((acc, line) => {
    const number = parseInt(line.match(REGEX_AUNT)[1]);
    const obj = { number };

    for (const key in REGEX_ITEMS) {
      const match = line.match(REGEX_ITEMS[key]);
      const quantity = match != null ? parseInt(match[1]) : -1;
      obj[key] = quantity;
    }

    acc.push(obj);
    return acc;
  }, []);
}

function searchAunt(auntStuffArray, matching) {
  let result = -1;
  for (const aunt of auntStuffArray) {
    let flag = true;
    for (const item in TICKER_TAPE_MESSAGE) {
      const quantity = aunt[item];
      if (quantity != -1 && !matching(quantity, item)) {
        flag = false;
      }
    }
    if (flag) result = aunt.number;
  }
  return result;
}

function conditionMatcher1(quantity, item) {
  return quantity == TICKER_TAPE_MESSAGE[item];
}

function conditionMatcher2(quantity, item) {
  if (item == "cats" || item == "trees") {
    return quantity > TICKER_TAPE_MESSAGE[item];
  } else if (item == "pomeranians" || item == "goldfish") {
    return quantity < TICKER_TAPE_MESSAGE[item];
  } else {
    return quantity == TICKER_TAPE_MESSAGE[item];
  }
}

///////////////////////////////////////////////////////////////////////////////

main();
