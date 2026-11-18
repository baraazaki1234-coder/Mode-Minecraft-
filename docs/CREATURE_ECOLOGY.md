# RIFTBOUND creature ecology and encounter behavior

## Surface territories
- **Ironback** — solitary in dark forest/mountain territory. Slow, plated, and retaliates when attacked.
- **Glassfang** — solitary or pairs in desert night encounters. Fragile, fast, and uses a short pounce to close distance.
- **Thornprowler** — solitary in forest/taiga low light. A stronger ambusher with a higher leap, meant to punish players who ignore their surroundings.
- **Rift Colossus** — solitary, very rare, mountain surface at low light, hard only. A large territorial boss.

## Underground encounters
- **Skitter** — packs of 2–4. Small and quick; pack members alert same-type allies when one is hurt, and can leap at a nearby target.
- **Gloommite** — packs of 3–5. Individually weak; attacking one can draw nearby Gloommites of the same type into the fight.
- **Hollowmaw** — rare solitary cave predator. Slow, resistant to knockback, and retaliates when struck.

## Encounter behavior rules
- Pack response uses Bedrock's hurt-by-target behavior with same-type alerting. It is not a scripted global summon; only nearby same-type mobs already present can join.
- Leap behavior is reserved for fast ambushers (Glassfang, Thornprowler) and the small Skitter. Other creatures retain their own movement and melee profile.
- Retaliation behavior gives solitary defenders a reason to fight back after being attacked.
- Herd sizes and biome restrictions remain intentional. No new universal spawn pool was introduced.
- The current visuals still use vanilla stand-ins. Original models, textures, animation controllers, particles, and custom audio remain separate work.
- Automated validation checks definitions and pack linkage only. Actual AI priority, leap feel, group alert radius, spawn rates, and mobile performance must be tested in a copied Bedrock world.
