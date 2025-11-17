const fs = require("fs");
const path = require("path");
const INPUT = fs
    .readFileSync(path.resolve(__dirname, "./input.txt"), "utf8")
    .split("\r\n");

function parseInput() {
    const input = INPUT;
    const regex = /(\d+)/g;
    let A = Number(input[0].match(regex)[0]);
    let B = Number(input[1].match(regex)[0]);
    let C = Number(input[2].match(regex)[0]);
    const registerA = A;
    const registerB = B;
    const registerC = C;
    const program = input[4].match(regex).map((str) => Number(str));
    return { A, B, C, registerA, registerB, registerC, program };
}

const data = parseInput();

const operations = new Map([
    [0, (o) => Math.floor(data.A / Math.pow(2, combo(o)))],
    [1, (o) => data.B ^ o],
    [2, (o) => combo(o) % 8],
    [3, (o) => (data.A == 0 ? -1 : o)],
    [4, (_) => data.B ^ data.C],
    [5, (o) => combo(o) % 8],
    [6, (o) => Math.floor(data.A / Math.pow(2, combo(o)))],
    [7, (o) => Math.floor(data.A / Math.pow(2, combo(o)))],
]);

function combo(literal) {
    if (literal == 4) return data.A;
    else if (literal == 5) return data.B;
    else if (literal == 6) return data.C;
    return literal;
}

function partOne() {
    const { program } = data;
    const max = program.length - 1;
    const out = [];
    let cursor = 0;
    while (cursor < max) {
        const opcode = program[cursor];
        const operand = program[cursor + 1];
        const res = operations.get(opcode)(operand);
        if (opcode == 0) {
            data.A = res;
            cursor += 2;
        } else if (opcode == 1 || opcode == 2 || opcode == 4 || opcode == 6) {
            data.B = res;
            cursor += 2;
        } else if (opcode == 7) {
            data.C = res;
            cursor += 2;
        } else if (opcode == 5) {
            out.push(res);
            cursor += 2;
        } else if (opcode == 3) {
            if (cursor != res && res != -1) {
                cursor = res;
            } else {
                cursor += 2;
            }
        }
    }
    return out.join(",");
}

function partTwo() {
    const out = [];
    const { registerA, registerB, registerC, program } = data;
    let res = BigInt(-1);
    let char = 1;

    let b = true;
    while (b) {
        res += BigInt(1);
        let A = res;
        let B = BigInt(registerB);
        let C = BigInt(registerC);
        do {
            B = A % BigInt(8) ^ BigInt(3);
            C = A >> B;
            A = A / BigInt(8);
            B = B ^ C ^ BigInt(5);
            out.push(B % BigInt(8));
        } while (A != 0);
        if (out.at(-char) != program.at(-char)) {
            out.length = 0;
            continue;
        }
        if (out.length == program.length) break;

        res *= BigInt(8);
        char += 1;
    }
    console.log(out);
    return res;
}

// 1,5,0,5,2,0,1,3,5
//const firstPart = partOne();
//console.log("Part One", firstPart);

// TODO
const secondPart = partTwo();
console.log("Part Two", secondPart);
