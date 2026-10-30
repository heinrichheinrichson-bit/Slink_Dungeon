# Acht Wege unter den Gärten

Spielbar unter `raetselreihe.html`. Neue Schiebe- und Bodenräume sowie weiterverwendete/angepasste Werkstattregeln sind gemeinsam frei anwählbar. Die separaten Studien und bisherigen Rätsel bleiben bestehen.

| Raum | Mechaniken | Kürzeste Lösung |
|---|---|---|
| 1. Zwei freie Wege | Zwei Steine, zwei Ruheplätze; keine Schalter oder Tore | 25 Schritte |
| 2. Der leichte und der schwere Weg | Leichte Figur, schwerer Stein, brüchige Holzbretter, sicherer Umweg | 11 Schritte |
| 3. Die Platte hinter dir | Kippplatte öffnet nach Überqueren, Stein füllt Loch, Samen zurückbringen | 25 Schritte |
| 4. Der Umweg zum Freund | Richtungswippe, versenkbares Transportgitter, Siegel und Zielgitter | 32 Schritte |
| 5. Das vergessene Druckwerk | Dampföffnung abdecken, Wippe, Schiebewerk auf Schienen, Stein wiederverwenden | 38 Schritte |
| 6. Die wandernden Wasser | Wasser zwischen Becken verlagern, Samen holen, zurückschalten | 31 Schritte |
| 7. Unter dem warmen Gestein | Lava zwischen Becken verlagern, getrennte Wege | 27 Schritte |
| 8. Zwei Wege, ein Schiebewerk | Gekoppelte Steinriegel, begehbare Platten und Parknischen | 30 Schritte |

## Darstellung und Bedienung

Die neuen Räume nutzen den gemeinsamen Dungeon-Renderer. Alle Gitter dieser Reihe versinken im Boden, ohne Transparenz. Der Holzbruch übernimmt Maserung, große Bruchstücke, den freien Fallquerschnitt und die länger aufsteigende Staubwolke der Studie. Eine dünne Grundschicht schließt die Bodenfugen und hat echte Aussparungen an den Löchern. Wasser und Lava verwenden den flachen Beckeneinbau mit Treppen an den beiden Ufern; die Figur folgt dem Höhenprofil aus der Einbaustudie.

Wischen, Nachbarfelder antippen oder Richtungstasten. Jeder Raum hat seinen eigenen Zustand samt Rückgängig-Verlauf; Fortschritt und aktueller Raum werden lokal gespeichert. Raum-Neustart betrifft nur den ausgewählten Raum. Der Prüfmodus `?qa=1` liest und schreibt keine Nutzer-Spielstände.

## Verifikation

Alle acht Räume per Breitensuche auf Lösbarkeit geprüft und ihre vollständigen Lösungswege in einer separaten Browserpartie nachgespielt; acht bestätigte Siege. Vollständige Zustände bis zum Anfang rückwärts geprüft. Gezielter Steinverlust im Bretterloch und Rückgängig im Browser bestätigt. Raumwechsel erhält den Zwischenstand; Neustart stellt ihn zurück. Nach Korrektur der Materialfreigabe alle Raumwechsel ohne Konsolenfehler geprüft. Layout bei 390 px: keine horizontale Überbreite; Richtungsknöpfe 50 px breit. Die temporäre Bildschirmgröße wurde zurückgesetzt.

Noch eine Konzeptreihe zur Beurteilung der Mechaniken; kein finaler Schwierigkeitsverlauf.
