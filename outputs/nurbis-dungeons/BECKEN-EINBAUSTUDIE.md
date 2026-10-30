# Becken-Einbaustudie

Einstieg `becken-einbaustudie.html`. Drei Bauweisen mit identischen Dungeonmodulen und Lichtbedingungen: A bündig innerhalb des belegten Rasters, B Nachbarmodule bilden die Einfassung ohne eigenen Sockel, C originale breite Garden-Einfassung mit zusätzlichem Abstand der Umgebung (20 Einheiten). Originalzustand der Wasserwerkstatt bleibt erhalten; noch keine Variante ausgewählt.

Wasser/Lava, gefüllt/leer, Spielperspektive/Draufsicht/flache Ansicht, Boden/Boden mit Wand und Rasterlinien vergleichbar. Garden-Geometrie erhält einen optionalen specOverride für die bündige Bauweise; Standardparameter bleiben unverändert.

Prüfung: tatsächliche Bounding-Box der bündigen Becken-Geometrie liegt vollständig in den drei reservierten Rasterfeldern. Alle Vergleichssteuerungen im Browser geprüft; Wasser und Lava ohne Shaderfehler. Screenshot `becken-einbaustudie.png`.

## Bewegungsvergleich mit Nurbi

Die Studie zeigt jetzt den Original-Nurbi in Original-Spielgröße (Palette Apricot, Größe 135) in allen drei Varianten. Startzustand leer mit Nurbi in der Mitte. Hin- und Rücklauf über fünf Sekunden; Positionsregler zum Anhalten und Betrachten von Rand, tieferem Beckenboden und Ausstieg. Die Füße liegen im mittleren Bereich eine Einheit über dem jeweiligen tatsächlichen Boden (-17 bzw. -20). Der Höhenwechsel am Rand ist eine geglättete Bewegungsstudie, noch keine kollisionsbasierte finale Kletteranimation.

Gefüllte Becken sperren den Durchlauf und setzen Nurbi ans Ufer. Blickwinkel, Nachbarschaft und Flüssigkeit bleiben vergleichbar. Browserprüfung: Vorwärtslauf erreicht rechtes Ufer, Rücklauf startet entgegengesetzt, Positionsregler und Füllstands-Sperre geprüft; keine Browserfehler. Screenshot `nurbi-im-leeren-becken.png`.

## Variante 1 bevorzugt · Treppenvergleich

Der Nutzer bevorzugt die bündig eingelassene Variante. Der bisherige geglättete Höhenverlauf konnte Nurbi während der Bewegung in Rand und Nachbarboden sinken lassen. Die Durchquerung berücksichtigt jetzt den Abstand des gesamten Körpers vom Rand: Abstieg erst nach Freigabe, Aufstieg vor Überlappung. Symmetrie, Randfreigabe und Bodenhöhe werden rechnerisch geprüft.

Auf Nutzerwunsch ist bei Variante 1 zusätzlich eine kleine Steintreppe an beiden Enden eingebaut. Über Checkbox mit/ohne Treppe vergleichbar. Die Höhe folgt konservativ den Stufen unter dem Körper. Ein- und Ausstieg bleiben eine Bewegungsstudie, keine fertige individuelle Pfotenauflage. Drei sichtbare Stufen führen vom Beckenboden bis unter die Randkante; letzter Höhenwechsel führt auf den Rand. Bevorzugte Variante bleibt von der noch offenen Treppenentscheidung getrennt.

Im Browser Treppen-Einbau in Spiel- und flacher Ansicht, Durchlauf und Positionsregler geprüft; keine Browserfehler. Noch nicht in die Wasserwerkstatt übernommen. Screenshot `becken-mit-steintreppe.png`.

## Nutzerentscheidung: Variante A ausgewählt

Variante A (bündig eingelassen) ist gewählt. Aktueller Entwurfsstand: eigener schmaler Rand innerhalb der belegten Rasterfelder, kleine Steintreppen an beiden Enden für den Ein-/Ausstieg und erhöhter Füllstand knapp unter dem Rand, der die Stufen vollständig verdeckt. Gemeinsame Grundlage für Wasser und Lava. B und C bleiben als Vergleich in der Studie erhalten. Die Übernahme der gewählten Geometrie und Treppen in die spielbare Wasserwerkstatt steht noch aus.
