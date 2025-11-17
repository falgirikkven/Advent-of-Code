const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n\r\n")
    .map((p) => p.split("\r\n"));

const limit = 100;
const costA = 3;
const costB = 1;
const regex = /(\d+)/g;

const getGames = (input) => {
    const arr = [];
    for (const data of input) {
        const a = data[0].match(regex).map((num) => Number(num));
        const b = data[1].match(regex).map((num) => Number(num));
        const p = data[2].match(regex).map((num) => Number(num));
        arr.push({
            a: { x: a[0], y: a[1] },
            b: { x: b[0], y: b[1] },
            p: { x: p[0], y: p[1] },
        });
    }
    return arr;
};

const games = getGames(INPUT);

const partOne = () => {
    const minCosts = [];
    for (const game of games) {
        const adx = game.a.x;
        const ady = game.a.y;
        const bdx = game.b.x;
        const bdy = game.b.y;
        const px = game.p.x;
        const py = game.p.y;
        let mincost;
        const queue = [{ a: 0, b: 0 }];
        const seen = new Set();
        while (queue.length > 0) {
            const curr = queue.shift();
            let ca = curr.a;
            let cb = curr.b;
            if (px == ca * adx + cb * bdx && py == ca * ady + cb * bdy) {
                let curcost = ca * costA + cb * costB;
                if (mincost == undefined) {
                    mincost = curcost;
                } else if (curcost < mincost) {
                    mincost = curcost;
                }
                continue;
            }
            const va = `${ca + 1};${cb}`;
            if (!seen.has(va) && ca < limit) {
                seen.add(va);
                queue.push({ a: ca + 1, b: cb });
            }
            const vb = `${ca + 1};${cb + 1}`;
            if (!seen.has(vb) && cb < limit) {
                seen.add(vb);
                queue.push({ a: ca, b: cb + 1 });
            }
        }
        if (!mincost) mincost = 0;
        minCosts.push(mincost);
    }
    return minCosts.reduce((acc, cur) => acc + cur, 0);
};

const partTwo = () => {
    let minCosts = 0;
    const offset = 10000000000000;
    for (const game of games) {
        let ax = game.a.x;
        let ay = game.a.y;
        let bx = game.b.x;
        let by = game.b.y;
        let px = game.p.x + offset;
        let py = game.p.y + offset;

        const denom = ax * by - bx * ay;
        if (denom != 0) {
            const a = (px * by - bx * py) / denom;
            if (Number.isInteger(a) && a >= 0) {
                const b = (py - a * ay) / by;
                if (Number.isInteger(b) && b >= 0) {
                    minCosts += a * costA + b * costB;
                }
            }
        }
    }
    return minCosts;
};

// 34787
const firstPart = partOne();
console.log("Part One", firstPart);

// 85644161121698
const secondPart = partTwo();
console.log("Part Two", secondPart);
