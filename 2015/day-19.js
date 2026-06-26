const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-19"), "utf8")
  .trim();

const REPLACEMENTS = [];
const REPLACEMENTS_INVERSE = [];
const ELECTRONS = [];

function main() {
  const startingMolecule = processInput();

  initializeRules();

  const result1 = countPossibleMolecules(startingMolecule);
  const result2 = reduceMolecule(startingMolecule);

  console.log("Part One", result1); // Expected output: 518
  console.log("Part Two", result2); // Expected output: 200
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("\n\n").pop();
}

function initializeRules() {
  REPLACEMENTS.length = 0;
  ELECTRONS.length = 0;
  const lines = INPUT.split("\n\n")[0].split("\n");
  for (const line of lines) {
    const data = line.split(" => ");
    if (data[0] !== "e") {
      createReplacementRule(data[0], data[1], REPLACEMENTS);
      createReplacementRule(data[1], data[0], REPLACEMENTS_INVERSE);
    } else {
      createElectonRule(data[1]);
    }
  }
}

function createReplacementRule(string1, string2, replacements) {
  const obj = {};
  obj.finderAll = new RegExp(string1, "g");
  obj.finderNext = new RegExp(string1);
  obj.replacer = string2;
  replacements.push(obj);
}

function createElectonRule(string) {
  const regexp = new RegExp(new RegExp("^" + string + "$"));
  ELECTRONS.push(regexp);
}

function countPossibleMolecules(molecule) {
  const allMolecules = new Set();
  for (const replacement of REPLACEMENTS) {
    const regex1 = replacement.finderAll;
    const regex2 = replacement.finderNext;
    const replacer = replacement.replacer;

    let match;
    while ((match = regex1.exec(molecule)) !== null) {
      const lowerHalf = molecule.slice(0, match.index);
      const upperHalf = molecule.slice(match.index).replace(regex2, replacer);
      allMolecules.add(lowerHalf + upperHalf);
    }
  }

  return allMolecules.size;
}

function reduceMolecule(molecule) {
  const data = {
    visited: new Set(),
    current: 1,
    minimum: Infinity,
  };

  reduceMolecule_dfs(molecule, data);

  return data.minimum;
}

// Depth First Search
function reduceMolecule_dfs(molecule, data) {
  if (data.visited.has(molecule) || data.minimum < Infinity) return;
  if (ELECTRONS.some((reg) => reg.test(molecule))) {
    data.minimum = data.current < data.minimum ? data.current : data.minimum;
    return;
  }

  data.visited.add(molecule);
  data.current += 1;

  for (const replacement of REPLACEMENTS_INVERSE) {
    const regex1 = replacement.finderAll;
    const regex2 = replacement.finderNext;
    const replacer = replacement.replacer;

    let match;
    while ((match = regex1.exec(molecule)) !== null) {
      const lowerHalf = molecule.slice(0, match.index);
      const upperHalf = molecule.slice(match.index).replace(regex2, replacer);
      reduceMolecule_dfs(lowerHalf + upperHalf, data);
    }
  }

  data.current -= 1;
}

///////////////////////////////////////////////////////////////////////////////

main();
