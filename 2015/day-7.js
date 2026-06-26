const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-7"), "utf8")
  .trim();

const BITWISE_METHODS = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NOT: (a) => ~a & 0xffff,
  LSHIFT: (a, b) => (a << b) & 0xffff,
  RSHIFT: (a, b) => a >> b,
};

const WIRES_SCHEME = new Map();
const WIRES_SIGNALS = {};

function main() {
  processInput();

  const result1 = calculateValue("a");

  resetWireSignals();

  WIRES_SIGNALS.b = result1;

  const result2 = calculateValue("a");

  console.log("Part One", result1); // Expected output: 16076
  console.log("Part Two", result2); // Expected output: 2797
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regexCommand = /[A-Z]+/g;
  const regexArguments = /[a-z0-9]+/g;
  INPUT.split("\n").forEach((line) => {
    const op = line.match(regexCommand);
    const args = line.match(regexArguments);
    const output = args.pop();

    WIRES_SCHEME.set(output, {
      arguments: args.map((arg) => (isNaN(Number(arg)) ? arg : Number(arg))),
      operation: op, // might be null, if so then it is a assignment operation
    });
  });
}

function calculateValue(wireKey) {
  if (typeof wireKey === "undefined") return undefined;
  if (typeof wireKey === "number") return wireKey;
  if (WIRES_SIGNALS[wireKey] != null) return WIRES_SIGNALS[wireKey];

  const wireData = WIRES_SCHEME.get(wireKey);

  if (!wireData.operation) {
    WIRES_SIGNALS[wireKey] = calculateValue(wireData.arguments[0]);
  } else {
    const arg0 = calculateValue(wireData.arguments[0]);
    const arg1 = calculateValue(wireData.arguments[1]);
    WIRES_SIGNALS[wireKey] = BITWISE_METHODS[wireData.operation](arg0, arg1);
  }

  return WIRES_SIGNALS[wireKey];
}

function resetWireSignals() {
  for (const wire in WIRES_SIGNALS) {
    WIRES_SIGNALS[wire] = null;
  }
}

///////////////////////////////////////////////////////////////////////////////

main();
