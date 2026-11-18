# Test checklist

## Automated
- [x] All Behavior Pack and Resource Pack JSON files parse.
- [x] Behavior Pack dependency UUID matches the Resource Pack header UUID/version.
- [x] GitHub Actions packages an `.mcaddon` and source archive.
- [x] JavaScript syntax is checked in CI.

## In-game — still required
- [ ] Both packs import without manifest or Script API errors on Minecraft 26.62.
- [ ] Arabic item names render correctly in the player's selected language.
- [ ] Custom items appear with intended icons and names.
- [ ] Riftblade crafting recipe works in survival.
- [ ] Each Emberguard armor recipe crafts the correct piece and each piece equips in its intended slot.
- [ ] Armor protection and durability behave as intended on mobile.
- [ ] Riftbreaker recipe, attack damage, durability, and axe enchantability behave as intended.
- [ ] New gear icons resolve correctly and Arabic/English names render.
- [ ] Riftblade damage, durability, enchantability, and Speed burst behave as designed.
- [ ] Riftblade Speed burst triggers only while held and respects the eight-second cooldown.
- [ ] Mining listed ores adds persistent Rift XP without script errors.
- [ ] Defeating listed hostile mobs and bosses adds the intended XP.
- [ ] Each of the four ranks unlocks once at its threshold and grants the correct shard reward.
- [ ] Rank, XP, and rewards persist through death and player rejoin.
- [ ] Four players can join the same world.
- [ ] Player eliminations award one point on the RIFTBOUND sidebar.
- [ ] Killing a player on the same tagged team does not award a point.
- [ ] Arabic team-selection messages render correctly.
- [ ] Team selection and PvP behavior work as intended.
- [ ] Keep Inventory preserves the main inventory on death.
- [ ] A carried Rift Shard drops at the death location and can be recovered.
- [ ] Respawn applies exactly one 15-second Weakness wound, not on first join.
- [ ] Repeated deaths do not duplicate or delete Rift Shards unexpectedly.
- [ ] No repeated script errors or noticeable mobile performance regression.


## Cooperation and war — in-game
- [ ] Nearby teammates receive +1 Rift XP when a player kills a hostile creature within 12 blocks.
- [ ] Players outside the assist radius or in another dimension receive no assist XP.
- [ ] When a tagged player is hurt with a teammate within 8 blocks, the injured player receives brief Resistance and the ally receives brief Speed.
- [ ] Squad support does not trigger more than once per injured player per ten seconds.
- [ ] Enemy player elimination adds two points to the killer's faction war objective and one personal elimination point.
- [ ] Same-team PvP remains cancelled and cannot award war points.
- [ ] Personal streak increments for eliminations and resets for the victim.
- [ ] War announcements and Arabic support messages display correctly.
- [ ] Four-player mobile combat remains responsive with no repeated script errors.
