# RIFTBOUND

A focused Minecraft Bedrock multiplayer add-on project for a small survival group.

## Design goals
- Four-player friendly progression with meaningful PvP choices.
- Death should cost something, but never erase a player's entire run.
- Arabic-first player-facing text and clear in-game feedback.
- A small number of carefully balanced systems instead of unrelated item spam.
- Mobile performance and straightforward installation are priorities.

## Project layout
- `Riftbound_BP/` — behavior pack and Script API gameplay logic.
- `Riftbound_RP/` — resource pack and language files.
- `docs/` — design notes and test checklist.

## Current implementation
- Arabic and English item localization.
- Rift Shard and Embersteel progression materials.
- Riftblade signature weapon with a short Speed surge on hit and an eight-second cooldown.
- Death penalty that preserves the main inventory, drops one carried Rift Shard at the death site, and applies a short Weakness wound after respawn.
- Initial team-selection functions.

## Current status
The source builds and passes automated JSON, pack-linkage, locale-file, and JavaScript syntax checks. It is **not yet verified inside Minecraft**. Custom art, additional progression tiers, creatures, biomes, and unlockable dimensions remain in development. Back up your world before testing.

## Death rules — first tuning pass
Keep Inventory protects the player's main equipment and gathered inventory. If the player carries a Rift Shard, one is dropped at the death location for recovery or theft. Respawning also applies a 15-second Weakness wound. See [the death-system notes](docs/DEATH_SYSTEM.md).

## Install target
Minecraft Bedrock on Android. The planned release is an `.mcaddon` file opened with Minecraft; activate both packs in the target world's settings.

## Testing policy
GitHub Actions validates JSON, checks pack UUID linkage, script entry points, the stable Script API dependency, locale files, and JavaScript syntax, then packages the add-on. These checks do not replace in-game testing. Exact compatibility with Minecraft 26.62, script behavior, Arabic rendering, and four-player balance still require device testing.
