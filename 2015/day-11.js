const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-11"), "utf8")
  .trim();

function main() {
  const password = INPUT;

  const result1 = getNextPassword(password);
  const result2 = getNextPassword(result1);

  console.log("Part One", result1); // Expected output: hepxxyzz
  console.log("Part Two", result2); // Expected output: heqaabcc
}

///////////////////////////////////////////////////////////////////////////////

function getNextPassword(string) {
  do {
    string = incrementString(string);
  } while (!isValidPassword(string));

  return string;
}

function incrementString(string) {
  const thisChar = string.slice(-1);
  const incrementedChar =
    thisChar === "z" ? "a" : String.fromCharCode(thisChar.charCodeAt(0) + 1);
  return incrementedChar === "a"
    ? incrementString(string.slice(0, -1)) + "a"
    : string.slice(0, -1) + incrementedChar;
}

function isValidPassword(string) {
  // Double Pair
  if (!/(\w)\1.*(\w)\2/.test(string)) return false;
  // Restricted Letters
  if (/[iol]/.test(string)) return false;

  // Increasing straight of three letters
  const len = string.length - 2;
  for (let i = 0; i < len; i++) {
    const charValue = string.charCodeAt(i);
    if (
      charValue === string.charCodeAt(i + 1) - 1 &&
      charValue === string.charCodeAt(i + 2) - 2
    ) {
      return true;
    }
  }

  return false;
}

///////////////////////////////////////////////////////////////////////////////

main();
