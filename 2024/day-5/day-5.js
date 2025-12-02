const fs = require("node:fs");
const path = require("node:path");
const input = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const processInput = () => {
  const regex = /(\d+)/g;
  const splittedData = input.split("\n\n");
  const orderingRules = splittedData[0].split("\n").reduce((acc, curr) => {
    const match = curr.match(regex).map((e) => parseInt(e));
    const num1 = match[0];
    const num2 = match[1];
    let arr = acc.get(num1);
    if (!arr) {
      arr = [];
      acc.set(num1, arr);
    }
    arr.push(num2);
    return acc;
  }, new Map());

  const orderUpdates = splittedData[1].split("\n").reduce((acc, curr) => {
    const match = curr.match(regex).map((e) => parseInt(e));
    acc.push(match);
    return acc;
  }, []);

  return { orderingRules, orderUpdates };
};

const { orderingRules, orderUpdates } = processInput();

function isOrderValid(order) {
  for (let i = 1; i < order.length; i++) {
    const rule = orderingRules.get(order[i]);
    if (!rule) continue;

    for (let j = 0; j < i; j++) {
      if (rule.includes(order[j])) {
        return false;
      }
    }
  }
  return true;
}

const validateOrders = () => {
  const validOrders = [];
  const invalidOrders = [];
  for (const order of orderUpdates) {
    if (isOrderValid(order)) {
      validOrders.push(order);
    } else {
      invalidOrders.push(order);
    }
  }
  return { validOrders, invalidOrders };
};

const { validOrders, invalidOrders } = validateOrders();

function partOne() {
  return validOrders.reduce(
    (acc, curr) => acc + curr[Math.floor(curr.length / 2)],
    0
  );
}

function partTwo() {
  for (const invalidOrder of invalidOrders) {
    for (let i = 1; i < invalidOrder.length; i++) {
      const rule = orderingRules.get(invalidOrder[i]);
      if (!rule) continue;
      for (let j = 0; j < i; j++) {
        if (rule.includes(invalidOrder[j])) {
          const swap = invalidOrder[j];
          invalidOrder[j] = invalidOrder[i];
          invalidOrder[i] = swap;
        }
      }
    }
  }

  return invalidOrders.reduce(
    (acc, curr) => acc + curr[Math.floor(curr.length / 2)],
    0
  );
}

const firstPart = partOne();
console.log("Part One", firstPart);
// Expected output: 5064

const secondPart = partTwo();
console.log("Part Two", secondPart);
// Expected output: 5152
