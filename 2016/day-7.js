const { match } = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-7"), "utf8")
  .trim();

const REGEX_ABBA = /(.)(?!\1)(.)\2\1/;
const REGEX_ABA = /(.)(?!\1)(.)\1/;

function main() {
  const ipAddresses = processInput();

  const result1 = countIPsMatching(ipAddresses, doesSupportTLS);
  const result2 = countIPsMatching(ipAddresses, doesSupportSSL);

  console.log("Part One", result1); // Expected output: 115
  console.log("Part Two", result2); // Expected output: 231
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(?<outBrackets>.+?)\[(?<inBrackets>.+?)\]/;

  return INPUT.split("\n").map((line) => {
    const inBrackets = [];
    const outBrackets = [];

    let match;
    while ((match = line.match(regex))) {
      inBrackets.push(match.groups.inBrackets);
      outBrackets.push(match.groups.outBrackets);
      line = line.replace(regex, "");
    }

    if (line.length > 0) outBrackets.push(line);

    return { inBrackets, outBrackets };
  });
}

function countIPsMatching(ipList, condition) {
  let count = 0;
  for (const ip of ipList) {
    if (condition(ip)) count += 1;
  }
  return count;
}

function doesSupportTLS(ip) {
  if (ip.inBrackets.some((e) => e.match(REGEX_ABBA) != null)) return false;
  if (ip.outBrackets.every((e) => e.match(REGEX_ABBA) == null)) return false;
  return true;
}

function doesSupportSSL(ip) {
  const outerABAList = getABAList(ip.outBrackets);
  const innerABAList = getABAList(ip.inBrackets).map(reverse);
  if (outerABAList.some((o) => innerABAList.some((i) => i == o))) return true;
  return false;
}

function getABAList(strList) {
  const abas = new Set();
  for (const element of strList) {
    let str = element;
    let match;
    while ((match = str.match(REGEX_ABA))) {
      str = str.slice(match.index + 1);
      abas.add([match[1], match[2]].join(""));
    }
  }

  return [...abas];
}

function reverse(s) {
  return s.split("").reverse().join("");
}

///////////////////////////////////////////////////////////////////////////////

main();
