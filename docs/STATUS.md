# RIFTBOUND development status

## Repository
- Repository: `baraazaki1234-coder/Mode-Minecraft-`
- Branch: `main`
- Write access: verified.

## Implemented in source
- Behavior Pack and Resource Pack manifests with linked UUIDs.
- Arabic (`ar_SA`) and English (`en_US`) localization for items and the first four custom creatures.
- Rift Shard, Embersteel Ingot, Riftblade, and the weapon's short Speed surge.
- Emberguard four-piece armor set (helmet, chestplate, leggings, boots) with wearable protection, durability, enchantability, Arabic/English names, and survival crafting recipes.
- Riftbreaker heavy axe with distinct attack damage, durability, axe enchantability, icon mapping, and survival recipe.
- Persistent mining/combat XP, four ranks, and one-time rank rewards.
- Keep Inventory with one recoverable Rift Shard death drop and a temporary Weakness wound.
- Four team-selection functions, same-team player damage cancellation, and elimination scoring.
- Seven custom behavior entities with separate combat profiles and deliberate ecology: solo Ironback (forest/mountain), desert Glassfang (solo/pairs), underground Skitter (packs), solo underground Hollowmaw, underground Gloommite (packs), forest/taiga Thornprowler (solo), and rare mountain Rift Colossus (solo boss).
- Matching spawn-rule files and client-entity definitions for all seven creatures; see `docs/CREATURE_ECOLOGY.md`.
- Per-player first-entry Arabic typewriter intro, with movement and camera input disabled during the sequence and restored afterward.
- Distinct encounter AI: same-type pack alerts for Skitter/Gloommite, leap attacks for Glassfang/Thornprowler/Skitter, and retaliation when attacked for Ironback/Hollowmaw.
- Built-in encounter/combat sound cues with cooldown protection.
- CI validation for JSON, pack linkage, script entry, API dependency, entity/client ID pairs, spawn rules, locales, and JavaScript syntax.

## Not implemented or not verified yet
- Custom original creature models and textures; current client definitions use vanilla geometry/texture stand-ins.
- Original sound files, custom particles, and bespoke attack animations.
- Directional Ironback armor; current first pass reduces melee/projectile damage generally rather than checking the exact hit direction.
- Original armor/weapon textures and 3D models; current item icons temporarily reuse vanilla iron gear textures.
- Additional armor tiers, weapon archetypes, custom regions/dimensions, structures and their guardian encounters, pets/army commands, and world unlock mechanics.
- In-game verification on Minecraft 26.62 and four-player mobile testing; AI priorities, leap distances, and pack alert behavior need hands-on tuning.
- Final balance and performance testing.

## Release rule
Do not call this a stable or finished add-on until it imports, activates, and passes copied-world tests on the target Android version with multiple players. Keep a backup of the world.
