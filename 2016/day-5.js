const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-5"), "utf8")
  .trim();

const crypto = require("node:crypto");

// NOTE: this solution may take about a minute to finish
function main() {
  const doorID = INPUT;

  const result1 = hackDoor(doorID);
  const result2 = hackDoor2(doorID);

  console.log("Part One", result1); // Expected output: 801b56a7
  console.log("Part Two", result2); // Expected output: 424a0197
}

///////////////////////////////////////////////////////////////////////////////

function hackDoor(doorID) {
  const password = [];
  const zerosStr = new Array(5).fill(0).join("");

  //console.log("password part 1 start");
  for (let i = 0, number = 0; i < 8; i++, number += 1) {
    let hash = md5(doorID + number);
    while (hash.slice(0, 5) !== zerosStr) {
      number++;
      hash = md5(doorID + number);
    }
    password.push(hash.charAt(5));
    //console.log("password part 1...", password.join(""));
  }

  //console.log("password part 1 finish");
  return password.join("");
}

function hackDoor2(doorID) {
  const password = new Array(8);
  const visited = new Array(8).fill(false);
  const zerosStr = new Array(5).fill(0).join("");

  //console.log("password part 2 start");
  for (let number = 0; true; number += 1) {
    let hash = md5(doorID + number);
    while (hash.slice(0, 5) !== zerosStr) {
      number++;
      hash = md5(doorID + number);
    }

    const position = parseInt(hash.charAt(5));
    if (isNaN(position) || !(position < 8) || visited[position]) continue;
    visited[position] = true;
    password[position] = hash.charAt(6);

    if (visited.every((e) => e)) break;
    //console.log("password part 2...", password.join(""));
  }

  //console.log("password part 2 finish");
  return password.join("");
}

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

///////////////////////////////////////////////////////////////////////////////

main();
