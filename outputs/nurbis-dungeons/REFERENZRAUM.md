# Referenzraum: Ein Platz muss wieder frei

Spielbar unter `referenzraum.html`. Eigener Spielstandspeicher; die bestehenden Reihen bleiben erhalten. Ein Raum, sieben mal sieben innere Rasterfelder, drei Schiebesteine und drei Ruheplätze. Das kompakte Gitter liegt am rechten Rand. Der Freund wartet im Inneren, abseits des Ausgangs. Keine zusätzlichen Fallen oder Schaltmechaniken.

## Nachgewiesene Planungstiefe

Die nach Schüben optimierte Suche findet ein Minimum von 23 Schüben. Eine vollständige zweite Suche, die das Wegschieben von Steinen auf belegten Zielplätzen verbietet, findet keine Lösung. Das zwischenzeitliche Freimachen eines belegten Schalters ist also notwendig, keine freiwillige Variante. Der geprüfte Ablauf enthält einen solchen Rückschritt.

Das reine Platzieren der Steine umfasst in diesem Ablauf 64 Schritte. Der vollständige Rettungsweg mit Besuch beim Freund und Verlassen des Raums hat 88 Schritte bei weiterhin 23 Schüben. Die 88 Schritte sind ein geprüfter vollständiger Weg, nicht als globale minimale Gehschrittzahl ausgewiesen.

Der Raum wurde aus rückwärts erreichbaren Endstellungen ausgewählt und anschließend um Freund und Ausgang ergänzt. Der Freund steht auf einem Feld, das der optimale Steintransport nicht als Steinplatz benötigt. Am Ende liegen beide Figuren im erreichbaren Bereich des geöffneten Ausgangs.

## Prüfung

Schiebe-Minimum und notwendige Zielräumung mit Push-State-Suche geprüft. Vollständiger Regel-Replay bis zur Rettung, alle Einzelkanten der Fluchtwege ohne Wand-/Steindurchquerung und Rückgängig bis zum Anfang geprüft. Build erfolgreich. Die vollständigen 88 Schritte in einer separaten Browserpartie nachgespielt, Sieg bestätigt. QA-Modus liest und schreibt keine Nutzerstände. Ob die notwendige Erkenntnis für Menschen angenehm herausfordernd ist, wird durch diesen Spieltest beurteilt; die Schrittzahl allein ist keine Schwierigkeitsbewertung.

## Grundlage für weitere Level

Für neue Kandidaten künftig getrennt prüfen: kompakte aktive Fläche, minimale Schübe, tatsächlich notwendige Reihenfolgen/Umparkaktionen, gültiger Fluchtweg und anschließend menschlicher Spieltest. Eine große Kandidatenzahl ersetzt diese Auswahl nicht. Dieser Raum ist eine erste Referenz und kein fertiger Katalog aus hunderten Leveln.
