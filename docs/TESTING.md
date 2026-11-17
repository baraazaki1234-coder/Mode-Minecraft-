# Test checklist

## Automated
- [x] All Behavior Pack and Resource Pack JSON files parse.
- [x] Behavior Pack dependency UUID matches the Resource Pack header UUID/version.
- [x] GitHub Actions packages an `.mcaddon` and source archive.

## In-game — still required
- [ ] Both packs import without manifest or Script API errors on Minecraft 26.62.
- [ ] Arabic item names render correctly in the player's selected language.
- [ ] Custom items appear with intended icons and names.
- [ ] Riftblade crafting recipe works in survival.
- [ ] Riftblade damage, durability, enchantability, and Speed burst behave as designed.
- [ ] Riftblade Speed burst triggers only while held and respects the eight-second cooldown.
- [ ] Four players can join the same world.
- [ ] Team selection and PvP behavior work as intended.
- [ ] Keep Inventory preserves the main inventory on death.
- [ ] A carried Rift Shard drops at the death location and can be recovered.
- [ ] Respawn applies exactly one 15-second Weakness wound, not on first join.
- [ ] Repeated deaths do not duplicate or delete Rift Shards unexpectedly.
- [ ] No repeated script errors or noticeable mobile performance regression.
