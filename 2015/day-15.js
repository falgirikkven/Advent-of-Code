const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-15"), "utf8")
  .trim();

const ATTRIBUTES = ["capacity", "durability", "flavor", "texture", "calories"];
const MAX_TEASPOONS = 100;
const CALORIES_DESIRED = 500;

const INGREDIENTS = [];
const CALORIES = [];
const ATTRIBUTES_LEN = ATTRIBUTES.length - 1; // exclude calories

let maximumScore1 = 0;
let maximumScore2 = 0;

function main() {
  processInput();

  findBestRecipe();

  const result1 = maximumScore1;
  const result2 = maximumScore2;

  console.log("Part One", result1); // Expected output: 13882464
  console.log("Part Two", result2); // Expected output: 11171160
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = createIngredientAttributesRegex(ATTRIBUTES);

  INPUT.split("\n").forEach((line) => {
    const match = line.match(regex);
    const obj = [];
    for (const [key, value] of Object.entries(match.groups)) {
      if (key != "calories") obj.push(parseInt(value));
      else CALORIES.push(parseInt(value));
    }
    INGREDIENTS.push(obj);
  });
}

function createIngredientAttributesRegex(attributes) {
  let re = ":";
  for (const attribute of attributes) {
    re = re.concat(`.+${attribute}\\s(?<${attribute}>-?\\d+)`);
  }
  return new RegExp(re);
}

function findBestRecipe() {
  maximumScore1 = 0;
  maximumScore2 = 0;

  const teaSpoons = new Array(INGREDIENTS.length).fill(0);
  for (let i = 0; i <= MAX_TEASPOONS; i++) {
    teaSpoons[0] = i;
    findBestRecipe_recursion(teaSpoons, 1, i);
  }
}

function findBestRecipe_recursion(teaSpoons, depth, accum) {
  if (depth === teaSpoons.length - 1) {
    teaSpoons[depth] = MAX_TEASPOONS - accum;
    rateCookie(teaSpoons);
    return;
  }

  for (let i = 0; i <= MAX_TEASPOONS - accum; i++) {
    teaSpoons[depth] = i;
    findBestRecipe_recursion(teaSpoons, depth + 1, i + accum);
  }
}

function rateCookie(teaSpoons) {
  const scores = new Array(ATTRIBUTES_LEN).fill(0);
  let calories = 0;
  for (let i = 0; i < teaSpoons.length; i++) {
    const quantity = teaSpoons[i];
    for (let j = 0; j < ATTRIBUTES_LEN; j++) {
      scores[j] += INGREDIENTS[i][j] * quantity;
    }
    calories += CALORIES[i] * quantity;
  }

  const score1 = scores.reduce((acc, curr) => acc * (curr > 0 ? curr : 0), 1);
  const score2 = calories == CALORIES_DESIRED ? score1 : 0;

  maximumScore1 = score1 > maximumScore1 ? score1 : maximumScore1;
  maximumScore2 = score2 > maximumScore2 ? score2 : maximumScore2;
}

///////////////////////////////////////////////////////////////////////////////

main();
