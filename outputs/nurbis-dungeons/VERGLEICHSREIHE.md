# Vergleichsreihe: leicht – mittel – anspruchsvoll

Spielbar in der Spielrunde: http://127.0.0.1:4173/spielrunde.html

Die neuen Räume 8 bis 10 verwenden ausschließlich Schiebesteine und Druckplatten. So lässt sich die räumliche Schwierigkeit ohne zusätzliche Fallenregeln vergleichen. Die Bezeichnungen sind vorläufige Entwurfseinstufungen und noch keine durch unabhängige Spieler bestätigte Schwierigkeitsskala. Die ersten sieben Räume bleiben unverändert; die gesamte Sammlung ist weiterhin ein Testpaket und noch keine fertige ansteigende Kampagnenkurve.

| Raum | Einstufung | Steine | Minimale Schübe bis zu den Druckplatten | Vollständige geprüfte Rettungsroute |
| --- | --- | --- | --- | --- |
| 8 · Ein Platz auf Zeit | Leicht | 2 | 9 | 31 Bewegungen |
| 9 · Die schmale Runde | Mittel | 3 | 23 | 88 Bewegungen |
| 10 · Erst Platz schaffen | Anspruchsvoll | 4 | 36 | 230 Bewegungen |

Die Gehwegzahlen sind keine bewiesenen Gehwegminima. Die Schubminima wurden mit einer vollständigen Vorwärtssuche und Spieler-Erreichbarkeitsregionen ermittelt; die später ergänzten Freundfelder erhalten die gefundenen Lösungen. Die Gesamtzahl der Züge allein ist kein Schwierigkeitsmaß.

Im leichten Raum reicht ein kleiner Umparkgedanke: Ein bereits belegtes Ziel muss noch einmal freigegeben werden. Im mittleren Raum wachsen Transport- und Reihenfolgeplanung. Im anspruchsvollen Raum werden mehrere Standflächen geteilt; die Testlösung räumt zwei belegte Ziele erneut. Die Grundrisse sind neu erstellt und nicht aus fremden Levels übernommen.

## Geprüft

- Alle zehn Rettungsabläufe durch die gemeinsame Spielrundenlogik: insgesamt 1680 gewöhnliche Bewegungen.
- Vollständiges Rückgängig, gespeicherte Mechanikzustände, Enden und Raumwechsel sowie Übernahme alter Vier- und Sieben-Raum-Speicher geprüft.
- Browser: leichte und mittlere Vergleichsräume vollständig über den Lösungsknopf gespielt, einschließlich der Weiter-Knöpfe zu Raum 9 und 10.
- Browser: anspruchsvollen Raum dargestellt, erste fünf Lösungsschritte und Rückgängig geprüft. Die vollständige anspruchsvolle Route wurde im Regeltest ausgeführt und in diesem Schritt nicht nochmals vollständig im Browser abgespielt.
- Alle drei besitzen den tatsächlichen Rettungsweg für Nurbi und Freund. Der Abschluss erfolgt erst am gemeinsamen freien Ausgang.
- Keine protokollierten Browserwarnungen oder Fehler im Vergleichstest.
- Der echte geöffnete Nutzerstand zeigte vor der Aktualisierung 5 von 7 geretteten Freunden und danach unverändert fünf Abschlüsse bei zehn verfügbaren Räumen. Die drei neuen Räume beginnen ungespielt.
- Responsive Darstellung und Touchsteuerung stammen aus dem bestehenden Testrahmen. Keine erneute Prüfung auf physischer Android-/iOS-Hardware.

Alle drei Räume haben die schrittweise Testlösung, Abweichungserkennung, Rückgängig und ausdrücklich bedienbaren Neustart. Für den Vergleich können sie unabhängig vom noch offenen Raum 6 und 7 direkt in der Übersicht ausgewählt werden.
