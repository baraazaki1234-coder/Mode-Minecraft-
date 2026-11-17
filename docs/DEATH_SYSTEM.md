# RIFTBOUND — death and recovery

## Death should matter, not erase a run

The initial penalty design deliberately protects the player's main inventory:
- Keep Inventory remains enabled so a single death does not delete hours of equipment and gathering.
- If the player carries at least one Rift Shard, one shard is removed and dropped at the death location. It can be recovered by returning there, or taken by another player.
- Every player death applies a short Weakness wound after respawning. This makes reckless repeat deaths costly without permanently crippling a player.
- If the player has no Rift Shard, the wound still applies.

## Balance intent

This is a first tuning pass, not a final balance claim. The shard loss is a recoverable objective and creates a reason to defend or raid a death site. The wound duration is 15 seconds and should be tested with the group's PvP pace.

## Safety and test status

The script uses the stable `@minecraft/server` 2.6.0 dependency and the `world.afterEvents.entityDie` / `playerSpawn` event flow. JSON and packaging CI do not prove that the event or inventory behavior works in the target game build. Test on a copied world with at least two players before using it in the main world.
