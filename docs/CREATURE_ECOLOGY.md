# RIFTBOUND creature ecology — first distribution pass

This document defines spawn ecology rather than a universal random spawn pool.

## Surface territories
- **Ironback** — solitary; dark forest and mountain terrain; normal/hard. A slow plated territorial opponent.
- **Glassfang** — solitary or pairs; desert at night; easy through hard. Fragile, fast, and dangerous at close range.
- **Thornprowler** — solitary; forest and taiga at low light; normal/hard. A quick ambusher.
- **Rift Colossus** — solitary and very rare; mountain surface at low light; hard only.

## Underground encounters
- **Skitter** — groups of 2–4 underground; common enough to make caves feel active.
- **Gloommite** — groups of 3–5 underground; very small and individually fragile, but dangerous when allowed to surround a player.
- **Hollowmaw** — one at a time underground; rare, slow, heavily resistant to knockback, and devastating at close range.

## Design rules
- Herd size is deliberate: solitary creatures should not arrive as accidental packs, and pack creatures should create group pressure.
- Surface and underground spawn caps are separated by the Bedrock spawn-rule components.
- Biome tags constrain the surface territories; underground creatures use the Overworld monster biome filter.
- Spawn weights are intentionally restrained to avoid turning every chunk into a mob crowd.
- The first-pass client definitions still reuse vanilla geometry and textures. Original models, textures, animations, particles, and audio remain a separate art milestone.
- Automated checks validate data shape and pack references, not actual in-game spawn frequency or mobile performance. Verify in a copied world on the target Bedrock version before calling the ecology balanced.
