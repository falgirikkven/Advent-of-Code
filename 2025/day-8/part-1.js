const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const CONNECTIONS_TO_MAKE = 1000;

function main() {
  const jbPositions = processInput(INPUT);

  const circuits = connectJunctionBoxes(jbPositions, CONNECTIONS_TO_MAKE);

  let result = multiplyLargestSizes(circuits);

  console.log("Part One", result);
  // Expected output: 26400
}

///////////////////////////////////////////////////////////////////////////////

function processInput(input) {
  const regex = /(\d+),(\d+),(\d+)/;

  // Junction boxes positions
  return input.split("\n").map((line) => {
    const coordinates = {};
    const match = line.match(regex);
    coordinates.x = parseInt(match[1]);
    coordinates.y = parseInt(match[2]);
    coordinates.z = parseInt(match[3]);
    return coordinates;
  });
}

function connectJunctionBoxes(junctionBoxes, connectionsToMake) {
  const circuits = new Array(junctionBoxes.length);
  const tracker = new Array(junctionBoxes.length);
  for (let i = 0; i < junctionBoxes.length; i++) {
    circuits[i] = [i]; // Each junction-box is a circuit
    tracker[i] = i; // Which circuit a junction-box belongs
  }
  const jbDistances = calculateJunctionBoxesDistances(junctionBoxes);

  for (let i = 0; i < connectionsToMake; i++) {
    const dist = jbDistances[i];
    const circuit1 = circuits[tracker[dist.id[0]]];
    const circuit2 = circuits[tracker[dist.id[1]]];
    if (circuit1 === circuit2) {
      continue;
    }

    // Merge circuits
    const circuit1Id = circuits.indexOf(circuit1);
    for (const jbId of circuit2) {
      tracker[jbId] = circuit1Id;
      circuit1.push(jbId);
    }
    circuit2.length = 0;
  }

  return circuits.filter((circuit) => circuit.length);
}

function calculateJunctionBoxesDistances(junctionBoxes) {
  const jbDistances = [];

  // Distance between junction-box i and junction-box j
  const len = junctionBoxes.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const x = junctionBoxes[i].x - junctionBoxes[j].x;
      const y = junctionBoxes[i].y - junctionBoxes[j].y;
      const z = junctionBoxes[i].z - junctionBoxes[j].z;
      const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      jbDistances.push({ id: [i, j], distance });
    }
  }

  jbDistances.sort((a, b) => a.distance - b.distance);
  return jbDistances;
}

function multiplyLargestSizes(circuits) {
  const sorted = circuits.sort((a, b) => b.length - a.length);
  return sorted[0].length * sorted[1].length * sorted[2].length;
}

///////////////////////////////////////////////////////////////////////////////

main();
