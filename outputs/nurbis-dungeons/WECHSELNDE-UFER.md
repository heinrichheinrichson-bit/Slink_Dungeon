# Wechselnde Ufer

Spielbar: http://127.0.0.1:4173/wechselnde-ufer.html

Eigenständiger kompakter Raum mit vier Steinen, vier Druckplatten, einer Richtungswippe und zwei verbundenen Becken. Verwendet die ausgewählte eingelassene Garden-Beckenform mit Treppen und hohem Wasserstand.

## Regeln

- Die Wippe tauscht die Wasserstände: oben nass/unten trocken oder oben trocken/unten nass.
- Becken sind ausschließlich horizontal über die Treppen an ihren Enden zugänglich. Seitlicher Einstieg und seitliches Schieben über den Rand sind gesperrt.
- Ein trockener Beckenboden ist als Transport- und Standfläche nutzbar.
- Beim Fluten bleibt ein vorhandener Stein an seiner Position. Er wird nicht verbraucht oder versetzt und kann nach erneutem Trockenlegen weitergeschoben werden.
- Die vier Druckplatten steuern ausschließlich das Ausgangsgitter. Die Wippe steuert ausschließlich die Becken; ihre Leitungen führen nur dorthin.
- Der Freund wird besucht. Zum Abschluss werden für Nurbi und den Freund tatsächlich freie Fluchtwege geprüft, einschließlich Wasserstand und Treppenzugängen. Ein automatischer Fluchtweg betätigt keine Wippe.

## Prüfung

- Entwurf durch Rückwärtssuche aus gelösten Zuständen mit Wasserwechseln; anschließend Vorwärtssuche mit erreichbaren Spielerregionen.
- Keine Lösung mit höchstens zwei Wasserwechseln in der vollständigen eingeschränkten Suche.
- Geprüfte Route: 150 Einzelbewegungen, 35 Schübe, drei Wasserwechsel. Die Schub- und Gehwegzahlen sind Werte dieser Route, keine unabhängig bewiesenen globalen Minima und kein automatisches Schwierigkeitsurteil.
- Der Ablauf nutzt zeitweise geflutete, abgestellte Steine und später erneut trockene Transportflächen.
- Alle 150 Schritte über den sichtbaren Lösungsknopf im Browser bis zum Sieg ausgeführt. Keine protokollierten Browserwarnungen oder Fehler. Der Browser antwortete zeitweise langsam; der Lauf wurde jeweils ab dem bestätigten Schritt fortgesetzt.
- Regeln für gefluteten Einstieg, gesperrte Schubrichtung, trockenen Transport, erhaltene Steine beim Fluten, richtungsabhängige Wippe und blockiertes anderes Ende geprüft.
- Vollständiges Rückgängig im Regeltest. Die Rettungsabläufe der drei bisherigen Referenzräume bestehen weiterhin.
- Steinauflage und Nurbi-Bewegung berücksichtigen die Beckentiefe. Beide Figuren benutzen diese Höhen auch während der abschließenden Fluchtanimation.
- Garden-Becken berücksichtigen jetzt die tatsächliche Kartenhöhe bei rechteckigen Karten; quadratische bisherige Studien behalten ihre Platzierung.
- Die responsive und Touch-Steuerung des bestehenden Testrahmens wird übernommen. Keine Prüfung dieses Raums auf physischer Android-/iOS-Hardware.

Die Testersteuerung steht neben dem Spielfeld und erkennt Abweichungen einschließlich der Wasserstellung. Lösung von vorn setzt den Raum ausdrücklich zurück.
