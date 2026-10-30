# Drei Denkräume

Spielbar unter `denkraeume.html`, zusätzlich von der achtteiligen Reihe verlinkt. Eigener Spielstandspeicher; die acht bisherigen Raumstände bleiben erhalten. Rückgängig und Neustart pro Raum, dieselbe Touch- und Tastatursteuerung.

| Raum | Kernidee | Kürzeste Lösung | Schübe auf diesem Weg |
|---|---|---|---|
| Der Platz ist nur geliehen | Zwei Steine, enger Arbeitsraum, belegten Ruheplatz wieder freimachen | 32 Schritte | 13 |
| Der geliehene Stein | Öffnung verschließen, Anlage entlasten, denselben Stein zurückholen und durch das Schiebewerk zum Siegel führen | 60 Schritte | 20 |
| Erst sichern, dann aufgeben | Samen vor Steinverbrauch holen, Stein als dauerhaften Tritt einsetzen, zum Rückschalten wieder auf die richtige Seite gelangen | 66 Schritte | 17 |

## Kernideen geprüft

Der Umparkraum wurde aus rückwärts lösbaren Schiebestellungen ausgewählt. Eine zweite Zustandsraumsuche, die das Wegbewegen bereits auf einem Ruheplatz stehender Steine verbietet, findet keine Lösung. Die normale Suche löst ihn mit 13 Schüben. Die Umparkidee ist notwendig.

Der Dampf-Raum ist ein neuer engerer Grundriss des vorhandenen Druckwerks mit unveränderten Mechanikpositionen. Verbot des Abdeckens der Dampföffnung macht ihn unlösbar. Im normalen Lösungsweg wird derselbe Stein nach dem Entlasten zurückgeholt und auf dem Ziel-Siegel verwendet.

Der Rückweg-Raum beginnt mit offenem Schacht. Die Wippe öffnet Transport- und Zielgitter gegensinnig. Das Steinsiegel bedient ausschließlich die Samennische. Nach dem endgültigen Einsetzen in den Schacht steht der Stein dafür nicht mehr zur Verfügung. Ohne Schachtfüllung oder ohne Zurückschalten ist keine Lösung erreichbar. Das Siegel muss vor dem Steinverbrauch genutzt werden. Die Leitungen verlaufen mittig, orthogonal, auf kürzesten Manhattanwegen und ohne sichtbare Kreuzung zwischen den getrennten Schaltungen.

## Verifikation

Drei vollständige Lösungswege im Browser nachgespielt, drei Siege bestätigt; keine Konsolenfehler. Vollständige Zustände bis zum Anfang rückwärts geprüft. Die acht alten Räume anschließend erneut per Suche auf Lösbarkeit geprüft. Browserprüfungen laufen mit `?qa=1`, ohne Nutzerstände zu lesen oder zu verändern.

Die Schrittzahlen sind Prüfwerte, keine automatische Schwierigkeitsbewertung. Ob sich die jeweilige Erkenntnis angenehm schwer, zu offensichtlich oder frustrierend anfühlt, bleibt Gegenstand des Spieltests.
