const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const NO_VALUE = -1;

const processInput = (data) => {
  const splitedData = data.split("\n\n").map((p) => p.split("\n"));
  const gates = [];
  const wires = {};
  const outWires = [];

  const regex1 = /(.{3}): (\d)/;
  splitedData[0].forEach((line) => {
    const match = line.match(regex1);
    const wire = match[1];
    const value = parseInt(match[2]);
    wires[wire] = value;
  });

  const regex2 = /(.{3}) (XOR|OR|AND) (.{3}) -> (.{3})/;
  splitedData[1].forEach((elem) => {
    const match = elem.match(regex2);
    const out = match[4];
    const gate = {};
    gate.in1 = match[1];
    gate.in2 = match[3];
    gate.logic = match[2];
    gate.out = out;
    gates.push(gate);
    wires[out] = NO_VALUE;
    if (out.charAt(0) === "z") outWires.push(out);
  });
  outWires.sort();

  return { gates, wires, outWires };
};

const { gates, wires, outWires } = processInput(input);

const logicOps = new Map([
  ["AND", (v1, v2) => v1 & v2],
  ["OR", (v1, v2) => v1 | v2],
  ["XOR", (v1, v2) => v1 ^ v2],
]);

function getWireValue_dfs(wire) {
  if (wires[wire] !== NO_VALUE) {
    return wires[wire];
  }

  const gate = gates.find((elem) => elem.out === wire);

  const value1 = getWireValue_dfs(gate.in1);
  const value2 = getWireValue_dfs(gate.in2);
  const result = logicOps.get(gate.logic)(value1, value2);
  wires[wire] = result;
  return result;
}

function partOne() {
  const bits = outWires.reduce((acc, curr) => {
    acc.push(getWireValue_dfs(curr));
    return acc;
  }, []);

  let power2 = 1;
  let sum = 0;
  for (let i = 0; i < bits.length; i++) {
    sum += bits[i] * power2;
    power2 *= 2;
  }

  return sum;
}

function partTwo() {
  // To add two binary numbers we use Full-Adders (A combination logic circuit)
  // So we will check for bad gate output
  const badOuts = [];

  // In my input, I manually check the logic for my least significant bit and it
  // is fine. So we will assume it is correct.
  let carryIn = gates.find(
    (g) => (g.in1 === "x00" || g.in2 === "x00") && g.logic === "AND"
  );

  const max = outWires.length - 1;
  for (let i = 1; i < max; i++) {
    const inx = `x${String(i).padStart(2, "0")}`;
    const iny = `y${String(i).padStart(2, "0")}`;
    const out = `z${String(i).padStart(2, "0")}`;

    const ha1 = gates.filter(
      (g) =>
        (g.in1 === inx && g.in2 === iny) || (g.in1 === iny && g.in2 === inx)
    );
    const ha1xor = ha1.find((g) => g.logic === "XOR");
    const ha1and = ha1.find((g) => g.logic === "AND");
    const ha2 = gates.filter(
      (g) => g.in1 === ha1xor.out || g.in2 === ha1xor.out
    );

    if (ha2.length !== 2) {
      // ha1xor is wrong (lets asumme carryIn is correct)
      const temp = gates.filter(
        (g) => g.in1 === carryIn.out || g.in2 === carryIn.out
      );
      const newOut = temp[0].in1 !== carryIn.out ? temp[0].in1 : temp[0].in2;
      const swap = gates.find((g) => g.out === newOut);
      badOuts.push(ha1xor.out);
      badOuts.push(newOut);
      swap.out = ha1xor.out;
      ha1xor.out = newOut;
      ha2.pop();
      ha2.push(temp.pop());
      ha2.push(temp.pop());
    }
    const ha2xor = ha2.find((g) => g.logic === "XOR");

    if (ha2xor.out !== out) {
      badOuts.push(ha2xor.out);
      badOuts.push(out);
      const swap = gates.find((g) => g.out === out);
      swap.out = ha2xor.out;
      ha2xor.out = out;
    }

    carryIn = gates.find((g) => g.in1 === ha1and.out || g.in2 === ha1and.out);
  }

  return badOuts.sort().join(",");
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 55920211035878

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: btb,cmv,mwp,rdg,rmj,z17,z23,z30
