# RIFTBOUND

A Minecraft Bedrock multiplayer add-on built around a shared survival world, meaningful progression, and rivalries that do not erase a player's entire run.

## Design goals
- Four-player friendly progression with meaningful PvP choices.
- Death should cost something, but never erase a player's entire run.
- Arabic-first player-facing text and clear in-game feedback.
- A small number of carefully balanced systems instead of unrelated item spam.
- Mobile performance and straightforward installation are priorities.
- Adventure tension and memorable creature encounters, not a horror theme.

## Project layout
- `Riftbound_BP/` — behavior pack and Script API gameplay logic.
- `Riftbound_RP/` — resource pack, entity client definitions, and language files.
- `docs/` — design notes and test checklist.

## Current implementation
- Arabic and English item and creature-name localization.
- Rift Shard and Embersteel progression materials.
- Emberguard four-piece armor set with crafted survival recipes and a heavy Riftbreaker axe.
- Riftblade signature weapon with a short Speed surge on hit and an eight-second cooldown.
- Persistent progression XP from mining valuable ores and defeating hostile creatures.
- Four progression ranks with one-time Rift Shard rewards and short rank-up effects.
- Death penalty that preserves the main inventory, drops one carried Rift Shard at the death site, and applies a short Weakness wound after respawn.
- Four team identities with Arabic selection feedback, friendly-fire cancellation for tagged teammates, and player elimination scoring.
- Seven first-pass custom creature behavior definitions with distinct ecology: solitary Ironback in forests/mountains, desert Glassfang pairs, underground Skitter and Gloommite packs, solitary cave Hollowmaw, forest/taiga Thornprowler, and the rare mountain Rift Colossus.
- First-entry Arabic typewriter intro for each player, with movement and camera input locked during the sequence.
- Built-in Minecraft encounter and combat sound cues with cooldowns.

## Current status
The source is packaged by GitHub Actions and automated checks validate JSON, pack linkage, entity/client pairs, spawn-rule presence, locale files, and JavaScript syntax. It is **not yet verified inside Minecraft**. Current creature client definitions reuse vanilla geometry and textures as temporary visual stand-ins; bespoke models, textures, particles, and original sound assets remain future work. Spawn frequency and biome coverage still require in-game verification. Back up your world before testing.

## Death rules — first tuning pass
Keep Inventory protects the player's main equipment and gathered inventory. If the player carries a Rift Shard, one is dropped at the death location for recovery or theft. Respawning also applies a 15-second Weakness wound. See [the death-system notes](docs/DEATH_SYSTEM.md).

## Install target
Minecraft Bedrock on Android. The release artifact is an `.mcaddon` file opened with Minecraft; activate both packs in the target world's settings.

## Testing policy
GitHub Actions validates the source and packages the add-on. These checks do not replace in-game testing. Exact compatibility with Minecraft 26.62, script behavior, sound availability, Arabic rendering, progression balance, and four-player play still require device testing.
