import { world, system, ItemStack, EquipmentSlot } from "@minecraft/server";

const RIFT_SHARD = "riftbound:rift_shard";
const RIFTBLADE = "riftbound:riftblade";
const WOUND_PROPERTY = "riftbound:pending_wound";
const WOUND_TICKS = 20 * 15;
const SURGE_COOLDOWN_TICKS = 20 * 8;
const surgeCooldowns = new Set();

function getRiftTeam(player) {
  const tags = player.getTags();
  const teams = ["ember", "grove", "tide", "void"];
  return teams.find((team) => tags.includes(`rb_${team}`)) ?? null;
}

function awardPlayerElimination(victim, killer) {
  if (!killer || killer.typeId !== "minecraft:player" || killer.id === victim.id) return;

  const killerTeam = getRiftTeam(killer);
  const victimTeam = getRiftTeam(victim);
  if (killerTeam && victimTeam && killerTeam === victimTeam) {
    killer.sendMessage("§cلا تحصل على نقاط عند إسقاط أحد أفراد فريقك.");
    return;
  }

  try {
    let objective = world.scoreboard.getObjective("rb_score");
    if (!objective) {
      objective = world.scoreboard.addObjective("rb_score", "RIFTBOUND");
      world.scoreboard.setObjectiveAtDisplaySlot("Sidebar", { objective });
    }
    objective.addScore(killer, 1);
    killer.sendMessage("§6+1 §fنقطة إقصاء §7| §e" + (victim.name || "خصم"));
  } catch (error) {
    console.warn(`[RIFTBOUND] Could not award elimination score: ${error}`);
  }
}

// Keep Inventory protects the player's main run. A carried Rift Shard becomes
// a recoverable drop at the death site; every death also causes a brief wound.
world.afterEvents.entityDie.subscribe((event) => {
  const player = event.deadEntity;
  if (player.typeId !== "minecraft:player") return;

  awardPlayerElimination(player, event.damageSource?.damagingEntity);

  try {
    player.setDynamicProperty(WOUND_PROPERTY, true);
  } catch (error) {
    console.warn(`[RIFTBOUND] Could not record death wound: ${error}`);
  }

  try {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return;

    for (let slot = 0; slot < inventory.size; slot++) {
      const stack = inventory.getItem(slot);
      if (!stack || stack.typeId !== RIFT_SHARD) continue;

      const originalAmount = stack.amount;
      try {
        if (originalAmount > 1) {
          stack.amount = originalAmount - 1;
          inventory.setItem(slot, stack);
        } else {
          inventory.setItem(slot, undefined);
        }
        player.dimension.spawnItem(new ItemStack(RIFT_SHARD, 1), player.location);
      } catch (dropError) {
        const current = inventory.getItem(slot);
        if (current && current.typeId === RIFT_SHARD) {
          current.amount = originalAmount;
          inventory.setItem(slot, current);
        } else {
          inventory.setItem(slot, new ItemStack(RIFT_SHARD, originalAmount));
        }
        console.warn(`[RIFTBOUND] Shard recovery drop failed; inventory restored: ${dropError}`);
      }
      break;
    }
  } catch (error) {
    console.warn(`[RIFTBOUND] Death inventory handling failed: ${error}`);
  }
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (initialSpawn) return;

  system.runTimeout(() => {
    try {
      if (player.getDynamicProperty(WOUND_PROPERTY) !== true) return;
      player.setDynamicProperty(WOUND_PROPERTY, undefined);
      player.addEffect("weakness", WOUND_TICKS, {
        amplifier: 0,
        showParticles: false
      });
      player.sendMessage("§cالموت ترك أثرًا عليك. استعد قوتك قبل العودة إلى القتال.");
      player.sendMessage("§7إذا كنت تحمل شظية صدع، فستجدها في مكان سقوطك.");
    } catch (error) {
      console.warn(`[RIFTBOUND] Respawn wound could not be applied: ${error}`);
    }
  }, 1);
});

// The Riftblade grants a short burst of speed on a successful melee hit.
// An eight-second personal cooldown keeps the effect useful without spamming.
world.afterEvents.entityHitEntity.subscribe(({ damagingEntity }) => {
  const player = damagingEntity;
  if (player.typeId !== "minecraft:player") return;

  try {
    const equipment = player.getComponent("minecraft:equippable");
    const held = equipment?.getEquipment(EquipmentSlot.Mainhand);
    if (!held || held.typeId !== RIFTBLADE) return;

    const key = player.id;
    if (surgeCooldowns.has(key)) return;

    surgeCooldowns.add(key);
    player.addEffect("speed", 20 * 3, {
      amplifier: 0,
      showParticles: false
    });
    player.sendMessage("§bاندفاع الصدع!");
    system.runTimeout(() => surgeCooldowns.delete(key), SURGE_COOLDOWN_TICKS);
  } catch (error) {
    console.warn(`[RIFTBOUND] Riftblade surge failed: ${error}`);
  }
});


// RIFTBOUND progression: mining rare ores and defeating hostile creatures
// builds persistent XP. Rank rewards are granted once and survive death.
const PROGRESSION_XP = "rb_xp";
const PROGRESSION_RANK = "rb_rank";
const RANK_THRESHOLDS = [12, 35, 70, 120];
const RANK_NAMES = ["مستكشف الصدع", "صائد الشظايا", "حارس الصدع", "بطل الصدع"];
const ORE_XP = {
  "minecraft:coal_ore": 1,
  "minecraft:deepslate_coal_ore": 1,
  "minecraft:copper_ore": 1,
  "minecraft:deepslate_copper_ore": 1,
  "minecraft:iron_ore": 2,
  "minecraft:deepslate_iron_ore": 2,
  "minecraft:gold_ore": 3,
  "minecraft:deepslate_gold_ore": 3,
  "minecraft:redstone_ore": 2,
  "minecraft:lit_redstone_ore": 2,
  "minecraft:deepslate_redstone_ore": 2,
  "minecraft:lit_deepslate_redstone_ore": 2,
  "minecraft:lapis_ore": 2,
  "minecraft:deepslate_lapis_ore": 2,
  "minecraft:diamond_ore": 6,
  "minecraft:deepslate_diamond_ore": 6,
  "minecraft:emerald_ore": 6,
  "minecraft:deepslate_emerald_ore": 6,
  "minecraft:nether_quartz_ore": 1,
  "minecraft:nether_gold_ore": 2,
  "minecraft:ancient_debris": 10
};
const HOSTILE_XP = {
  "minecraft:zombie": 2,
  "minecraft:husk": 2,
  "minecraft:drowned": 2,
  "minecraft:skeleton": 2,
  "minecraft:stray": 2,
  "minecraft:spider": 2,
  "minecraft:cave_spider": 3,
  "minecraft:creeper": 3,
  "minecraft:enderman": 4,
  "minecraft:witch": 5,
  "minecraft:blaze": 4,
  "minecraft:ghast": 5,
  "minecraft:piglin_brute": 6,
  "minecraft:guardian": 5,
  "minecraft:elder_guardian": 12,
  "minecraft:ravager": 8,
  "minecraft:warden": 25,
  "minecraft:wither": 35,
  "minecraft:ender_dragon": 50
};

function getOrCreateObjective(id, displayName) {
  let objective = world.scoreboard.getObjective(id);
  if (!objective) objective = world.scoreboard.addObjective(id, displayName);
  return objective;
}

function awardProgress(player, amount, reason) {
  if (!player || player.typeId !== "minecraft:player" || amount <= 0) return;

  try {
    const xpObjective = getOrCreateObjective(PROGRESSION_XP, "Rift XP");
    const rankObjective = getOrCreateObjective(PROGRESSION_RANK, "Rift Rank");
    const totalXp = xpObjective.addScore(player, amount);
    const currentRank = rankObjective.getScore(player) ?? 0;

    let newRank = currentRank;
    while (newRank < RANK_THRESHOLDS.length && totalXp >= RANK_THRESHOLDS[newRank]) {
      newRank++;
    }
    if (newRank <= currentRank) return;

    rankObjective.setScore(player, newRank);
    const rewardCount = newRank === 4 ? 2 : 1;
    player.dimension.spawnItem(new ItemStack(RIFT_SHARD, rewardCount), player.location);

    const effects = [
      { id: "haste", duration: 20 * 20, amplifier: 0 },
      { id: "speed", duration: 20 * 20, amplifier: 0 },
      { id: "strength", duration: 20 * 15, amplifier: 0 },
      { id: "resistance", duration: 20 * 15, amplifier: 0 }
    ];
    const reward = effects[newRank - 1];
    player.addEffect(reward.id, reward.duration, {
      amplifier: reward.amplifier,
      showParticles: false
    });

    player.sendMessage("§d✦ ارتقيت إلى الرتبة " + newRank + ": " + RANK_NAMES[newRank - 1]);
    player.sendMessage("§bحصلت على " + rewardCount + " شظية صدع ومكافأة مؤقتة.");
  } catch (error) {
    console.warn(`[RIFTBOUND] Progression update failed: ${error}`);
  }
}

world.afterEvents.playerBreakBlock.subscribe((event) => {
  try {
    const blockId = event.brokenBlockPermutation.type.id;
    const amount = ORE_XP[blockId] ?? 0;
    if (amount > 0) awardProgress(event.player, amount, "mining");
  } catch (error) {
    console.warn(`[RIFTBOUND] Mining progression failed: ${error}`);
  }
});

world.afterEvents.entityDie.subscribe((event) => {
  const killer = event.damageSource?.damagingEntity;
  if (!killer || killer.typeId !== "minecraft:player") return;
  const amount = HOSTILE_XP[event.deadEntity.typeId] ?? 0;
  if (amount > 0) awardProgress(killer, amount, "combat");
});


// Teammates cannot damage one another. The before-event cancels damage before
// health is changed; players without a shared team remain free to fight.
world.beforeEvents.entityHurt.subscribe((event) => {
  const victim = event.hurtEntity;
  const attacker = event.damageSource?.damagingEntity;
  if (!victim || victim.typeId !== "minecraft:player") return;
  if (!attacker || attacker.typeId !== "minecraft:player") return;

  const victimTeam = getRiftTeam(victim);
  const attackerTeam = getRiftTeam(attacker);
  if (victimTeam && attackerTeam && victimTeam === attackerTeam) {
    event.cancel = true;
  }
});
