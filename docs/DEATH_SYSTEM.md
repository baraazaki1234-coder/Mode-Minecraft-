# RIFTBOUND — death, recovery, and weapon identity

## Death should matter, not erase a run

The initial penalty design deliberately protects the player's main inventory:
- Keep Inventory remains enabled so a single death does not delete hours of equipment and gathering.
- If the player carries at least one Rift Shard, one shard is removed and dropped at the death location. It can be recovered by returning there, or taken by another player.
- Every player death applies a short Weakness wound after respawning. This makes reckless repeat deaths costly without permanently crippling a player.
- If the player has no Rift Shard, the wound still applies.

## First signature weapon

The Riftblade is the first custom weapon:
- Its damage is tuned above a Netherite sword's baseline, but its durability is lower so it is not a straight upgrade in every situation.
- A successful melee hit grants a brief Speed burst.
- The ability has an eight-second personal cooldown.
- Its recipe consumes both Rift progression material and Embersteel, so it is not an early-game free upgrade.

## Balance intent

These are first tuning values, not final balance claims. The shard loss creates a recoverable objective and a reason to defend or raid a death site. The wound duration is 15 seconds. The Riftblade's three-second Speed burst and eight-second cooldown should be tested with the group's PvP pace.

## Safety and test status

The script uses the stable `@minecraft/server` 2.6.0 dependency and the `world.afterEvents.entityDie`, `playerSpawn`, and `entityHitEntity` event flow. JSON and packaging CI do not prove that the event, inventory, item damage, or effect behavior works in the target game build. Test on a copied world with at least two players before using it in the main world.
