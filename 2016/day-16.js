const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-16"), "utf8")
  .trim();

const DISK_LENGTH_1 = 272;
const DISK_LENGTH_2 = 35651584;

function main() {
  const processedInput = processInput();

  const result1 = solve(processedInput, DISK_LENGTH_1);
  const result2 = solve(processedInput, DISK_LENGTH_2);

  console.log("Part One", result1); // Expected output: 10010100110011100
  console.log("Part Two", result2); // Expected output: 01100100101101100
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  return INPUT.split("").map((n) => parseInt(n));
}

// Pattern and reverse pattern are linked with a 'joint'.
// The first 15 joints are: 001001100011011.
function* dragonCurveJoint() {
  for (let i = 1; true; i++) {
    const lowestPowerOf2 = i & ~(i - 1);
    if ((lowestPowerOf2 << 1) & i) yield 1;
    else yield 0;
  }
}

// Thanks to /u/p_tseng for the idea
function solve(sequence, diskLen) {
  const reversed = sequence.map((e) => e ^ 1).reverse();
  const seqLen = sequence.length;
  const comboLen = 2 * seqLen + 2; // sequence joint reversed joint

  const chunkSize = diskLen & ~(diskLen - 1);
  const sumLen = diskLen / chunkSize;

  const jGenerator = dragonCurveJoint();

  const checkSum = [];
  const buffer = [];

  for (let i = 0; i < sumLen; i++) {
    let onesCount = 0;

    const bufferSpliceAmount = Math.min(buffer.length, chunkSize);
    const left = chunkSize - bufferSpliceAmount;
    const combosCount = Math.floor(left / comboLen);

    onesCount += spliceAndCount(buffer, bufferSpliceAmount);
    onesCount += countJoints(jGenerator, 2 * combosCount);
    onesCount += seqLen * combosCount;

    const remaining = left % comboLen;

    if (remaining > 0) {
      buffer.push(...sequence);
      buffer.push(jGenerator.next().value);
      buffer.push(...reversed);
      buffer.push(jGenerator.next().value);
      onesCount += spliceAndCount(buffer, remaining);
    }

    checkSum.push((onesCount & 1) ^ 1);
  }

  return checkSum.join("");
}

function countJoints(generator, amount) {
  let count = 0;
  for (let i = 0; i < amount; i++) {
    count += generator.next().value;
  }
  return count;
}

function spliceAndCount(arr, amount) {
  return arr.splice(0, amount).reduce((a, b) => a + b, 0);
}

///////////////////////////////////////////////////////////////////////////////

main();
