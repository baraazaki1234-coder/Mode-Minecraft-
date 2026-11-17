# RIFTBOUND development status

## Repository
- Repository: `baraazaki1234-coder/Mode-Minecraft-`
- Branch: `main`
- Write access: verified.
- Latest baseline build passed automated validation and packaging; the new progression changes require their own CI run.

## Implemented in source
- Behavior Pack and Resource Pack manifests with linked UUIDs.
- Arabic (`ar_SA`) and English (`en_US`) item localization.
- Rift Shard and Embersteel materials.
- Riftblade weapon, crafting recipe, and Script API Speed surge.
- Persistent mining/combat XP tracked in scoreboards.
- Four progression ranks with one-time Rift Shard rewards and short rank-up effects.
- Mining XP for overworld/nether ores and Ancient Debris; combat XP for a curated list of hostile mobs and bosses.
- Keep Inventory plus a recoverable Rift Shard death drop and temporary Weakness wound.
- Four initial team-selection functions with Arabic feedback.
- Player elimination scoring; kills against a tagged teammate do not award points.
- CI checks for JSON, pack linkage, script entry, API dependency, locale files, and JavaScript syntax.

## Not implemented yet
- In-game verification on Minecraft 26.62 and four-player mobile testing.
- Finished custom textures, models, and visual effects.
- Full team-safe PvP rules, advanced gear tiers, custom creatures, biomes, and unlockable dimensions.
- Final progression balance and survival-economy testing.

## Release rule
Do not call this a stable or finished add-on until it imports, activates, and passes copied-world tests on the target Android version with multiple players. Keep a backup of the world.
