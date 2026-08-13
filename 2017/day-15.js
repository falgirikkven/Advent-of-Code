const A_START = 116;
const B_START = 299;

const GENERATION_LIM_1 = 40e6;
const GENERATION_LIM_2 = 5e6;

function main() {
  const result1 = generatorDuel(GENERATION_LIM_1);
  const result2 = generatorDuel(GENERATION_LIM_2, multipleOf4, multipleOf8);

  console.log("Part One", result1); // Expected output: 569
  console.log("Part Two", result2); // Expected output: 298
}

///////////////////////////////////////////////////////////////////////////////

function generatorDuel(rounds, conditionA = falsy, conditionB = falsy) {
  const quotient = 2147483647; // 2 ^ 31 - 1
  const factorA = 16807;
  const factorB = 48271;

  let valueA = A_START;
  let valueB = B_START;

  score = 0;
  for (let i = 0; i < rounds; i++) {
    do {
      valueA = (valueA * factorA) % quotient;
    } while (conditionA(valueA));
    do {
      valueB = (valueB * factorB) % quotient;
    } while (conditionB(valueB));
    if ((valueA & 0xffff) == (valueB & 0xffff)) score += 1;
  }

  return score;
}

// Not multiples
function multipleOf4(value) {
  return (value & 3) != 0;
}

function multipleOf8(value) {
  return (value & 7) != 0;
}

function falsy(_) {
  return false;
}

///////////////////////////////////////////////////////////////////////////////

main();
