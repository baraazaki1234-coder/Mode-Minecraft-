# RIFTBOUND development status

## Repository
- Repository: `baraazaki1234-coder/Mode-Minecraft-`
- Branch: `main`
- Write access: verified.
- GitHub Actions: automated validation and packaging are running successfully on the latest script/weapon baseline.

## Implemented in source
- Behavior Pack and Resource Pack manifests with linked UUIDs.
- Arabic (`ar_SA`) and English (`en_US`) item localization.
- Rift Shard and Embersteel materials.
- Riftblade weapon, crafting recipe, and Script API Speed surge.
- Keep Inventory plus a recoverable Rift Shard death drop and temporary Weakness wound.
- Four initial team-selection functions.
- CI checks for JSON, pack linkage, script entry, API dependency, locale files, and JavaScript syntax.

## Not implemented yet
- In-game verification on Minecraft 26.62 and four-player mobile testing.
- Finished custom textures, models, and visual effects.
- Full team-safe PvP rules, deeper progression, more weapons/armor, creatures, biomes, and unlockable dimensions.
- Companion voice system. Voice capture, proximity routing, team channels, and password-protected rooms are outside the normal Bedrock add-on scripting API and need a separate companion service.

## Release rule
Do not call this a stable or finished add-on until it imports, activates, and passes copied-world tests on the target Android version with multiple players. Keep a backup of the world.
