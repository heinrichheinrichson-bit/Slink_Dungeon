# Fünf Mechaniktests und eine gezielte Rätselstudie

Die Materialstudie bleibt unter `steinstudie.html` vollständig erhalten. Der zusätzlich eingefrorene Stand liegt unter `archive/materialstudie-v04/index.html`, einschließlich Browser-Bundle, CSS und Studienquelltext. Die sechs Grundfarben, die gemeinsame Modulform, organische Motivausprägungen und die vier Stärken Rein / Fast rein / Mittel / Stark bleiben erhalten.

Das Spiel nutzt eine aus diesem Stand übernommene Materialbibliothek. Aktuelle Räume:

1. Das leise Labyrinth – Orientierung ohne Steine, Schalter oder Tore.
2. Steine im Weg – Schieben ohne Schalter und Tore; notwendige Schiebezüge öffnen den Weg.
3. Die verwinkelte Passage – Labyrinth und Schieben ohne Tor.
4. Das Tor in der Mitte – eine Platte und ein eingefasstes Tor; hinter dem Tor geht der Schiebeweg weiter.
5. Die große Wurzelkammer – drei Steine, zwei gleichzeitig benötigte Siegel und zusätzliche Wege hinter dem Tor.
6. Die verborgene Verbindung – bewusst konstruierter Umweg mit einem Stein und einem Siegel; mehrere irreversible Fehlzüge. Dieser Raum öffnet sich beim Start. Die ersten fünf bleiben als Mechaniktests erhalten. Die Raumdaten aller sechs Räume liegen zusätzlich in `puzzles.json`.

Reine und fast reine Module überwiegen. Akzente bilden wenige lokale, unregelmäßige Gruppen; die Zuordnung ist je Raum und Position stabil. Schiebesteine haben einen hellen Ring und einen anderen Materialton als die festen Wände. Nurbi hinterlässt keine Spuren.

Alle fünf überarbeiteten Räume sind rechnerisch auf Lösbarkeit geprüft. Die vier Schieberäume lassen sich mit unbeweglichen Steinen nicht lösen; bei den zwei Räumen mit Tor ist das Tor zwingend. Gefundene Lösungen benötigen 13–27 Schritte. Alle fünf wurden im Desktop-Browser bis zur Rettung durchgespielt. Die Tororientierung ist für horizontale und vertikale Anschlusswände geprüft; feste Pfosten und ein Querbalken verankern die Torblätter in der Öffnung. Die Spiellogik verhindert das Schieben von Steinen auf den Freund.

Gestaltungsregel: kein ständig wiederholter großer Gefängnisabschnitt am Ende. Räume unterscheiden sich in Topologie und Aufgabe. Bereiche hinter Toren sollen selbst Spielraum sein. Einfache frühe Räume sind erlaubt; das spätere fertige Spiel soll auch sehr komplexe, schwere Rätsel enthalten. Diese fünf sind weiterhin kleine Mechanik- und Materialentwürfe, keine finale Schwierigkeitsskala. Fallen und Gefahren bleiben für eine spätere Entwicklungsphase.

Rückgängig und Neustart sind auf Logikebene für alle fünf Räume geprüft. Das unveränderte Bedienlayout wurde bereits bei 390 × 844 geprüft. Keine Aussage über tatsächliche Android-/iOS-Geräteleistung oder kalibrierte Schwierigkeit. Die erste Version der fünf Räume bleibt unter `archive/dungeons-v01/` als Vergleich erhalten.

## Prüfstand der gezielten Rätselstudie

Raum 6 wurde nicht anhand seiner Größe oder Steinzahl als schwer eingestuft. Die gezielt geprüften Eigenschaften sind:

- Luftlinienabstand des Steins zum Siegel auf dem Raster: 4 Schritte.
- Tatsächliches Minimum: 12 Schiebezüge. Der Stein muss zunächst weiter vom Ziel wegbewegt werden.
- Kürzeste Gesamtlösung: 46 Schritte mit 14 Schiebezügen. Eine Lösung mit minimalen Schiebezügen benötigt mehr Gehbewegungen.
- Ein anfangs erreichbarer Zug, der die Distanz zum Siegel verkürzt, führt zu einem nachweislich unlösbaren Zustand; der Stein ist dabei nicht bloß in einer offensichtlichen Ecke.
- Entlang der kürzesten Lösung sind zusätzlich mindestens zwei unmittelbar mögliche falsche Schiebeentscheidungen mit irreversibler Sackgasse geprüft.
- Mit geschlossen gehaltenem Tor oder unbeweglichem Stein ist das Ziel nicht erreichbar.
- Vollständige Lösung im Browser bis zur Rettung durchgespielt; Rückgängig und Neustart geprüft. Kein kalibriertes Schwierigkeitsurteil und keine Behauptung über einen beim Menschen erlebten Aha-Moment.

Studie, Materialien, Grundfarben, Detailstärken und die Spurenfreiheit bleiben erhalten.
