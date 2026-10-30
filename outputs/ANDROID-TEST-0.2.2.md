# Android-Test 0.2.2

Über die vorhandene App installieren, nicht vorher deinstallieren. Gleiche Paket-ID und Signatur, Versionscode 7. Die 60 Räume und bisherigen Spielstände bleiben erhalten.

Menü → Einstellungen · Testdesign → Anordnung:

- Seitlich: bisherige Anordnung, rechts/links wählbar, Rückgängig und Hinweis gegenüber.
- Mittig: große Rückgängig-/Wiederholen-Tasten außen, Hinweis oben neben dem Menü.
- Mittig: kleine Aktionstasten auf gleicher Höhe.
- Mittig: kleine Aktionstasten weiter oben.
- Mittig: kleine Aktionstasten weiter unten.

Kleine Aktionstasten haben 48 × 48 px. Alle drei Materialien ohne Trägerplatten bleiben wählbar. Größe des Steuerkreuzes weiterhin per Regler; Randabstand und Links/Rechts gelten nur für die seitliche Anordnung. Die Auswahl bleibt gespeichert. „Am Spielfeld ansehen“ schließt die Einstellungen.

Wiederholen stellt einen zurückgenommenen Zustand vollständig wieder her. Ein neuer gültiger Zug verwirft die Wiederholung; blockierte Bewegungen tun das nicht. Wiederholungen gelten während der laufenden Sitzung. Spielstand und Rückgängig-Historie bleiben weiterhin gespeichert.

Prüfung: Alle 60 Lösungen, 5.914 Züge, vollständig vorwärts, rückwärts und erneut vorwärts mit exaktem Zustandsvergleich. Neustart, Verwerfen nach neuem Zug und Speichern/Laden geprüft. Browser bei 360 × 740: alle fünf Anordnungen ohne Überlauf, kleine Tasten oben/unten, Wiederholen per Taste, gespeicherte Anordnung nach Neuladen. Gradle-Build und APK-Signatur erfolgreich; Signierer identisch zu 0.2.1. Kein physischer S22-Test durchgeführt.
