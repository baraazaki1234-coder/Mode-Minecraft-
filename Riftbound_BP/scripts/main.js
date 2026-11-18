import { world, system, ItemStack, EquipmentSlot, InputPermissionCategory } from "@minecraft/server";

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
    if (killerTeam) {
      const warObjective = getOrCreateObjective(`rb_war_${killerTeam}`, `War ${killerTeam}`);
      const factionScore = warObjective.addScore("team", 2);
      killer.sendMessage("§c⚔ +2 نقاط حرب لفريقك §7| إجمالي الفريق: " + factionScore);
      world.sendMessage(`§c⚔ ${killer.name} حقق إقصاءً لفريق ${killerTeam}. نقاط الحرب: ${factionScore}`);
    }
    try {
      const streak = getOrCreateObjective("rb_streak", "Rift Streak");
      const next = streak.addScore(killer, 1);
      streak.setScore(victim, 0);
      if (next >= 3) killer.sendMessage("§6سلسلة قتالية: " + next + " إقصاءات!");
    } catch (error) {
      console.warn(`[RIFTBOUND] War streak update failed: ${error}`);
    }
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
  "minecraft:ender_dragon": 50,
  "riftbound:ironback": 5,
  "riftbound:glassfang": 4,
  "riftbound:skitter": 3,
  "riftbound:colossus": 30,
  "riftbound:hollowmaw": 8,
  "riftbound:gloommite": 2,
  "riftbound:thornprowler": 6
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
    const ranksEarned = newRank - currentRank;
    const rewardCount = ranksEarned + (newRank === 4 ? 1 : 0);
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
    if (ranksEarned > 1) player.sendMessage("§7تجاوزت " + ranksEarned + " رتب دفعة واحدة.");
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
  if (amount > 0) {
    awardProgress(killer, amount, "combat");
    const killerTeam = getRiftTeam(killer);
    if (killerTeam) {
      for (const ally of world.getPlayers()) {
        if (ally.id === killer.id || getRiftTeam(ally) !== killerTeam) continue;
        if (ally.dimension.id !== killer.dimension.id) continue;
        const dx = ally.location.x - event.deadEntity.location.x;
        const dy = ally.location.y - event.deadEntity.location.y;
        const dz = ally.location.z - event.deadEntity.location.z;
        if (dx * dx + dy * dy + dz * dz <= 12 * 12) {
          awardProgress(ally, 1, "team_assist");
          ally.sendMessage("§a+1 خبرة تعاون §7| مساندة فريقك في إسقاط عدو.");
        }
      }
    }
  }
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


// Nearby squad members provide a short defensive response when a teammate is hurt.
const squadSupportCooldowns = new Map();
world.afterEvents.entityHurt.subscribe(({ hurtEntity }) => {
  if (hurtEntity.typeId !== "minecraft:player") return;
  const team = getRiftTeam(hurtEntity);
  if (!team) return;
  const now = system.currentTick;
  if (now - (squadSupportCooldowns.get(hurtEntity.id) ?? -100000) < 20 * 10) return;
  const nearbyAllies = world.getPlayers().filter((ally) => {
    if (ally.id === hurtEntity.id || getRiftTeam(ally) !== team) return false;
    if (ally.dimension.id !== hurtEntity.dimension.id) return false;
    const dx = ally.location.x - hurtEntity.location.x;
    const dy = ally.location.y - hurtEntity.location.y;
    const dz = ally.location.z - hurtEntity.location.z;
    return dx * dx + dy * dy + dz * dz <= 8 * 8;
  });
  if (!nearbyAllies.length) return;
  squadSupportCooldowns.set(hurtEntity.id, now);
  try {
    hurtEntity.addEffect("resistance", 40, { amplifier: 0, showParticles: false });
    for (const ally of nearbyAllies) {
      ally.addEffect("speed", 40, { amplifier: 0, showParticles: false });
      ally.sendMessage("§aمساندة ناجحة! زميلك يتعرض للهجوم؛ تحرك لمساعدته.");
    }
    hurtEntity.sendMessage("§bتكاتف الفريق! تلقيت حماية قصيرة بوجود حليف قريب.");
  } catch (error) {
    console.warn(`[RIFTBOUND] Squad support effect failed: ${error}`);
  }
});

// First-entry cinematic. Bedrock's stable input-permission API can lock
// movement and camera during the sequence; interaction buttons are not exposed
// as a lockable category, so the script does not claim to disable every action.
const INTRO_SEEN_TAG = "rb_intro_seen";
const INTRO_LOCK_TAG = "rb_intro_lock";
const introPermissionStates = new Map();
const INTRO_LINES = [
  "هل لازم تثق في فريقك؟ ولا ممكن يغدروا بيك أول ما تيجي الفرصة؟",
  "في العالم ده، القوة مش دايمًا في الحجم...",
  "ممكن وحش ضخم يخليك تفكر ألف مرة قبل ما تقرب.",
  "وممكن مخلوق صغير تستهين بيه... ويكون آخر حاجة تتوقعها.",
  "لا تستهين بأي وحش، مهما كان صغيرًا أو بدا ضعيفًا.",
  "راقب حركته، افهم طريقته، واختار وقت المواجهة.",
  "خليك مستعد... لأن الصدع لا يرحم الغافلين."
];

function setIntroInputLock(player, locked) {
  try {
    if (locked) {
      if (!introPermissionStates.has(player.id)) {
        introPermissionStates.set(player.id, {
          movement: player.inputPermissions.isPermissionCategoryEnabled(InputPermissionCategory.Movement),
          camera: player.inputPermissions.isPermissionCategoryEnabled(InputPermissionCategory.Camera)
        });
      }
      player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
      player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false);
    } else {
      const previous = introPermissionStates.get(player.id);
      player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, previous?.movement ?? true);
      player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, previous?.camera ?? true);
      introPermissionStates.delete(player.id);
    }
  } catch (error) {
    console.warn(`[RIFTBOUND] Input lock could not be changed: ${error}`);
  }
}

function playIntro(player) {
  if (player.hasTag(INTRO_SEEN_TAG)) return;

  // Recover cleanly if the player disconnected or the script restarted mid-intro.
  if (player.hasTag(INTRO_LOCK_TAG)) {
    setIntroInputLock(player, false);
    player.removeTag(INTRO_LOCK_TAG);
  }

  player.addTag(INTRO_LOCK_TAG);
  setIntroInputLock(player, true);

  let lineIndex = 0;
  let charIndex = 0;
  let pauseTicks = 0;
  let currentLine = "";
  let finished = false;

  try {
    player.onScreenDisplay.setTitle("§6RIFTBOUND", {
      subtitle: "",
      fadeInDuration: 8,
      stayDuration: 1200,
      fadeOutDuration: 10
    });
  } catch (error) {
    console.warn(`[RIFTBOUND] Intro title failed: ${error}`);
  }

  const task = system.runInterval(() => {
    try {
      if (!player.isValid) {
        system.clearRun(task);
        return;
      }

      if (pauseTicks > 0) {
        pauseTicks--;
        return;
      }

      if (lineIndex >= INTRO_LINES.length) {
        if (!finished) {
          finished = true;
          system.clearRun(task);
          player.onScreenDisplay.setTitle("", { fadeOutDuration: 8 });
          player.removeTag(INTRO_LOCK_TAG);
          player.addTag(INTRO_SEEN_TAG);
          setIntroInputLock(player, false);
          player.sendMessage("§aبدأت رحلتك في RIFTBOUND. خليك صاحي لكل خطر.");
        }
        return;
      }

      const line = INTRO_LINES[lineIndex];
      const chars = Array.from(line);
      if (charIndex === 0) {
        currentLine = "";
        player.onScreenDisplay.updateSubtitle("");
      }

      if (charIndex < chars.length) {
        currentLine += chars[charIndex];
        charIndex++;
        player.onScreenDisplay.updateSubtitle("§f" + currentLine);
      } else {
        lineIndex++;
        charIndex = 0;
        pauseTicks = 24;
      }
    } catch (error) {
      system.clearRun(task);
      try {
        player.removeTag(INTRO_LOCK_TAG);
        setIntroInputLock(player, false);
      } catch {}
      console.warn(`[RIFTBOUND] Intro sequence stopped safely: ${error}`);
    }
  }, 2);
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  system.runTimeout(() => playIntro(player), 20);
});

// Encounter cues and restrained combat feedback. Sounds are built-in Bedrock
// sound events (not custom audio assets), with a per-player cooldown.
const creatureCueCooldowns = new Map();
function playCreatureCue(player, soundId, cooldown = 30) {
  if (!player || player.typeId !== "minecraft:player") return;
  const now = system.currentTick;
  const last = creatureCueCooldowns.get(player.id) ?? -100000;
  if (now - last < cooldown) return;
  creatureCueCooldowns.set(player.id, now);
  try {
    player.playSound(soundId, { volume: 0.7, pitch: 0.9 });
  } catch (error) {
    console.warn(`[RIFTBOUND] Sound event unavailable (${soundId}): ${error}`);
  }
}

world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  const cues = {
    "riftbound:colossus": "mob.warden.heartbeat",
    "riftbound:ironback": "mob.irongolem.walk",
    "riftbound:glassfang": "mob.spider.say",
    "riftbound:skitter": "mob.silverfish.say",
    "riftbound:hollowmaw": "mob.spider.say",
    "riftbound:gloommite": "mob.silverfish.say",
    "riftbound:thornprowler": "mob.spider.say"
  };
  const soundId = cues[entity.typeId];
  if (!soundId) return;

  for (const player of world.getPlayers()) {
    if (player.dimension.id !== entity.dimension.id) continue;
    const dx = player.location.x - entity.location.x;
    const dy = player.location.y - entity.location.y;
    const dz = player.location.z - entity.location.z;
    const distanceSquared = dx * dx + dy * dy + dz * dz;
    if (distanceSquared <= 24 * 24) {
      playCreatureCue(player, soundId, 20 * 12);
    }
  }
});

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
  const customCreatures = new Set([
    "riftbound:colossus",
    "riftbound:ironback",
    "riftbound:glassfang",
    "riftbound:skitter",
    "riftbound:hollowmaw",
    "riftbound:gloommite",
    "riftbound:thornprowler"
  ]);

  if (damagingEntity.typeId === "minecraft:player" && customCreatures.has(hitEntity.typeId)) {
    const sound = hitEntity.typeId === "riftbound:colossus"
      ? "mob.warden.attack"
      : hitEntity.typeId === "riftbound:ironback"
        ? "mob.irongolem.hit"
        : "mob.spider.say";
    playCreatureCue(damagingEntity, sound, 8);
  }

  if (hitEntity.typeId === "minecraft:player" && customCreatures.has(damagingEntity.typeId)) {
    const sound = damagingEntity.typeId === "riftbound:colossus"
      ? "mob.warden.attack"
      : "mob.irongolem.hit";
    playCreatureCue(hitEntity, sound, 8);
  }
});


world.afterEvents.playerLeave.subscribe(({ playerId }) => {
  surgeCooldowns.delete(playerId);
  creatureCueCooldowns.delete(playerId);
  squadSupportCooldowns.delete(playerId);
  introPermissionStates.delete(playerId);
});
