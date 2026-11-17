# RIFTBOUND — design baseline

## The promise
A compact four-player Bedrock survival season where alliances, rivalries, and exploration matter. Losing a fight must sting, but must not delete a player's entire progression.

## Design pillars
1. **Arabic-first experience** — player-facing item names, messages, and instructions should read naturally in Arabic.
2. **Small, deliberate content set** — every item, creature, biome, and mechanic must have a clear gameplay role.
3. **Recoverable loss** — death and PvP create a setback, never a total wipe.
4. **Shared world, player choice** — cooperation is useful; rivalry is possible but not forced.
5. **Phone-first performance** — avoid heavy particles, huge entity counts, and constant polling.

## Planned gameplay loop
Explore and gather → earn rare Rift resources → craft signature gear → unlock dangerous regions through earned milestones → contest objectives → recover and adapt after defeat.

## Progression principles
- Resource tiers must have distinct uses; adding more ores is not enough.
- A stronger tier must cost more risk, preparation, and exploration, not just more mining time.
- Gear should have trade-offs. A weapon may hit harder but have lower durability or a narrower special ability.
- Hostile, neutral, and tameable creatures should each affect exploration or combat in a meaningful way.
- New biomes and dimensions must have a visual identity, a reason to visit, and a clear unlock path.
- Death penalties must be recoverable or time-limited; never erase a player's whole character.

## Multiplayer
Teams are a starting point, not the complete PvP system. Future rules must distinguish allies, enemies, and neutral players and must be tested with four players. Voice chat is not part of a Bedrock add-on's normal scripting surface; any proximity/team/private-room voice feature will be designed as a separate companion service so it does not delay core gameplay.

## Scope control
No random pile of dozens of ores, weapons, mobs, or dimensions. Additions must reinforce the core loop, have Arabic names and readable feedback, and pass multiplayer testing.

## Release gate
A pack is not called playable/stable until it imports on Android Bedrock, activates cleanly, and is tested with four players in one world. Back up worlds before testing.
