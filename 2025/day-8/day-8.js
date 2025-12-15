const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const noGroup = -1;

const processInput = () => {
  const regex = /(\d+),(\d+),(\d+)/;

  // junction boxes (jb) positions
  const jbPositions = input.split("\n").map((l) => {
    const nums = [];
    const match = l.match(regex);
    nums.push(parseInt(match[1]));
    nums.push(parseInt(match[2]));
    nums.push(parseInt(match[3]));
    return nums;
  });
  const len = jbPositions.length;

  // distance between junction-box i and junction-box j
  const jbDistances = [];
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const x = jbPositions[j][0] - jbPositions[i][0];
      const y = jbPositions[j][1] - jbPositions[i][1];
      const z = jbPositions[j][2] - jbPositions[i][2];
      const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      jbDistances.push({ id: [i, j], distance });
    }
  }
  jbDistances.sort((a, b) => a.distance - b.distance);

  return { jbPositions, jbDistances };
};

const { jbPositions, jbDistances } = processInput();

/*
console.log(jbPositions);
console.log(jbDistances);
console.log(jbDistances.length);
for (const jbd of jbDistances) {
  if (jbd.id.includes(10)) console.log(jbd);
}
*/

function partOne() {
  const groups = [];
  const tracker = Array(jbPositions.length).fill(noGroup);
  for (let i = 0; i < 10; i++) {
    const jbd = jbDistances[i];
    const id0 = jbd.id[0];
    const id1 = jbd.id[1];
    const track0 = tracker[id0];
    const track1 = tracker[id1];
    if (track0 !== noGroup && track1 !== noGroup) {
      if (track0 !== track1) {
        // Check if differents groups are from the same circuit.
        // Merge if they do
        if (track0 !== track1) {
          const oldGroup = groups[track1];
          const newGroup = groups[track0];
          const lastGroup = groups[groups.length - 1];
          oldGroup.forEach((t) => {
            tracker[t] = track0;
          });
          newGroup.push(...oldGroup);
          oldGroup.length = 0;

          lastGroup.forEach((t) => {
            tracker[t] = track1;
          });
          oldGroup.push(...lastGroup);
          groups.pop();
        }
      }
      continue;
    } else if (track0 !== noGroup) {
      groups[track0].push(id1);
      tracker[id1] = track0;
    } else if (track1 !== noGroup) {
      groups[track1].push(id0);
      tracker[id0] = track1;
    } else {
      let track = groups.length;
      tracker[id0] = track;
      tracker[id1] = track;
      groups.push([]);
      groups[track].push(id0, id1);
    }
  }

  console.log(groups);
  const sizes = groups.map((g) => g.length).sort((a, b) => b - a);
  return sizes[0] * sizes[1] * sizes[2];
}

function partTwo() {
  return 0;
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 26400

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output:
