function main() {
  const result1 = findLowestInteger();

  console.log("Part One", result1); // Expected output: 175
}

///////////////////////////////////////////////////////////////////////////////

function findLowestInteger() {
  let count = 0;
  for (let i = 0; i < 10000; i++) {
    if (runProgramV2(count)) return count;
    count += 1;
  }
  return null;
}

// This has function was made after a careful inspection of my input.
// SELF NOTE: Remember that jnz operations always try to tell you something.
// The simplest ones build blocks of code; the rest must be some kind of
// obfuscated operation.
function runProgramV2(a_value) {
  let d = a_value + 7 * 365;

  // Two times should be enough
  for (let i = 0; i < 2; i++) {
    let a = d;
    let expectedOutput = null;
    do {
      a = Math.floor(a / 2);
      let c = 1 + (a % 2);
      let b = 2 - c;

      // out
      if (expectedOutput == null) expectedOutput = b;
      if (expectedOutput != b) return false;
      expectedOutput ^= 1;
    } while (a !== 0);
  }

  return true;
}

function getValue(registers, x) {
  return isNaN(x) ? registers[x] : x;
}

///////////////////////////////////////////////////////////////////////////////

main();
