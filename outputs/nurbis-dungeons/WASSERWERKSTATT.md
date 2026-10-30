# Wasserwerkstatt 01 · verbundene Becken

Eigenständiger Prototyp: `wasserwerkstatt.html`. Nutzt die bestätigte gelagerte Wippe in Jade/Sand mit dezenter Einfassung. Bestehende Werkstätten bleiben erhalten.

Zwei gleich große Kanäle wechseln gegensätzlich zwischen geflutet und trocken. Geflutete Felder sind gesperrt; ein abgewiesener Schritt verändert nichts. Die Wippe wird nur am abgesenkten Ende betreten, beim Betreten umgeschaltet und gerade überquert. Erneutes Überqueren schaltet zurück. Leitungen verbinden ausschließlich die Wippe mit den beiden tatsächlich geschalteten Becken, unter der Trennwand verborgen.

Testraum: obere Strecke trockenlegen, Gartensamen holen, zur Wippe zurückkehren, Wasser zurückleiten, unteren Weg zum Freund nehmen. Die rechten Bereiche sind getrennt. Beide Kanäle und mindestens zwei Schaltvorgänge sind für die Lösung nötig. Der Samen bleibt ein Mechanik-Testziel, kein festgelegtes allgemeines Sammelsystem.

Wasserflächen werden bei Zustandswechsel sichtbar angehoben/abgesenkt und ein-/ausgeblendet; leichte Oberflächenbewegung. Die Logik ist zugbasiert ohne Zeitdruck. Noch keine detaillierte Strömungssimulation oder finale Schleusen-Grafik.

Prüfung: gesperrte geflutete Felder, entgegengesetzte Wasserstände, richtungsabhängige wiederholte Schaltung, Undo-Snapshots und vollständige Lösung rechnerisch geprüft. Im Browser Schaltung, Rückgängig, Neustart und vollständige Rettung in 30 Bewegungen mit zwei Umschaltungen bestanden; keine Browserfehler. Smartphone-Breite 390 px ohne horizontales Überlaufen visuell geprüft, kein physisches Gerät getestet. Screenshot: `wasserwerkstatt.png`.

## Originalbecken, Wasser und Lava aus Nurbi’s Garden

Auf Nutzerwunsch verwenden wir die vorhandenen Garden-Becken und beide vorhandenen Flüssigkeitsdarstellungen. Originalmodule `ivory-frame.js`, `living-liquid.js` und `quiet-liquid-presets.js` aus dem Garden-Projekt sind unverändert unter `src/garden/` kopiert. Das Garden-Projekt selbst wurde nicht bearbeitet. `src/garden-basins.js` bindet die zusammenhängende Formguss-Einfassung und Flüssigkeitsmaterialien an das Dungeon-Raster an; Füllen/Leeren bleibt Teil der Dungeon-Logik. Kein Raster aus getrennten Wasserplättchen mehr. Nurbi bewegt sich auf dem tieferen Boden des leeren Beckens.

Wasserwerkstatt damit aktualisiert, vollständige Rettung in 30 Zügen erneut im Browser geprüft. Wasser- und Lava-Shader sowie Füllstandswechsel im Vergleich `beckenstudie.html` geprüft; keine Browserfehler. Lava ist als gemeinsame Darstellung integriert, ihre eigenen Gefahrenregeln sind noch nicht umgesetzt. Screenshot `garden-wasser-lava.png`.
