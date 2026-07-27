const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-15"), "utf8")
  .trim();

function main() {
  const discs = processInput();

  const result1 = findBestTime(discs);
  discs.push({ period: 11, offset: 0, delay: 7 });
  const result2 = findBestTime(discs);

  console.log("Part One", result1); // Expected output: 376777
  console.log("Part Two", result2); // Expected output: 3903937
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /\#(\d+).+\s(\d+)\spositions.+time=(\d+).+position\s(\d+)/;
  return INPUT.split("\n").map((line) => {
    const match = line.match(regex);
    // Since each disk number is ordered, we count that number as delay.
    const delay = parseInt(match[1]);
    const period = parseInt(match[2]);
    const ti = parseInt(match[3]); // time i
    const pi = parseInt(match[4]); // position i
    const offset = (ti + pi) % period;
    return { period, offset, delay };
  });
}

// We are looking for a number X that meets the following condition:
//
// (offset_i + delay_i + X) mod period_i = 0 (for all i)
function findBestTime(discs) {
  let time = 0;
  let period = 1;
  for (const disc of discs) {
    const period_i = disc.period;
    const offset = (disc.offset + disc.delay + time) % period_i;
    let cycles = -1;
    for (let i = 0; i < period_i; i++) {
      if ((i * period + offset) % period_i === 0) {
        cycles = i;
        break;
      }
    }
    if (cycles === -1) return Infinity;
    time += period * cycles;
    period = lcm(period, period_i);
  }

  return time;
}

const gcd = (a, b) => (a ? gcd(b % a, a) : b);
const lcm = (a, b) => (a * b) / gcd(a, b);

///////////////////////////////////////////////////////////////////////////////

main();
