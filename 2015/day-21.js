const WEAPONS = [
  { name: "dagger", cost: 8, damage: 4, armor: 0 },
  { name: "shortsword", cost: 10, damage: 5, armor: 0 },
  { name: "warhammer", cost: 25, damage: 6, armor: 0 },
  { name: "longsword", cost: 40, damage: 7, armor: 0 },
  { name: "greataxe", cost: 74, damage: 8, armor: 0 },
];

const ARMORS = [
  { name: "nothing", cost: 0, damage: 0, armor: 0 },
  { name: "leather", cost: 13, damage: 0, armor: 1 },
  { name: "chainmail", cost: 31, damage: 0, armor: 2 },
  { name: "splintmail", cost: 53, damage: 0, armor: 3 },
  { name: "bandedmail", cost: 75, damage: 0, armor: 4 },
  { name: "platemail", cost: 102, damage: 0, armor: 5 },
];

const RINGS = [
  { name: "nothing", cost: 0, damage: 0, armor: 0 },
  { name: "damage+1", cost: 25, damage: 1, armor: 0 },
  { name: "damage+2", cost: 50, damage: 2, armor: 0 },
  { name: "damage+3", cost: 100, damage: 3, armor: 0 },
  { name: "defense+1", cost: 20, damage: 0, armor: 1 },
  { name: "defense+2", cost: 40, damage: 0, armor: 2 },
  { name: "defense+3", cost: 80, damage: 0, armor: 3 },
];

const PLAYER_STATS = { health: 100, damage: 0, armor: 0, cost: 0 };
const BOSS_STATS = { health: 100, damage: 8, armor: 2 };

let minimumCost; // to win the fight
let maximumCost; // to lose the fight

function main() {
  calculateFightCosts();

  const result1 = minimumCost;
  const result2 = maximumCost;

  console.log("Part One", result1); // Expected output: 91
  console.log("Part Two", result2); // Expected output: 158
}

///////////////////////////////////////////////////////////////////////////////

function calculateFightCosts() {
  minimumCost = Number.MAX_SAFE_INTEGER;
  maximumCost = 0;

  const equipments = [WEAPONS, ARMORS, RINGS, RINGS];
  const len = equipments.length;
  const picks = new Array(len).fill(0);
  const data = { equipments, picks, len };

  cfc_Recursion(data, 0);

  return minimumCost;
}

function cfc_Recursion(data, depth) {
  if (depth == data.len) {
    const playerStats = cfc_getPlayerStats(data.equipments, data.picks);
    const currentCost = playerStats.cost;
    if (canPlayerBeatBoss(playerStats, BOSS_STATS)) {
      minimumCost = minimumCost < currentCost ? minimumCost : currentCost;
    } else {
      maximumCost = maximumCost > currentCost ? maximumCost : currentCost;
    }
    return;
  }

  const nd = depth + 1;
  const len = data.equipments[depth].length;

  for (let i = 0; i < len; i++) {
    data.picks[depth] = i;
    cfc_Recursion(data, nd);
  }
}

function cfc_getPlayerStats(equipments, picks) {
  const stats = { ...PLAYER_STATS };
  const len = equipments.length;
  for (let i = 0; i < len; i++) {
    const equip = equipments[i][picks[i]];
    stats.damage += equip.damage;
    stats.armor += equip.armor;
    stats.cost += equip.cost;
  }
  return stats;
}

function canPlayerBeatBoss(player, boss) {
  const playerEffectiveDamage = Math.max(boss.damage - player.armor, 1);
  const playerHitsToDie = Math.floor(player.health / playerEffectiveDamage);

  const bossEffectiveDamage = Math.max(player.damage - boss.armor, 1);
  const bossHitsToDie = Math.floor(boss.health / bossEffectiveDamage);

  return playerHitsToDie >= bossHitsToDie;
}

///////////////////////////////////////////////////////////////////////////////

main();
