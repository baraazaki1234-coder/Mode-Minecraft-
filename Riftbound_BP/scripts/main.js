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
