const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-7"), "utf8")
  .trim();

function main() {
  const programs = processInput();

  const tower = createTower(programs)[0];

  const result1 = tower.name;
  const result2 = fixWeight(tower);

  console.log("Part One", result1); // Expected output: ahnofa
  console.log("Part Two", result2); // Expected output: 802
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regexWord = /(\w+)/;
  const regexNum = /(\d+)/;

  const programs = INPUT.split("\n").map((line) => {
    const groups = line.split("->");
    const name = groups[0].match(regexWord)[1];
    const weight = parseInt(groups[0].match(regexNum)[1]);
    let childs = null;
    if (groups[1] != null) {
      childs = groups[1].trim().split(", ");
    }

    return { name, weight, childs };
  });

  return programs;
}

function createTower(programs) {
  const names = programs.map((e) => e.name);

  let done = [];
  const workingOn = programs.reduce((acc, curr) => {
    acc.push(curr.name);
    return acc;
  }, []);
  const workToDo = [];

  do {
    while (workingOn.length > 0) {
      const name = workingOn.pop();
      const program = programs[indexOfName(programs, name)];
      if (program.childs == null) {
        done.push({ name, weight: program.weight, childs: null });
        continue;
      }

      const childrenDone = program.childs.reduce((acc, curr) => {
        const ind = indexOfName(done, curr);
        if (ind != -1) acc.push(done[ind]);
        return acc;
      }, []);

      if (program.childs.length == childrenDone.length) {
        done = done.filter((item) => childrenDone.indexOf(item) === -1);
        done.push({ name, weight: program.weight, childs: childrenDone });
      } else {
        workToDo.push(name);
      }
    }

    workingOn.push(...workToDo.splice(0, workToDo.length));
  } while (workingOn.length > 0);

  return done;
}

function indexOfName(array, name) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name == name) return i;
  }
  return -1;
}

function fixWeight(tower) {
  const cache = {};
  fixWeight_cacheWeights(cache, tower);
  const save = fixWeight_recursion(cache, tower, undefined);

  return save;
}

function fixWeight_cacheWeights(cache, tower) {
  if (tower.childs == null) {
    cache[tower.name] = tower.weight;
    return;
  }

  let sum = 0;
  for (const child of tower.childs) {
    fixWeight_cacheWeights(cache, child);
    sum += cache[child.name];
  }

  cache[tower.name] = sum + tower.weight;
}

function fixWeight_recursion(cache, tower, oldGroupWeight) {
  const childs = tower.childs;
  if (childs == null || childs.length == 2) {
    // My input never reached this point
    return undefined;
  }

  const { distinctChild, groupWeight } = fixWeight_getDistinct(cache, childs);

  if (distinctChild != null) {
    return fixWeight_recursion(cache, distinctChild, groupWeight);
  } else {
    return oldGroupWeight - groupWeight * childs.length;
  }
}

function fixWeight_getDistinct(cache, childs) {
  const seen = {};
  childs.forEach((element) => {
    const weight = cache[element.name];
    if (seen[weight] == null) {
      seen[weight] = 1; // Unique
    } else if (seen[weight] == 1) {
      seen[weight] = 0; // Not unique
    }
  });

  let uniqueWeight = null;
  let groupWeight = null;
  for (const [weight, flagUnique] of Object.entries(seen)) {
    if (flagUnique) uniqueWeight = weight;
    else groupWeight = weight;
  }

  let distinctChild = null;
  for (let i = 0; i < childs.length; i++) {
    if (cache[childs[i].name] == uniqueWeight) {
      distinctChild = childs[i];
      break;
    }
  }

  return { distinctChild, groupWeight };
}

/*
// We asume there is one and only one root.
// This was our original part 1
function getRoot(programs) {
  const parents = programs.reduce((acc, curr) => {
    if (curr.childs) acc.push(curr);
    return acc;
  }, []);
  const pLen = parents.length;

  for (let i = 0; i < pLen; i++) {
    const pName = parents[i].name;
    let flag = true;

    for (let j = 0; j < pLen; j++) {
      if (i == j) continue;
      if (parents[j].childs.indexOf(pName) != -1) {
        flag = false;
        break;
      }
    }

    if (flag) return pName;
  }

  return null;
}
*/

///////////////////////////////////////////////////////////////////////////////

main();
