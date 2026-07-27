const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-11"), "utf8")
  .trim();

const FLOOR_COUNT = 4;
let minimum = 0;

// NOTE: this solution may take some time to finish.
// OPTIMIZATION PENDING
function main() {
  const elementsLoc = processInput();

  countMinimumSetps(elementsLoc);
  const result1 = minimum;

  // elerium, dilithium (both generator and microchip in floor 1)
  elementsLoc.push(0, 0, 0, 0);
  countMinimumSetps(elementsLoc);
  const result2 = minimum;

  console.log("Part One", result1); // Expected output: 33
  console.log("Part Two", result2); // Expected output: 57
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regexGenerator = /(\w+)(?=\sgenerator)/g;
  const regexMicrochip = /(\w+)(?=\-compatible microchip)/g;
  const elementsMap = { count: 0 };

  const lines = INPUT.split("\n");

  for (let i = 0, elementId = 0; i < lines.length; i++) {
    addAllElements(lines[i], elementsMap, regexGenerator, "generator", i);
    addAllElements(lines[i], elementsMap, regexMicrochip, "microchip", i);
  }

  const arr = new Array(elementsMap.count * 2);
  delete elementsMap.count;

  for (const [key, value] of Object.entries(elementsMap)) {
    arr[value.id * 2] = value.generator;
    arr[value.id * 2 + 1] = value.microchip;
  }

  return arr;
}

function addAllElements(source, target, regex, type, floor) {
  const elements = [];
  const matchIterator = source.matchAll(regex);
  let match = matchIterator.next();

  while (!match.done) {
    elements.push(match.value[0]);
    match = matchIterator.next();
  }

  elements.forEach((element) => {
    if (target[element] == null) {
      target[element] = {};
      target[element].id = target.count++;
    }
    target[element][type] = floor;
  });
}

function countMinimumSetps(elementsLoc) {
  minimum = Infinity;

  const first = {};
  first.array = elementsLoc.slice();
  first.data = {
    elevator: 0,
    steps: 0,
  };

  let queue1 = [first];
  let queue2 = [];

  const cache = {};

  while (queue1.length > 0) {
    const top = queue1.pop();
    const str = countMinimumSetps_toStr(top);

    if (cache[str] != null || top.data.steps >= minimum) {
      if (queue1.length == 0) {
        //console.log("SWAPING...", queue2.length, "elements in queue");
        swap = queue1;
        queue1 = queue2;
        queue2 = swap;
      }
      continue;
    }
    cache[str] = 1;

    if (cms_endCondition(top.array)) {
      minimum = minimum < top.data.steps ? minimum : top.data.steps;
    } else {
      queue2.push(...cms_nextArray(top));
    }

    if (queue1.length == 0) {
      //console.log("SWAPING...", queue2.length, "elements in queue");
      swap = queue1;
      queue1 = queue2;
      queue2 = swap;
    }
  }
}

function countMinimumSetps_toStr(element) {
  return element.array.join(";") + `;${element.data.elevator}`;
}

function cms_nextArray(oldData) {
  const nexts = [];
  const oldArray = oldData.array;
  const elevator = oldData.data.elevator;

  const canGoUp = elevator < FLOOR_COUNT - 1;
  const canGoDown =
    elevator > 0 && oldArray.reduce((a, b) => a + (b < elevator), 0) > 0;
  for (let i = 0; i < oldArray.length; i += 2) {
    const haveiG = oldArray[i] == elevator;
    const haveiM = oldArray[i + 1] == elevator;
    if (!haveiG && !haveiM) continue;
    if (haveiG && haveiM && canGoUp) {
      nexts.push(cms_nextArray_slice(oldData, i, i + 1, 1));
    }
    if (haveiG && haveiM && canGoDown) {
      nexts.push(cms_nextArray_slice(oldData, i, i + 1, -1));
    }

    for (let j = i; j < oldArray.length; j += 2) {
      const havejG = oldArray[j] == elevator;
      const havejM = oldArray[j + 1] == elevator;
      if (!havejG && !havejM) continue;
      if (haveiG && havejG && canGoUp) {
        nexts.push(cms_nextArray_slice(oldData, i, j, 1));
      }
      if (haveiM && havejM && canGoUp) {
        nexts.push(cms_nextArray_slice(oldData, i + 1, j + 1, 1));
      }
      if (haveiG && havejG && canGoDown) {
        nexts.push(cms_nextArray_slice(oldData, i, j, -1));
      }
      if (haveiM && havejM && canGoDown) {
        nexts.push(cms_nextArray_slice(oldData, i + 1, j + 1, -1));
      }
    }
  }

  const filtered = nexts.filter((e) => {
    return cms_nextArray_isValidRow(e, elevator);
  });

  return filtered;
}

function cms_nextArray_slice(oldData, ind1, ind2, delta) {
  const newArray = oldData.array.slice();
  newArray[ind1] += delta;
  if (ind1 != ind2) newArray[ind2] += delta;
  const newData = {};
  newData.elevator = oldData.data.elevator + delta;
  newData.steps = oldData.data.steps + 1;

  return { array: newArray, data: newData };
}

function cms_nextArray_isValidRow(newElem, oldElevator) {
  const newData = newElem.data;
  const newArray = newElem.array;
  if (!cms_nextArray_isValidRow_checkFloor(newArray, oldElevator)) {
    return false;
  }

  if (!cms_nextArray_isValidRow_checkFloor(newArray, newData.elevator)) {
    return false;
  }

  return true;
}

function cms_nextArray_isValidRow_checkFloor(newArray, floor) {
  const generatorIndexes = [];
  for (let i = 0; i < newArray.length; i += 2) {
    if (newArray[i] == floor) generatorIndexes.push(i);
  }

  if (generatorIndexes.length > 0) {
    for (let i = 1; i < newArray.length; i += 2) {
      if (newArray[i] === floor && generatorIndexes.indexOf(i - 1) === -1) {
        return false;
      }
    }
  }

  return true;
}

function cms_endCondition(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== FLOOR_COUNT - 1) return false;
  }
  return true;
}

///////////////////////////////////////////////////////////////////////////////

main();
