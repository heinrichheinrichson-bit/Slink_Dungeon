> Aktuell umfasst die Spielrunde zehn Räume. Die zusätzliche Schwierigkeitsreihe ist in VERGLEICHSREIHE.md dokumentiert, die vorherige Erweiterung in ERWEITERUNG-SIEBEN-RAEUME.md. Die folgenden Angaben beschreiben die ursprüngliche Zusammenführung der vier Referenzräume.

# Unter den Gärten – zusammenhängende Spielrunde

Spielbar: http://127.0.0.1:4173/spielrunde.html

Die vier bestätigten Räume sind zu einer eigenständig gespeicherten Spielrunde verbunden:

1. Verzahnte Wege – Rangieren und gemeinsame Arbeitsflächen.
2. Gegenläufig – Richtungswippe und gegenläufige Durchgänge.
3. Nur einmal hinüber – verlorene Standfläche nach Brettereinsturz.
4. Wechselnde Ufer – Wasserwechsel und nutzbare Beckenböden.

## Ablauf

Die Übersicht bietet Beginn/Fortsetzen, freie Raumwahl und den gespeicherten Abschlussstand. Im Raum sind das Belegen der Druckplatten und das Finden des Freundes sichtbar. Nach der tatsächlichen Fluchtanimation erscheint der Übergang zum nächsten Raum. Nach vier Rettungen erscheint der Rundenabschluss mit Rückkehr zur Übersicht. Jeder Raum bleibt erneut spielbar.

Eigener Speicher: `nurbi-spielrunde-v1`. Positionen, Mechanikzustände, Rückgängig-Verläufe, Abschlüsse und zuletzt gewählter Raum werden gespeichert. Die Einzelräume und Studien bleiben erhalten und verwenden weiterhin ihre bisherigen getrennten Speicher. Vorherige Einzelraum-Abschlüsse werden nicht automatisch als Abschlüsse dieser neuen Spielrunde übernommen.

Die Testersteuerung ist unter „Tester · Schrittweise Lösung“ in jedem Raum erreichbar. Ein Klick führt einen normalen Zug aus. Abweichungen werden erkannt; Wasser-, Wippen- und Bruchbodenzustand sind Teil des Abgleichs. „Lösung von vorn“ setzt ausschließlich den aktuellen Raum zurück. Ein bereits erreichter Abschluss bleibt als solcher vermerkt.

## Validierung

- Alle vier vollständigen Lösungen durch die neue gemeinsame Spielrundenlogik ausgeführt: insgesamt 699 gewöhnliche Züge, vier Siege und Übergänge.
- Getrennte Raumstände, Speichern/Laden mit aktiver Wasserstellung, Rückgängig über den gespeicherten Wasserwechsel, Neustart ohne Verlust des Abschlussvermerks und ungültiges Speicherformat geprüft.
- Im Browser: Beginn, erste Züge, Raumwechsel und Rückkehr zum vorherigen Stand, Rückgängig und Testersteuerung geprüft.
- Browser-Neuladen mit echter Speicherung: drei Züge erhalten, Fortsetzen erfolgreich, Rückgängig führt auf zwei Züge zurück. Der eigens erzeugte Teststand wurde danach wieder an den Anfang gesetzt.
- Smartphone-Ansicht bei 390 × 844 Pixeln geprüft; vollständiges Spielfeld auch im Wasserraum sichtbar. Eine echte simulierte Wischgeste auf dem Spielfeld löst den erwarteten Zug aus. Die temporäre Größenvorgabe wurde anschließend zurückgesetzt.
- Keine protokollierten Browserwarnungen oder Fehler im Speichertest.
- Die vollständigen Einzelraumabläufe waren bereits separat im Browser durchgespielt. Alle 699 Bewegungen wurden bei dieser Zusammenführung im Regel-/Fortschrittstest und nicht erneut vollständig im Browser ausgeführt.
- Kein Test auf physischer Android-/iOS-Hardware und keine Veröffentlichung in einem App-Store.

Der gemeinsame Renderer setzt das Rendern aus, wenn das Spielfeld in der Übersicht verborgen ist. Die Rätselregeln und geprüften Grundrisse bleiben unverändert.


