const INPUT = 369;

function main() {
  const stepFowardCount = INPUT;

  const result1 = solve1(stepFowardCount);
  const result2 = solve2(stepFowardCount);

  console.log("Part One", result1); // Expected output: 1547
  console.log("Part Two", result2); // Expected output: 31154878
}

///////////////////////////////////////////////////////////////////////////////

function solve1(roundOffset) {
  const array = [0];
  let cursor = 0;

  for (let i = 1; i < 2018; i++) {
    cursor = (cursor + roundOffset + 1) % array.length;
    if (cursor == 0) {
      cursor = array.length;
      array.push(i);
    } else {
      array.splice(cursor, 0, i);
    }
  }

  const ind = (array.indexOf(2017) + 1) % array.length;
  return array[ind];
}

function solve2(roundOffset) {
  let arrayLen = 1;
  let cursor = 0;
  let value = null;

  for (let i = 1; i < 50e6; i++) {
    cursor = (cursor + roundOffset + 1) % arrayLen;
    if (cursor == 0) cursor = arrayLen;
    else if (cursor == 1) value = i;
    arrayLen += 1;
  }

  return value;
}

///////////////////////////////////////////////////////////////////////////////

main();
