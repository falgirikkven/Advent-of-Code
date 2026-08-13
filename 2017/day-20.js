const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./inputs/day-20"), "utf8")
  .trim();

function main() {
  const particles = processInput();

  const result1 = solve1(particles);
  const result2 = solve2(particles); // Part 2 is slow, optimization pending

  console.log("Part One", result1); // Expected output: 344
  console.log("Part Two", result2); // Expected output: 404
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
  const regexVectors = /p=<(?<pos>.+)>, v=<(?<vel>.+)>, a=<(?<accel>.+)>/;

  return INPUT.split("\n").map((line, index) => {
    const match = line.match(regexVectors);
    const particle = {};
    particle.id = index;
    particle.pos = createVector(match.groups.pos);
    particle.vel = createVector(match.groups.vel);
    particle.accel = createVector(match.groups.accel);
    return particle;
  });
}

function createVector(string) {
  const regexAxis = /(?<x>-?(\d+)),(?<y>-?(\d+)),(?<z>-?(\d+))/;
  const match = string.match(regexAxis);
  const vector = {};
  vector.x = parseInt(match.groups.x);
  vector.y = parseInt(match.groups.y);
  vector.z = parseInt(match.groups.z);
  return vector;
}

function solve1(particles) {
  const time = 1e3;
  let minimum = Infinity;
  let minimumIndex = null;

  for (const particle of particles) {
    const distance = getTraveledDistance(particle, time);
    if (distance < minimum) {
      minimum = distance;
      minimumIndex = particle.id;
    }
  }

  return minimumIndex;
}

function getTraveledDistance(p, time) {
  const x = p.pos.x + p.vel.x * time + 0.5 * p.accel.x * time * time;
  const y = p.pos.y + p.vel.y * time + 0.5 * p.accel.y * time * time;
  const z = p.pos.z + p.vel.z * time + 0.5 * p.accel.z * time * time;
  return Math.abs(x) + Math.abs(y) + Math.abs(z);
}

function solve2(particles) {
  const len = particles.length;
  const destroyed = new Array(len).fill(false);
  let seen;

  for (let t = 0; t < 1e3; t++) {
    seen = {};
    for (let i = 0; i < len; i++) {
      if (destroyed[i]) continue;
      const key = particleTick(particles[i]);
      if (seen[key] == null) seen[key] = [];
      seen[key].push(i);
    }
    for (const [_, seenArr] of Object.entries(seen)) {
      if (seenArr.length > 1)
        seenArr.forEach((ind) => {
          destroyed[ind] = true;
        });
    }
  }

  return len - destroyed.reduce((a, b) => a + b, 0);
}

function particleTick(particle) {
  particle.vel.x += particle.accel.x;
  particle.vel.y += particle.accel.y;
  particle.vel.z += particle.accel.z;
  particle.pos.x += particle.vel.x;
  particle.pos.y += particle.vel.y;
  particle.pos.z += particle.vel.z;
  return `${particle.pos.x};${particle.pos.y};${particle.pos.z}`;
}

///////////////////////////////////////////////////////////////////////////////

main();
