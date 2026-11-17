# RIFTBOUND — Creature Design Roster

## Creative direction
RIFTBOUND is dangerous adventure and survival, not horror. Creatures should create awe, surprise, tactical respect, and funny "I underestimated that thing" moments. Avoid gore, jumpscare spam, or making every creature frightening.

The silhouette is not a reliable measure of danger. Size, health, damage, armor, speed, range, and special behavior are separate balance dimensions.

## Creature archetypes

| Archetype | Read at a glance | Actual threat | Counterplay |
|---|---|---|---|
| The Colossus | Huge, slow, unmistakably powerful | Very high health and devastating telegraphed blows; slow turning and recovery | Keep distance, dodge the wind-up, attack during recovery, use terrain |
| The Skitter | Tiny, easy to dismiss | Low health but extremely fast; closes distance and strikes in bursts | Keep moving, use sweeping attacks, don't let it flank |
| The Ironback | Small-to-medium, heavily plated | Low damage and short reach, but frontal armor reduces most ordinary hits | Circle behind it, use armor-piercing / stagger tools, exploit its slow turn |
| The Glassfang | Lean, fragile-looking | Low health but a dangerous burst attack; must expose itself briefly before striking | Interrupt the wind-up, block or evade, punish after its lunge |
| The Longshot | Slender ranged creature | Keeps distance and pressures exposed players; weak when cornered | Break line of sight, close in from cover, prioritize it in groups |
| The Packrunner | Modest size, travels with others | Individually manageable; dangerous through flanking and coordinated pressure | Avoid being surrounded, split the pack, protect teammates |
| The Bulwark | Broad shield-bearing creature | Blocks frontal attacks and protects nearby lesser creatures | Flank, bait its guard, separate the group, attack during its guard reset |
| The Riftcaller | Small support creature | Weak alone; strengthens nearby creatures or disrupts player positioning | Identify it quickly and remove it before fighting the tougher group |

## Design rules
1. Every creature needs a readable tell before its strongest move: a sound, stance, glow, pause, or animation.
2. Every strong ability must have at least one fair counter. Surprise is welcome; unavoidable damage is not.
3. Armor must be directional or have a clear weakness where possible. A creature that barely takes damage from the front should be vulnerable from behind or during recovery.
4. Small creatures may be more dangerous than large ones, but their danger must come from speed, timing, numbers, or a special skill—not arbitrary inflated health.
5. Strong creatures should be visually recognizable at a distance. Their scale, silhouette, movement, and sound should communicate that the player should think before engaging.
6. Creature groups should have roles that complement one another. Avoid spawning many copies of the same threat without purpose.
7. Include weaker creatures and calm / tameable wildlife in the wider ecosystem so the world does not feel like every encounter is a boss fight.
8. Balance for a four-player mobile group. Solo danger should be meaningful, while teamwork should create tactical options rather than making every fight trivial.
9. Reward observation and preparation: armor, weapons, positioning, timing, and team coordination should matter.
10. These are approved design archetypes, not yet implemented in-game entities. Models, textures, spawn rules, drops, and runtime behavior still need to be built and tested.

## Opening sequence — Arabic copy

The first world-entry sequence should reveal its text gradually, letter by letter, and play for each player who has not completed it before. It should not replay on every respawn.

1. "هل لازم تثق في فريقك؟ ولا ممكن يغدروا بيك أول ما تيجي الفرصة؟"
2. "في العالم ده، القوة مش دايمًا في الحجم…"
3. "ممكن وحش ضخم يخليك تفكر ألف مرة قبل ما تقرب."
4. "وممكن مخلوق صغير تستهين بيه… ويكون آخر حاجة تتوقعها."
5. "لا تستهين بأي وحش، مهما كان صغيرًا أو بدا ضعيفًا."
6. "راقب حركته، افهم طريقته، واختار وقت المواجهة."
7. "خليك مستعد… لأن الصدع لا يرحم الغافلين."

Tone: adventurous, tense, and confident—not horror. The exact full-screen presentation, typewriter timing, and input lock must be implemented only with APIs supported by the target Bedrock version; do not claim a hard lock until tested in-game.
