const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-4"), "utf8")
  .trim();

const CHAR_CODE_SPACE = 32;
const CHAR_CODE_A = 97;

const SECRET_MESSAGE = "northpole object storage";

function main() {
  const roomsData = processInput();

  const result1 = sumRoomsSectorID(roomsData);
  const result2 = getSecretID(roomsData);

  console.log("Part One", result1); // Expected output: 361724
  console.log("Part Two", result2); // Expected output: 482
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(?<encripted>.+)-(?<sectorID>\d+)\[(?<checkSum>.+)\]/;
  return INPUT.split("\n").map((l) => {
    const match = l.match(regex);
    const obj = {};
    obj.encripted = match.groups.encripted;
    obj.sectorID = parseInt(match.groups.sectorID);
    obj.checkSum = match.groups.checkSum.split("");
    return obj;
  });
}

function sumRoomsSectorID(rooms) {
  let count = 0;
  for (const room of rooms) {
    if (isValidRoom(room)) count += room.sectorID;
  }
  return count;
}

function isValidRoom(room) {
  const counts = countChars(room.encripted);
  let cursor = 0;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i][0] == room.checkSum[cursor]) {
      cursor += 1;
      if (cursor === room.checkSum.length) return true;
    }
  }

  return false;
}

function countChars(str) {
  const string = str.replaceAll("-", "").split("");
  const countMap = new Map();
  for (const token of string) {
    let value = countMap.get(token);
    if (value == null) {
      value = 0;
      countMap.set(token, 0);
    }
    countMap.set(token, value + 1);
  }

  return Array.from(countMap).sort((a, b) => {
    const dif = b[1] - a[1];
    if (dif != 0) return dif;
    return a[0].charCodeAt(0) - b[0].charCodeAt(0);
  });
}

function getSecretID(rooms) {
  for (const room of rooms) {
    const message = shiftDeciphe(room.encripted, room.sectorID);
    if (message == SECRET_MESSAGE) return room.sectorID;
  }
  return -1;
}

function shiftDeciphe(str, num) {
  const splittedStr = str.replaceAll("-", " ").split("");

  const shifted = splittedStr.reduce((acc, curr) => {
    let charCode = curr.charCodeAt(0);
    if (charCode !== CHAR_CODE_SPACE) {
      charCode = ((charCode - CHAR_CODE_A + num) % 26) + CHAR_CODE_A;
    }
    acc.push(String.fromCharCode(charCode));
    return acc;
  }, []);

  return shifted.join("");
}

///////////////////////////////////////////////////////////////////////////////

main();
