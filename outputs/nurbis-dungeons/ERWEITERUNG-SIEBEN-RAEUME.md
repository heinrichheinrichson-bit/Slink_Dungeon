# Drei zusätzliche Räume – Spielrunde mit sieben Räumen

Spielbar: http://127.0.0.1:4173/spielrunde.html

Die ursprünglichen vier Räume sind unverändert. Neu sind:

| Raum | Schwerpunkt | Geprüfte Route | Besondere Abhängigkeit |
| --- | --- | --- | --- |
| 5 · Der geliehene Stellplatz | Rangierflächen | 199 Bewegungen, 38 Schübe | Ein belegtes Ziel wird erneut geräumt. |
| 6 · Die letzte Schalterseite | Wippe und gegenläufige Gitter | 245 Bewegungen, 44 Schübe | Sechs Wippenbetätigungen und vier Zielräumungen in der Testlösung. |
| 7 · Vor dem letzten Schritt | Einmaliger Bruchboden | 188 Bewegungen, 41 Schübe | Einsturz in Schritt 55, danach müssen noch Steine rangiert werden; zwei Zielräumungen. |

Die Zählwerte beschreiben geprüfte Lösungen und ersetzen keinen menschlichen Schwierigkeitstest. Alle drei Grundrisse sind eigenständige Entwürfe aus Rückwärtssuche und anschließender Vorwärtsprüfung; es wurden keine fremden Level übernommen. Die ursprünglichen Regeln und vorhandenen Materialien/Mechaniken werden wiederverwendet.

## Prüfung

- Alle sieben vollständigen Rettungsabläufe durch die gemeinsame Spielrundenlogik ausgeführt: insgesamt 1331 Bewegungen.
- Vollständige Rückgängig-Verläufe der drei neuen Räume bis zum Anfang geprüft.
- Tatsächlich freie Fluchtwege für Nurbi und Freund; keine Routen durch Steine, Wände oder den geöffneten Bruchboden.
- Belegte Ziele müssen in den zugrunde liegenden drei Entwürfen nochmals bewegt werden: mit dauerhaft gesperrtem Verschieben bereits belegter Ziele ergab die jeweilige vollständige Suche keine Lösung.
- Neuer Wippenraum: keine Lösung mit höchstens zwei Betätigungen in der eingeschränkten vollständigen Suche. Sechs ist die Zahl der geprüften Route, kein behauptetes globales Minimum.
- Neuer Bruchbodenraum: ohne einmalige Nutzung der Bretter keine Lösung in der vollständig durchsuchten Zustandsmenge.
- Browser: alle drei neuen Räume dargestellt, Testerknöpfe geprüft; Wippenraum bis zum ersten Umschalten; Bruchbodenraum über den Einsturz hinaus und per Rückgängig wieder vor den Einsturz. Keine protokollierten Warnungen/Fehler im geprüften Testtab.
- Die vollständigen neuen Lösungen wurden in dieser Erweiterung im Regeltest ausgeführt; im Browser wurden die genannten Abschnitte geprüft, nicht nochmals alle 632 zusätzlichen Bewegungen.
- Die bestehende kompakte Touchdarstellung wird weiterverwendet. Kein erneuter Test auf physischer Android-/iOS-Hardware.

## Fortschritt bleibt erhalten

Gespeicherte Räume werden jetzt anhand ihrer dauerhaften IDs zugeordnet. Dadurch bleiben Positionen, Wasser-/Wippen-/Bruchbodenzustände, Rückgängig-Verläufe und Abschlüsse beim Hinzufügen von Räumen erhalten. Neue Räume beginnen frisch. Auch eine andere Reihenfolge im gespeicherten ID-Verzeichnis wurde geprüft.

Die tatsächlich geöffnete bisherige Spielrunde zeigte vor der Aktualisierung vier Abschlüsse. Nach dem Neuladen standen weiterhin alle vier bisherigen Räume auf „Gerettet“, bei insgesamt sieben Räumen. Die drei neuen Räume standen auf „Noch nicht begonnen“. „Spielrunde fortsetzen“ führt vom abgeschlossenen vierten Raum zum fünften.

Beim Wechsel zwischen Übersicht und Spielraum wird die Ansicht an den Anfang gesetzt, damit die Auswahl eines weiter unten stehenden Raums nicht dessen Spielfeld abschneidet.
