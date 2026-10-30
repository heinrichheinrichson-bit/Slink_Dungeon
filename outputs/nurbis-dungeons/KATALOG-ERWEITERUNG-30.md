# Rätselkatalog · 30 Räume

Sechs neue Räume ab Nummer 25. Die ersten 24 bleiben mit denselben IDs und Lösungen erhalten. Aktuelle vorläufige Einstufung: 6 leicht, 10 mittel, 14 anspruchsvoll.

| Raum | Titel | Stufe | Testschritte | Schiebezüge |
|---|---|---|---:|---:|
| 25 | Ein Ziel muss warten | Mittel | 87 | 24 |
| 26 | Die andere Seite | Mittel | 57 | 19 |
| 27 | Vier Wege, wenig Platz | Anspruchsvoll | 103 | 34 |
| 28 | Noch nicht am Ziel | Anspruchsvoll | 200 | 32 |
| 29 | Erst hin, dann zurück | Anspruchsvoll | 157 | 32 |
| 30 | Bevor der Boden fehlt | Anspruchsvoll | 193 | 32 |

## Prüfkriterien

Bei den vier neuen reinen Schieberätseln ergibt eine vollständige Suche ohne erlaubtes Räumen belegter Ziele keine Lösung. Ihre geprüften Schiebezahlen liegen deutlich über der reinen Zuordnungs-Distanz (24/8, 19/5, 34/10, 32/8). Das ist ein Nachweis zusätzlicher Abhängigkeiten, kein Ersatz für menschliche Schwierigkeitsbewertung.

Raum 29: gefundene Testlösung mit vier Umschaltungen; keine gefundene Lösung mit höchstens zwei Umschaltungen nach vollständiger beschränkter Suche. Raum 30: der Bruchboden muss betreten werden; ohne ihn ist das Rätsel unlösbar. Die Testlösung lässt ihn bei Schritt 138 zusammenbrechen.

Alle finalen Rettungswege werden mit dem tatsächlichen Spielzustand geprüft. Die Lösungshilfe führt gewöhnliche Bewegungen aus. Alle 30 Raumgrundrisse sind unter Drehung/Spiegelung verschieden.

## Validierung

- Alle 3.618 Lösungsschritte im Spielcontroller bestanden, einschließlich Sieg, Rückgängig und geladenen Spielständen.
- Übernahme aus 24 Räumen auf 30 geprüft; neue Räume starten frisch.
- Filterzahlen, Raum-IDs und Grundriss-Eindeutigkeit geprüft.
- Neue Ziele-räumen-Anforderungen separat nachgerechnet.
- Neuer Raum 26 im Browser vollständig gerettet; Rückgängig nach Sieg geprüft. Neue schwere Räume visuell stichprobenweise kontrolliert.

Die APK 0.1.3 enthält weiterhin den älteren 24-Räume-Stand. Diese Erweiterung steht zunächst im PC-Katalog unter spielrunde.html zur Beurteilung bereit. Material- und Steuerungsstudien bleiben erhalten.
