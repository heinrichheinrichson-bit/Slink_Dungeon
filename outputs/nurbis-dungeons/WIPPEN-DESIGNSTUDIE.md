# Bodenwippen: bestätigte Formen und Gestaltungsstudie

Stand 27.10.2026: Der Nutzer hat alle vier geschlossenen Bauformen bestätigt. Kompakte Wippe, gewölbte Taste, gelagerte Wippe und zwei Druckenden bleiben als Varianten für unterschiedliche Rätsel erhalten. Verschiedene Schalter könnten später verschiedene Funktionen haben; eine feste Zuordnung wurde noch nicht beschlossen.

Der neutrale Formstand ist unter `archive/wippen-formstudie/` inklusive Quellcode gesichert. Die offene Kippplatte ist unabhängig davon unter `archive/wippen-materialstudie/` als möglicher Fallenentwurf erhalten (siehe FALLEN-VORMERKUNG.md).

Aktuelle Studie: `wippenstudie.html`. Sechs Farbwelten und sieben unabhängige Dekoroptionen, einschließlich ganz rein; Stärke in fünf Stufen. Alle vier Vorschauen erhalten dieselbe Einstellung für den direkten Vergleich. Dekor folgt den tatsächlichen Oberflächen der vier Bauformen. Naturdetails bleiben lokal und sparsam. Schaltstellungen und vier Blickwinkel sind vergleichbar. Die Spielwerkstatt wurde nicht auf eine neue Gestaltung festgelegt.

Prüfung: Bundle erfolgreich gebaut; Farbwechsel, Dekorwechsel, Stärke, Bauformwechsel und Kippen im Browser geprüft. Gewölbte Oberfläche visuell geprüft. Phone-Breite 390 px ohne horizontales Überlaufen geprüft.

## Nutzerfreigabe: vollständige Farb- und Dekorpalette

Alle sechs Farbwelten und alle sieben Dekorvarianten bleiben erhalten, einschließlich reiner Varianten und der einstellbaren Dekorstärken. Nutzerentscheidung vom 27.10.2026: In den Rätseln damit variieren, jeweils passend zum übrigen Rätseldesign, den Materialien und der Farbgebung des Dungeons. Keine einzelne Gestaltung als alleinigen Standard auswählen; die Studie bleibt für spätere Weiterarbeit bestehen.

Die vier bestätigten Bauformen bleiben ebenfalls erhalten. Falls Schalter später verschiedene Funktionen erhalten, muss deren Kennzeichnung unabhängig von der frei an die Umgebung angepassten Schmuckfarbe verständlich sein. Eine konkrete Funktionszuordnung ist noch offen.

## Erster Einsatz im Rätsel

Die spielbare `hebelwerkstatt.html` nutzt jetzt die bestätigte gewölbte Wippe mit Schiefer/Messing und sparsamer Einfassung (25 %), passend zu den dunklen Steinwänden und warmen Anlagenteilen. Geometrie und Dekoration kommen aus `src/floor-rocker.js`, das auch die Studie verwendet. Die offene Fallenform bleibt archiviert.

Bewegungsregeln unverändert. Rechnerische Prüfung bestanden; im Browser vollständige Rettung in 34 Aktionen, anschließend Rückgängig und Neustart geprüft. Keine Browserfehler. Bild: `wippe-im-raetsel.png`.
