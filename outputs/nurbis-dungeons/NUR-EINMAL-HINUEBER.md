# Nur einmal hinüber

Spielbar: http://127.0.0.1:4173/nur-einmal-hinueber.html

Dritter eigenständiger Referenzkandidat: vier Steine, vier Druckplatten und eine morsche Bretterfläche. Nurbi kann sie betreten; bei seinem nächsten Schritt vom Feld brechen die Bretter hinter ihm ein. Ein schwerer Stein bricht sofort durch und wird verbraucht. Der Schacht bleibt anschließend für Figur und Steine gesperrt. Rückgängig stellt den vorherigen Zustand wieder her.

Der räumliche Knackpunkt ist die später fehlende Standfläche zum Schieben eines benachbarten Steins. Die Bretter sind weder eine angehängte Schlussaktion noch eine bloße Dekoration.

## Validierung

- Eigenständiger Grundriss aus Rückwärtssuche, anschließend mit der einmaligen Überquerung vorwärts geprüft.
- Ohne Überquerung der Bretter keine Lösung in der vollständig durchsuchten Menge der Schub-/Überquerungszustände.
- Sofortiges Betreten und Zurückgehen vom Start zerstört die benötigte Standfläche; für diesen Zustand findet die vollständige Suche keine Lösung.
- Geprüfter Rettungsablauf: 112 Bewegungen, 33 Schübe und drei Räumungen bereits belegter Druckplatten. Diese Werte beschreiben die gefundene Route und sind keine globale Aussage über minimale Gehwege oder subjektive Schwierigkeit.
- In der Testlösung erfolgt der Einsturz in Schritt 64, nach 19 Schüben; danach sind weitere 14 Schübe nötig.
- Beide tatsächlichen Fluchtwege sind nach dem Einsturz frei von Wänden, Steinen und Schacht.
- Alle 112 Lösungsschritte über den sichtbaren Testerknopf im Browser erfolgreich durchgespielt; keine protokollierten Warnungen oder Fehler.
- Betreten, Verlassen, anschließende Blockade, Steinverlust und vollständiges Rückgängig im Regeltest geprüft.
- Die bisherigen Rettungsabläufe von Verzahnte Wege und Gegenläufig bleiben erfolgreich.
- Renderer verwendet den vorhandenen Bretterbruch mit Staub. Beim Einsturz nach Nurbi wird kein zusätzlicher fallender Stein eingeblendet. Die bisherigen Stein-Einsturzstudien behalten standardmäßig ihren fallenden Stein.
- Testersteuerung steht neben dem Spielfeld, damit der Knopf auf Desktop nicht zum Wegscrollen des Einsturzes führt. Touchsteuerung und responsive Ansicht werden aus dem bestehenden Rahmen übernommen; kein Test auf physischer Smartphone-Hardware in diesem Arbeitsschritt.
