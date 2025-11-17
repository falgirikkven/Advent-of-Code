const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n");

const maxX = 101;
const maxY = 103;
const halfX = Math.floor(maxX / 2);
const halfY = Math.floor(maxY / 2);

const getRobots = (input) => {
    const robots = [];
    const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/;
    for (const line of input) {
        const match = line.match(regex);
        const robot = {};
        robot.px = Number(match[1]);
        robot.py = Number(match[2]);
        robot.vx = Number(match[3]);
        robot.vy = Number(match[4]);
        robots.push(robot);
    }
    return robots;
};

const robots = getRobots(INPUT);

const partOne = (iterations = 100) => {
    const quadrants = [0, 0, 0, 0];
    const grid = new Array(maxY).fill().map((_) => new Array(maxX).fill("."));
    const xoffset = maxX * iterations;
    const yoffset = maxY * iterations;
    for (const robot of robots) {
        let x = (robot.px + xoffset + robot.vx * iterations) % maxX;
        let y = (robot.py + yoffset + robot.vy * iterations) % maxY;
        grid[y][x] = "#";
        let where = -1;
        if (x != halfX && y != halfY) {
            if (x < halfX) {
                where = 0;
            } else if (x > halfX) {
                where = 2;
            }
            if (y > halfY) {
                where += 1;
            }
        }
        if (where != -1) {
            quadrants[where] += 1;
        }
    }

    // uncomment this line to display the grid (and see the easter egg)
    //console.log(grid.map(e => e.join('')).join('\r\n'));
    return quadrants.reduce((acc, curr) => (acc *= curr), 1);
};

const partTwo = () => {
    let low = 229632480;
    let it = 100;
    for (let i = 0; i < 1e4; i++) {
        let p1 = partOne(i);
        if (p1 < low) {
            it = i;
            low = p1;
        }
    }
    return it;
};

// 229632480
const firstPart = partOne();
console.log("Part One", firstPart);

// 7051
const secondPart = partTwo();
console.log("Part Two", secondPart);
