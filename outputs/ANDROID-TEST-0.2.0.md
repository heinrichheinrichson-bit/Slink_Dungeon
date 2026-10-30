# Android-Test · 0.2.0

APK: Nurbi-Dungeons-Test-0.2.0.apk

## Installation

Über die vorhandene Test-App installieren. Nicht vorher deinstallieren: Paket-ID und Signatur sind identisch, der Versionscode steigt auf 5. Der bisherige App-Spielstand wird anhand der Raum-IDs auf den 60-Räume-Lernpfad übernommen. Die sichtbaren Raumnummern ändern sich dabei.

## Einstellungen

Im Spiel Menü rechts oben → Einstellungen · Testdesign:

- Glatter Stein
- Wurzelholz
- Stein & Elfenbein
- Steuerung rechts oder links

Alle drei Varianten haben keine farbigen Trägerflächen. Vier einzelne Richtungstasten (Version B), gegenüber Rückgängig und Hinweis. Die Auswahl wird lokal gespeichert und setzt den Raum nicht zurück. Wischen und Nachbarfeld-Tippen bleiben möglich.

## Inhalt

Alle 60 Räume in sechs Abschnitten, neue Wippenlogik (Umschalten erst beim Überqueren), Hinweise und schrittweise Lösungsläufe. Im Menü unter Tester die Lösung öffnen und „Lösung am Spielfeld ansehen“ wählen, um beim nächsten Testzug das Spielfeld frei zu sehen. Neustart und Raumwechsel liegen im Menü. Unter „Tester · Wie war der Raum?“ kannst du außerdem Zu leicht / Passend / Zu schwer / Unklar lokal festhalten.

## Prüfung

Gradle-Build erfolgreich; APK-Signatur geprüft und mit APK 0.1.3 verglichen (identischer Signierer). Gepackte Assets per SHA-256 mit den aktuellen Quelldateien verglichen. Die Spielbundles entsprechen dem geprüften 60-Räume-Katalog. Browserprüfung im Handyformat: Richtungstasten, Rückgängig, alle drei Materialien, Spiegelung, Einstellungen nach Neuladen, erhaltener Spielstand, Hinweis, Lösungslauf bis zur Rettung. Ein physischer S22-Test wurde hier nicht durchgeführt.

APK läuft vollständig offline; keine Internetberechtigung. Die PC-Studien bleiben unverändert verfügbar. Android-Zurück schließt zuerst ein geöffnetes Menü, dann geht es zur Raumübersicht.
