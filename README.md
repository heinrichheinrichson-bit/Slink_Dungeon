# Nurbi’s Dungeons

Playable dungeon puzzle prototype in the world of Nurbi’s Garden. Current collection: **60 puzzles**, touch controls, undo, step-by-step tester solutions, water, switches, gates and fragile floors. All three button material variants are retained.

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
- outputs/*.apk — signed Android test deliverables (latest published APK: 0.2.1; 60 rooms, selectable button skins, control size and edge-distance sliders)
- work — development helpers, puzzle generation data, tests and historical build scripts
- scripts — portable web build and version backup

Some historical work/ scripts use absolute paths to the original local tool installation. Use scripts/build.cjs for a fresh web build. The Android project requires a local Android SDK and compatible Gradle/JDK; configure SDK location locally. Build caches, SDK paths and signing keys are excluded.

## Version backups

Every completed version or change is committed and pushed with a unique snapshot-YYYYMMDDHHMMSS tag (Europe/Vienna). This preserves all older versions without a timed scheduler. Run node scripts/backup.cjs "Description of completed version" after checks and diff review. Confirmed pushes are required before reporting a completed GitHub backup. See AGENTS.md.

The original APK is signed with the local Android debug key. That private key is not stored here. Future APK updates need the same key to retain install compatibility.

Latest catalogue extension: outputs/nurbis-dungeons/KATALOG-ERWEITERUNG-30.md (rooms 25–30). APK 0.2.0 now includes the current 60-room learning path.

Current learning-path edition: 60 rooms in six chapters (16 easy, 20 medium, 24 challenging). All previous rooms are reordered by stable ID with saved progress retained. Details and old/new room numbers: outputs/nurbis-dungeons/LERNPFAD-60.md. APK 0.2.0 includes these rooms with stone, wood and stone/ivory buttons selectable in settings.

Android 0.2.0 installation and checks: outputs/ANDROID-TEST-0.2.0.md. Install over the existing test app to preserve its progress.

Android 0.2.1: outputs/ANDROID-TEST-0.2.1.md. Adds saved control size and edge-distance sliders, mirrored for left/right use.

PC control placement comparison: /steuerungsanordnung-studie.html (side versus centered controls, playable undo/redo, top hint, all three materials). Rebuild with node scripts/build-control-layout-study.cjs. Study uses isolated QA state and leaves APK/game saves unchanged.
