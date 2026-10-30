# Nurbi’s Dungeons

Playable dungeon puzzle prototype in the world of Nurbi’s Garden. Current collection: **24 puzzles**, touch controls, undo, step-by-step tester solutions, water, switches, gates and fragile floors. All three button material variants are retained.

## Run

With Node.js installed, run npm start and open http://127.0.0.1:4173/spielrunde.html. Prebuilt web files are included, so no dependency installation is needed to play.

For rebuilding web bundles: npm install, then npm run build.

PC studies:
- /steuerkreuzstudie.html — control shapes and mirrored action placement
- /bedienelement-materialstudie.html — stone, wood, stone/ivory without backing plates

## Layout

- outputs/nurbis-dungeons/src — game, renderer, materials, puzzle definitions and rules
- outputs/nurbis-dungeons — playable web bundles and retained studies
- outputs/nurbi-android — Android project, offline web assets and touch-control study
- outputs/*.apk — signed Android test deliverables (latest published APK: 0.1.3; later PC design studies have not yet been packaged into it)
- work — development helpers, puzzle generation data, tests and historical build scripts
- scripts — portable web build and version backup

Some historical work/ scripts use absolute paths to the original local tool installation. Use scripts/build.cjs for a fresh web build. The Android project requires a local Android SDK and compatible Gradle/JDK; configure SDK location locally. Build caches, SDK paths and signing keys are excluded.

## Version backups

Every completed version or change is committed and pushed with a unique snapshot-YYYYMMDDHHMMSS tag (Europe/Vienna). This preserves all older versions without a timed scheduler. Run node scripts/backup.cjs "Description of completed version" after checks and diff review. Confirmed pushes are required before reporting a completed GitHub backup. See AGENTS.md.

The original APK is signed with the local Android debug key. That private key is not stored here. Future APK updates need the same key to retain install compatibility.
