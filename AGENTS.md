# Project instructions

This repository contains the Nurbi dungeon game, its design studies, Android test app, build helpers, and verified puzzle solutions.

## User decisions

Preserve all three button material variants (stone, wood, stone/ivory), without backing plates. The PC design studies remain available. Nurbi is nature-loving; preserve the established game and puzzle rules.

## Version backups — explicit user requirement

After EACH completed new version or requested change: run the appropriate checks, commit the finished project state, create a unique snapshot tag, and push both commit and tag to https://github.com/heinrichheinrichson-bit/Slink_Dungeon.git. This is event-based, not a timed automation. Do not report a GitHub backup as complete until the remote push is confirmed. If unavailable, retain the local commit and tell the user that the push remains pending. Never force-push or overwrite remote history.

Use node scripts/backup.cjs "Short description of finished changes" from the repository root. Inspect the diff before running. Do not commit credentials, signing keys, local SDK paths, dependencies or build caches. Keep source files, playable web bundles, studies, test helpers, APK deliverables and documentation. Older completed versions must remain recoverable through their snapshot tags.
