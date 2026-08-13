const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-21"), "utf8")
  .trim();

const ROUNDS_1 = 5;
const ROUNDS_2 = 18;

function main() {
  const enhancementRules = processInput();

  const result1 = countPixels(enhancementRules, ROUNDS_1);
  const result2 = countPixels(enhancementRules, ROUNDS_2);

  console.log("Part One", result1); // Expected output: 144
  console.log("Part Two", result2); // Expected output: 2169301
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const size2 = [];
  const size3 = [];
  INPUT.split("\n").forEach((line) => {
    const tokens = line.split("=>").map((e) => e.trim());
    const input0 = tokens.shift().split("/");
    const output = tokens.shift().split("/");
    const size = input0.length;
    const where = size == 2 ? size2 : size == 3 ? size3 : undefined;
    for (const input of generateFlipsRotations(input0, size)) {
      where.push({ input, output });
    }
  });

  return { size2, size3 };
}

function generateFlipsRotations(g0, size) {
  const arr = [];
  const g1 = symmetricGrip(g0);
  const g2 = flipGrid(g1); // rot 90
  const g3 = symmetricGrip(g2);
  const g4 = flipGrid(g3); // rot 180
  const g5 = symmetricGrip(g4);
  const g6 = flipGrid(g5); // rot 270
  const g7 = symmetricGrip(g6);
  if (size == 2) arr.push(g0, g2, g4, g6);
  else arr.push(g0, g1, g2, g3, g4, g5, g6, g7);
  return arr;
}

function symmetricGrip(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = new Array(rows).fill(0).map((_) => {
    return new Array(cols).fill(null);
  });
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) newGrid[i][j] = grid[j][i];
  for (let i = 0; i < rows; i++) newGrid[i] = newGrid[i].join("");
  return newGrid;
}

function flipGrid(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = new Array(rows).fill(0).map((_) => {
    return new Array(cols).fill(null);
  });
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) newGrid[i][j] = grid[rows - i - 1][j];
  for (let i = 0; i < rows; i++) newGrid[i] = newGrid[i].join("");
  return newGrid;
}

function countPixels(enhancementRules, count) {
  const strArr = generateArt(enhancementRules, count);

  return strArr.reduce((acc1, line) => {
    acc1 += line.split("").reduce((acc2, item) => {
      if (item == "#") acc2 += 1;
      return acc2;
    }, 0);
    return acc1;
  }, 0);
}

///////////////////////////////////////////////////////////////////////////////

function generateArt(enhancementRules, rounds) {
  let state = [".#.", "..#", "###"];

  for (let i = 0; i < rounds; i++) {
    if (state.length % 2 == 0) {
      const groups = gridSplit(state, 2);
      const tGroups = transformGroups(groups, enhancementRules.size2, 2);
      state = joinGroups(tGroups, groups.length);
    } else if (state.length % 3 == 0) {
      const groups = gridSplit(state, 3);
      const tGroups = transformGroups(groups, enhancementRules.size3, 3);
      state = joinGroups(tGroups, groups.length);
    }
  }

  return state;
}

function gridSplit(grid, size) {
  const groups = [];
  const times = grid.length / size;
  for (let i = 0; i < times; i++) {
    for (let j = 0; j < times; j++) {
      const group = [];
      for (let r = 0; r < size; r++) {
        const gridInd = i * size + r;
        const gridWhere = grid[gridInd];
        const sIndStart = j * size;
        const sIndEnd = sIndStart + size;
        const str = gridWhere.slice(sIndStart, sIndEnd);
        group.push(str);
      }
      groups.push(group);
    }
  }
  return groups;
}

function transformGroups(groups, rules, size) {
  const newGroups = [];
  const rulesLen = rules.length;
  for (const group of groups) {
    let ruleIndex = findRuleIndex(group, rules, size);
    rules[ruleIndex].output.forEach((element) => {
      newGroups.push(element.slice());
    });
  }

  return newGroups;
}

function findRuleIndex(group, rules, size) {
  const rulesLen = rules.length;
  let ruleIndex = -1;
  for (let i = 0; i < rulesLen; i++) {
    let flag = true;
    for (let j = 0; j < size; j++) {
      const rule = rules[i].input;
      const rowRule = rule[j];
      const rowGroup = group[j];
      if (rowRule != rowGroup) flag = false;
    }
    if (flag) {
      ruleIndex = i;
      break;
    }
  }
  return ruleIndex;
}

function joinGroups(transformed, groupsCount) {
  const transformedLen = transformed.length;
  const groupSize = transformedLen / groupsCount;
  const groupsPerRow = Math.sqrt(groupsCount);
  const rowCount = transformedLen / groupsPerRow;
  const grid = new Array(rowCount).fill(0).map((_) => new Array());

  for (let i = 0; i < groupsCount; i++) {
    const gOffset = Math.floor(i / groupsPerRow) * groupSize;
    for (let j = 0; j < groupSize; j++) {
      const tInd = i * groupSize + j;
      const gInd = gOffset + j;
      grid[gInd].push(transformed[tInd]);
    }
  }

  return grid.map((e) => e.join(""));
}

///////////////////////////////////////////////////////////////////////////////

main();
