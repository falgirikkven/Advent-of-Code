const fs = require("fs");
const path = require("path");
const INPUT = fs.readFileSync(path.resolve(__dirname, "./input.txt"), "utf8");

const directions = new Map([
    ["^", { dr: -1, dc: 0 }],
    [">", { dr: 0, dc: 1 }],
    ["v", { dr: 1, dc: 0 }],
    ["<", { dr: 0, dc: -1 }],
]);

function parseInput() {
    const input = INPUT.split("\r\n\r\n");
    const movements = input[1].split("\r\n").join("").split("");
    const grid = input[0].split("\r\n").map((line) => line.split(""));
    const loc = {};
    const grid_p2 = new Array(grid.length)
        .fill()
        .map((_) => new Array(grid[0].length * 2));
    const loc2_p2 = {};
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            let jj = j * 2;
            switch (grid[i][j]) {
                case "#":
                    grid_p2[i][jj] = "#";
                    grid_p2[i][jj + 1] = "#";
                    break;
                case "O":
                    grid_p2[i][jj] = "[";
                    grid_p2[i][jj + 1] = "]";
                    break;
                case ".":
                    grid_p2[i][jj] = ".";
                    grid_p2[i][jj + 1] = ".";
                    break;
                case "@":
                    loc.r = i;
                    loc.c = j;
                    loc2_p2.r = i;
                    loc2_p2.c = jj;
                    grid_p2[i][jj] = "@";
                    grid_p2[i][jj + 1] = ".";
                    break;
            }
        }
    }
    //console.log(grid.map((e) => e.join("")).join("\r\n"));
    //console.log(grid_p2.map((e) => e.join("")).join("\r\n"));
    return { grid, movements, loc, grid_p2, loc2_p2 };
}

const data = parseInput();

function canMoveVertically(grid, r, c, dr) {
    if (grid[r][c] == "]") c -= 1;

    const cr = r + dr;
    const lchar = grid[cr][c];
    const rchar = grid[cr][c + 1];

    if ("#" == lchar || "#" == rchar) return false;

    if ("]" == lchar || "[" == lchar) {
        if (!canMoveVertically(grid, cr, c, dr)) return false;
    }

    if ("[" == rchar) {
        if (!canMoveVertically(grid, cr, c + 1, dr)) return false;
    }

    return true;
}

function moveBoxesVertically(grid, r, c, dr) {
    if (grid[r][c] == "]") c -= 1;

    const cr = r + dr;
    const lchar = grid[cr][c];
    const rchar = grid[cr][c + 1];

    if ("]" == lchar || "[" == lchar) {
        moveBoxesVertically(grid, cr, c, dr);
    }

    if ("[" == rchar) {
        !moveBoxesVertically(grid, cr, c + 1, dr);
    }

    grid[r][c] = ".";
    grid[r][c + 1] = ".";
    grid[cr][c] = "[";
    grid[cr][c + 1] = "]";
}

function moveVertically(grid, loc, dr) {
    const { r, c } = loc;
    const cr = r + dr;
    const char = grid[cr][c];

    if ("#" == char) return;
    else if ("." == char) {
        grid[r][c] = ".";
        grid[cr][c] = "@";
        loc.r = cr;
        return;
    }

    if (!canMoveVertically(grid, cr, c, dr)) {
        return;
    }

    moveBoxesVertically(grid, cr, c, dr);

    grid[r][c] = ".";
    grid[cr][c] = "@";
    loc.r = cr;
}

function moveHorizontally(grid, loc, dc) {
    let { r, c } = loc;
    let t = 1;
    while (t) {
        const char = grid[r][c + dc * t];
        if (char == "#") {
            t = 0;
        } else if (char == "[" || char == "]") {
            t += 1;
        } else if (char == ".") {
            break;
        }
    }
    loc.c += dc * (t > 0);
    for (let i = t; i > 0; i--) {
        let j = i - 1;
        let swap = grid[r][c + dc * i];
        grid[r][c + dc * i] = grid[r][c + dc * j];
        grid[r][c + dc * j] = swap;
    }
}

function moveRobot(grid, movements, loc) {
    for (const mov of movements) {
        switch (mov) {
            case "^":
                moveVertically(grid, loc, -1);
                break;
            case ">":
                moveHorizontally(grid, loc, 1);
                break;
            case "v":
                moveVertically(grid, loc, 1);
                break;
            case "<":
                moveHorizontally(grid, loc, -1);
                break;
        }
    }
}

function partOne() {
    const { grid, movements, loc } = data;
    for (const mov of movements) {
        let { r, c } = loc;
        const { dr, dc } = directions.get(mov);
        let t = 1;
        while (t) {
            const char = grid[r + dr * t][c + dc * t];
            if (char == "#") {
                t = 0;
            } else if (char == "O") {
                t += 1;
            } else if (char == ".") {
                break;
            }
        }
        loc.r += dr * (t > 0);
        loc.c += dc * (t > 0);
        for (let i = t; i > 0; i--) {
            let j = i - 1;
            let swap = grid[r + dr * i][c + dc * i];
            grid[r + dr * i][c + dc * i] = grid[r + dr * j][c + dc * j];
            grid[r + dr * j][c + dc * j] = swap;
        }
        //console.log(
        //    `Move ${mov}:\n${grid.map((e) => e.join("")).join("\r\n")}\n`
        //);
    }

    let gpsc = 0;
    for (let i = 1; i < grid.length; i++) {
        for (let j = 1; j < grid[0].length; j++) {
            if (grid[i][j] == "O") gpsc += 100 * i + j;
        }
    }
    //console.log(`${grid.map((e) => e.join("")).join("\r\n")}\n`);
    return gpsc;
}

function partTwo() {
    const grid = data.grid_p2;
    moveRobot(grid, data.movements, data.loc2_p2);

    let gpsc = 0;
    for (let i = 1; i < grid.length; i++) {
        for (let j = 1; j < grid[0].length; j++) {
            if (grid[i][j] == "[") gpsc += 100 * i + j;
        }
    }
    return gpsc;
}

// 1577255
const firstPart = partOne();
console.log("Part One", firstPart);

// 1597035
const secondPart = partTwo();
console.log("Part Two", secondPart);
