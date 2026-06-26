const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-14"), "utf8")
  .trim();

const TIME_LIMIT = 2503;

function main() {
  const reindeerArray = processInput(); // reindeer is both singular and plural

  const raceResults = reindeerRace(reindeerArray, TIME_LIMIT);

  const result1 = Math.max(...raceResults.map((r) => r.distance));
  const result2 = Math.max(...raceResults.map((r) => r.points));

  console.log("Part One", result1); // Expected output: 1256
  console.log("Part Two", result2); // Expected output: 1256
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regex = /(\w+).+\s(\d+).+\s(\d+).+\s(\d+)/;
  return INPUT.split("\n").map((line) => {
    const match = line.match(regex);
    const name = match[1];
    const speed = parseInt(match[2]);
    const flightTime = parseInt(match[3]);
    const cooldown = parseInt(match[4]);
    const ojb = { name, speed, flightTime, cooldown };
    return ojb;
  });
}

function reindeerRace(reindeerCollection, timeLimit) {
  // copy reindeer data to avoid mutation
  const reindeerRace = [];
  for (const reindeer of reindeerCollection) {
    reindeerRace.push({
      name: reindeer.name,
      speed: reindeer.speed,
      flightTime: reindeer.flightTime,
      cooldown: reindeer.cooldown,
      distance: 0,
      points: 0,
      isRunning: true,
      timer: reindeer.flightTime,
    });
  }

  for (let i = 0; i < timeLimit; i++) {
    for (const reindeer of reindeerRace) {
      if (reindeer.isRunning) {
        reindeer.distance += reindeer.speed;
      }
      reindeer.timer -= 1;
      if (reindeer.timer == 0) {
        reindeer.isRunning = !reindeer.isRunning;
        reindeer.timer = reindeer.isRunning
          ? reindeer.flightTime
          : reindeer.cooldown;
      }
    }

    const leadDistance = Math.max(...reindeerRace.map((r) => r.distance));
    for (const reindeer of reindeerRace) {
      if (reindeer.distance === leadDistance) {
        reindeer.points += 1;
      }
    }
  }

  return reindeerRace;
}

///////////////////////////////////////////////////////////////////////////////

main();
