const fs = require("node:fs");
const path = require("node:path");
const INPUT = fs
  .readFileSync(path.resolve(__dirname, "./input"), "utf8")
  .trim();

const SPEELS = [
  {
    id: 0,
    name: "Magic Missile",
    cost: 53,
    onCast: function (self, target) {
      target.health -= 4;
      return true;
    },
  },
  {
    id: 1,
    name: "Drain",
    cost: 73,
    onCast: function (self, target) {
      self.health += 2;
      target.health -= 2;
      return true;
    },
  },
  {
    id: 2,
    name: "Shield",
    cost: 113,
    onCast: function (self, target) {
      self.armor += 7;
      return addEffect(self, this.id);
    },
    duration: 6,
    onTick: function (affected) {},
    onExpire: function (affected) {
      affected.armor -= 7;
    },
  },
  {
    id: 3,
    name: "Poison",
    cost: 173,
    onCast: function (self, target) {
      return addEffect(target, this.id);
    },
    duration: 6,
    onTick: function (affected) {
      affected.health -= 3;
    },
    onExpire: function (affected) {},
  },
  {
    id: 4,
    name: "Recharge",
    cost: 229,
    onCast: function (self, target) {
      return addEffect(self, this.id);
    },
    duration: 5,
    onTick: function (affected) {
      affected.mana += 101;
    },
    onExpire: function (affected) {},
  },
];

const BOSS_STATS = { health: 55, damage: 8, armor: 0, mana: 0 };
const PLAYER_STATS = { health: 50, damage: 0, armor: 0, mana: 500 };

// NOTE: this solution will take about several minutes to finish
// Optimization pending
// Self Note: THIS IS NOT GAME DEVELOPMENT!!!!!!!!!!!!!!!!
function main() {
  const result1 = getMimimumSpentMana();
  const result2 = getMimimumSpentMana(true);

  console.log("Part One", result1); // Expected output: 953
  console.log("Part Two", result2); // Expected output: 1289
}

///////////////////////////////////////////////////////////////////////////////

function getMimimumSpentMana(isHard = false) {
  let minimum = Infinity;

  // Breadth search
  const queue = [];
  for (const spell of SPEELS) {
    const player = createEntity(true);
    const boss = createEntity(false);
    const spellId = spell.id;
    if (isHard) player.health -= 1;
    queue.push({ player, boss, spellId, cost: 0 });
  }

  while (queue.length > 0) {
    const state = queue.shift();
    console.log(state.cost, minimum);
    if (state.cost > minimum) continue;
    const player = state.player;
    const boss = state.boss;
    const spell = SPEELS[state.spellId];
    // Player turn
    if (!spell.onCast(player, boss)) continue;
    state.cost += spell.cost;
    player.mana -= spell.cost;
    if (boss.health <= 0) {
      if (state.cost < minimum) {
        minimum = state.cost;
        continue;
      }
    }
    // Boss whole turn
    applyEffects(player);
    applyEffects(boss);
    if (boss.health <= 0) {
      if (state.cost < minimum) {
        minimum = state.cost;
        continue;
      }
    }
    player.health -= Math.max(1, boss.damage - player.armor);
    if (player.health <= 0) {
      continue;
    }
    // Player turn starts
    if (isHard) {
      player.health -= 1;
      if (player.health <= 0) continue;
    }
    applyEffects(player);
    applyEffects(boss);
    if (boss.health <= 0) {
      if (state.cost < minimum) {
        minimum = state.cost;
        continue;
      }
    }
    for (const spell of SPEELS) {
      if (player.mana < spell.cost) continue;
      const nplayer = duplicateEntity(player);
      const nboss = duplicateEntity(boss);
      const spellId = spell.id;
      queue.push({ player: nplayer, boss: nboss, spellId, cost: state.cost });
    }
  }
  return minimum;
}

function createEntity(isPLayer) {
  const obj = {};
  if (isPLayer) {
    Object.assign(obj, PLAYER_STATS);
  } else {
    Object.assign(obj, BOSS_STATS);
  }
  obj.effects = [];
  return obj;
}

function duplicateEntity(entity) {
  const obj = {};
  obj.health = entity.health;
  obj.damage = entity.damage;
  obj.armor = entity.armor;
  obj.mana = entity.mana;
  obj.effects = [];
  for (const effect of entity.effects) {
    obj.effects.push(Object.assign({}, effect));
  }
  return obj;
}

function addEffect(target, id) {
  if (target.effects.some((e) => e.id === id)) {
    return false;
  }
  const data = { id, duration: SPEELS[id].duration };
  target.effects.push(data);
  return true;
}

function applyEffects(affected) {
  const effects = affected.effects;
  for (let i = 0; i < effects.length; i++) {
    const effect = effects[i];
    SPEELS[effect.id].onTick(affected);
    effect.duration -= 1;
    if (effect.duration === 0) {
      SPEELS[effect.id].onExpire(affected);
      effects.splice(i, 1);
      i--;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////

main();
