# Android-Test · 0.2.1

APK: Nurbi-Dungeons-Test-0.2.1.apk

Über die vorhandene Test-App installieren, vorher nicht deinstallieren. Paket-ID und Signierer bleiben gleich, Versionscode ist 6. Der Spielstand bleibt erhalten.

Im Spiel oben rechts das Menü öffnen → Einstellungen · Testdesign:

- Größe des Steuerkreuzes per Regler (132–192 px, Anzeige relativ zur früheren Größe).
- Abstand zum Bildschirmrand per Regler (0–64 px), gespiegelt für links und rechts.
- Größere und etwas weiter innen liegende Voreinstellung: 156 px / 24 px.
- Größe und Randabstand begrenzen sich passend zur verfügbaren Breite, damit keine Tasten überlappen.
- „Am Spielfeld ansehen“ schließt das Menü zur direkten Beurteilung.

Beide Werte werden gemeinsam mit Material und Steuerungsseite gespeichert. Alle 60 Räume, Hinweise, schrittweisen Lösungen und drei Materialien bleiben erhalten.

Geprüft: Browser bei 360 × 740, beide Seiten, Maximalwerte ohne Überlappung oder Seitenüberlauf, Speicherung nach Neuladen sowie Übernahme bisheriger Material-/Seiteneinstellungen. Gradle-Build und APK-Signatur erfolgreich geprüft, identischer Signierer zur Vorversion. Kein physischer S22-Test durchgeführt.
