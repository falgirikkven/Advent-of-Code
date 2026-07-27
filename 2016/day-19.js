const INPUT = 3001330;

const LOG2 = Math.log(2);
const LOG3 = Math.log(3);

function main() {
  const result1 = josephus(INPUT);
  const result2 = part2(INPUT);

  console.log("Part One", result1); // Expected output: 1808357
  console.log("Part Two", result2); // Expected output: 1407007
}

///////////////////////////////////////////////////////////////////////////////

function josephus(number) {
  const exponent = Math.floor(Math.log(number) / LOG2);
  const power2 = Math.pow(2, exponent);
  const l = number - power2;
  return 2 * l + 1;
}

function part2(number) {
  const exponent = Math.floor(Math.log(number) / LOG3);
  const power3 = Math.pow(3, exponent);
  if (power3 === number) return number;
  if (number <= 2 * power3) return number - power3;
  return 2 * number - 3 * power3;
}

///////////////////////////////////////////////////////////////////////////////

main();
