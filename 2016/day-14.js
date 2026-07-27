const crypto = require("node:crypto");

const INPUT = "jlmsuwbz";

const KEYS_NEEDED = 64;

// NOTE: this solution may take several minutes to finish
function main() {
  const keys1 = generateKeyIndexes(INPUT, KEYS_NEEDED);
  const keys2 = generateKeyIndexes(INPUT, KEYS_NEEDED, 2016);

  const result1 = keys1[keys1.length - 1];
  const result2 = keys2[keys2.length - 1];

  console.log("Part One", result1); // Expected output: 35186
  console.log("Part Two", result2); // Expected output: 22429
}

///////////////////////////////////////////////////////////////////////////////

function generateKeyIndexes(salt, amountRequired, extrasHashing = 0) {
  const regexThree = /(.)\1{2}/;
  const regexFive = /(.)\1{4}/;
  const keyIndexes = [];
  let candidates = [];
  let aux = [];
  let swap;

  for (let i = 0; keyIndexes.length < amountRequired; i++) {
    let hash = md5(salt + i);
    for (let j = 0; j < extrasHashing; j++) {
      hash = md5(hash);
    }
    const fMatch = hash.match(regexFive);
    if (fMatch != null) {
      const threshold = i - 1000;
      while (candidates.length > 0) {
        const top = candidates.pop();
        if (top.i < threshold) continue;
        if (top.c == fMatch[1]) keyIndexes.push(top.i);
        else aux.push(top);
      }
      swap = candidates;
      candidates = aux;
      aux = swap;
    }

    const tMatch = hash.match(regexThree);
    if (tMatch != null) {
      candidates.push({ i, c: tMatch[1] });
    }
  }

  keyIndexes.sort((a, b) => a - b);
  keyIndexes.length = amountRequired; // More keys than needed might be generated
  return keyIndexes;
}

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

///////////////////////////////////////////////////////////////////////////////

main();
