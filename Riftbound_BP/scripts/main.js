import { world, system, ItemStack } from "@minecraft/server";

const RIFT_SHARD = "riftbound:rift_shard";
const WOUND_PROPERTY = "riftbound:pending_wound";
const WOUND_TICKS = 20 * 15;

// Keep the player's main inventory on death, but make a carried Rift Shard
// recoverable at the death site. A short wound still applies if no shard exists.
world.afterEvents.entityDie.subscribe((event) => {
  const player = event.deadEntity;
  if (player.typeId !== "minecraft:player") return;

  let droppedShard = false;
  try {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (inventory) {
      for (let slot = 0; slot < inventory.size; slot++) {
        const stack = inventory.getItem(slot);
        if (!stack || stack.typeId !== RIFT_SHARD) continue;

        if (stack.amount > 1) {
          stack.amount -= 1;
          inventory.setItem(slot, stack);
        } else {
          inventory.setItem(slot, undefined);
        }

        player.dimension.spawnItem(new ItemStack(RIFT_SHARD, 1), player.location);
        droppedShard = true;
        break;
      }
    }
    player.setDynamicProperty(WOUND_PROPERTY, true);
  } catch (error) {
    console.warn(`[RIFTBOUND] Death penalty could not be applied: ${error}`);
  }

  if (droppedShard) {
    console.warn("[RIFTBOUND] A Rift Shard was left at a player's death site.");
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
