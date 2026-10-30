# Verzahnte Wege

Spielbarer Raum: http://127.0.0.1:4173/verzahnte-wege.html

Vier verschiebbare Steine und vier Druckplatten in einem verzahnten Grundriss von sieben mal sechs Kernfeldern. Ein kleiner Freund wartet in einer seitlichen Nische; der gemeinsame Ausgang liegt rechts unten. Alle Platten müssen belegt bleiben. Der Freund und Nurbi benötigen beim Verlassen jeweils einen tatsächlich freien Weg zum Ausgang.

## Entwurf

Die Steine teilen sich Transportwege und Arbeitsflächen. Die Anordnung wurde mit einer Rückwärtssuche aus lösbaren Endzuständen entwickelt und anschließend vorwärts geprüft. Sie stammt nicht aus einem übernommenen Fremdlevel. Es gibt keinen Zeitdruck und keine zusätzlichen Sonderregeln.

Die minimale Manhattan-Zuordnung zu den Zielen beträgt zehn Felder. Eine vollständige Vorwärtssuche mit Spieler-Erreichbarkeitsregionen ergibt mindestens 38 Schübe. Das ist ein Hinweis auf erhebliche räumliche Umwege, keine automatische Bewertung der menschlichen Schwierigkeit. Ein Ziel muss in diesem Raum nicht zwingend erneut geräumt werden; die Herausforderung liegt in den Seitenwechseln und gemeinsam benötigten Wegen.

## Geprüft

- Kürzeste Schubzahl: 38, auch mit der zusätzlichen Freundnische und dem geschlossenen Ausgang.
- Vollständiger Rettungsablauf: 199 Schritte mit 38 Schüben. Die Schrittzahl ist kein bewiesenes Gehwegminimum.
- In diesem Ablauf werden die einzelnen Steine 9, 9, 6 und 14 Mal geschoben.
- Rettungswege für beide Figuren auf zusammenhängenden freien Feldern, ohne Durchqueren von Wänden oder Steinen.
- Vollständiges Rückgängig im Regeltest; Rückgängig nach Sieg zusätzlich im Browser.
- Alle 199 Schritte über die tatsächlichen Richtungsschaltflächen im Browser erfolgreich durchgespielt, ohne protokollierte Fehler.
- Ansicht mit 390 × 844 Pixeln geprüft: Spielfeld 335 × 335 Pixel, kein horizontaler Überlauf. Ein Test auf echter Android/iOS-Hardware steht noch aus.
- Vorherige Studien und Rätsel bleiben erhalten. Der gemeinsame Bodenträger berücksichtigt bei leeren Randzellen jetzt die tatsächlich verwendeten äußeren Grenzen; voll belegte rechteckige Karten behalten ihre bisherigen Maße.

Die Lösung liegt nur in den Entwicklungsdateien unter work/, damit sie im Spiel nicht vorweggenommen wird.
