# RIFTBOUND

A focused Minecraft Bedrock multiplayer add-on project for a small survival group.

## Design goals
- Four-player friendly progression with meaningful PvP choices.
- Death should cost something, but never erase a player's entire run.
- A small number of carefully balanced systems instead of unrelated item spam.
- Mobile performance and straightforward installation are priorities.

## Project layout
- `Riftbound_BP/` — behavior pack.
- `Riftbound_RP/` — resource pack.
- `docs/` — design notes and test checklist.

## Current status
The repository contains the initial Bedrock pack foundation, custom materials, a safe setup function, and team-selection functions. It is **an early development build, not a finished or in-game-tested release**. Back up your world before testing.

## Install target
Minecraft Bedrock on Android. The planned release is an `.mcaddon` file opened with Minecraft; activate both packs in the target world's settings.

## Testing policy
Every release must pass JSON validation, UUID/path checks, and an in-game multiplayer test before being called stable. Target game version is the 1.26.60+ format line; exact compatibility with 26.62 still needs device testing.
