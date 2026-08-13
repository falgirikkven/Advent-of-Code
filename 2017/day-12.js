const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-12"), "utf8")
  .trim();

function main() {
  const pipes = processInput();

  const result1 = canGoTo(pipes, 0).length;
  const result2 = countGroups(pipes);

  console.log("Part One", result1); // Expected output: 115
  console.log("Part Two", result2); // Expected output: 221
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\d+)/g;
  const lines = INPUT.split("\n");

  const pipes = lines.map((line) => {
    const match = line.match(regex).map((e) => parseInt(e));
    return match;
  });

  return pipes;
}

function canGoTo(pipes, pid) {
  const len = pipes.length;
  const success = new Array(len).fill(0);
  const seen = new Array(len).fill(0);
  const data = { pipes, seen, success, len, pid };

  success[pid] = 1;
  for (let i = 0; i < len; i++) {
    if (success[i] == 1) continue;
    canGoTo_recursion(data, i);
  }

  return success.reduce((acc, curr, ind) => {
    if (curr == 1) acc.push(ind);
    return acc;
  }, []);
}

function canGoTo_recursion(data, currentPID) {
  if (data.pid == currentPID) {
    for (let i = 0; i < data.len; i++) {
      if (data.seen[i] == 1) {
        data.success[i] = 1;
      }
    }
    return;
  }
  const pipe = data.pipes[currentPID];
  data.seen[currentPID] = 1;

  for (let i = 0; i < pipe.length; i++) {
    if (data.seen[pipe[i]] == 0) {
      canGoTo_recursion(data, pipe[i]);
    }
  }

  data.seen[currentPID] = 0;
}

function countGroups(pipes) {
  const len = pipes.length;
  const seen = new Array(len).fill(0);

  let count = 0;
  for (let i = 0; i < len; i++) {
    if (seen[i] == 0) {
      count += 1;
      const group = canGoTo(pipes, i);
      for (const pid of group) {
        seen[pid] = 1;
      }
    }
  }

  return count;
}

///////////////////////////////////////////////////////////////////////////////

main();
