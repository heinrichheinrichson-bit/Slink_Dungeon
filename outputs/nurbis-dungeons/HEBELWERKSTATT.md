# Kipphebel – eigene Touch-Variante

## Aktiver Stand 02: eingelassene Bodenwippe

Der dünne aufstehende Hebel wurde vom Nutzer optisch abgelehnt. Die neue Referenz ist die Funktion eines Wippschalters, aber als Teil des Dungeon-Bodens. Die aktuelle Darstellung ersetzt ihn durch eine breite zusammenhängende Kippplatte in einem festen Rahmen mit dunkler Aussparung. Die zwei Enden sind in Salbeigrün und warmem Ocker abgesetzt und mit Griffreliefs versehen. Ein Ende steht höher, das andere liegt tiefer; beim Schalten wechseln sie ihre Höhe. Keine moderne elektrische Beschriftung übernommen.

Die Betätigung per seitlichem Anstoßen, Nurbis Nachbarfeldposition und Rückgängig bleiben erhalten. Draufsicht und drei seitliche Blickrichtungen visuell geprüft, ebenso die gekippte Stellung und Rückgängig. Nahansichten: `bodenwippe-detail.png` und `bodenwippe-draufsicht.png`. Der vorherige dünne Hebel bleibt als archivierter Stand unter `archive/hebel-v01/` erhalten.

## Ausgangsstand der Interaktion

Einstieg: `hebelwerkstatt.html`. Ventil und Wurzel bleiben als Vergleiche erreichbar. Die Wurzel-Interaktion wurde vom Nutzer nicht bevorzugt; der neue Ansatz ist ein kleiner, durch Nurbis Anschieben umkippender Hebel.

Nurbi steht neben dem Hebel. Antippen des angrenzenden Hebelfelds, ein Wisch oder die entsprechende Bildschirm-Richtungstaste lässt ihn kurz dagegenstoßen. Er bleibt auf seinem bisherigen Feld. Der Hebel kippt sichtbar nach links beziehungsweise rechts und rastet ein. Dadurch fällt der Druck ab und das Schiebewerk öffnet sich. Ein separater Aktionsknopf oder Tastaturbefehl ist nicht erforderlich. Von oben und unten wird die feste Hebelachse durch eine Meldung erklärt. Rückgängig stellt Hebel und Anlage wieder zurück.

Prüfung: Beide seitlichen Stoßrichtungen, unveränderte Spielerposition, blockierte Hebelfassung für Steine, Zustand vor Rückgängig und vollständige bewegungsbasierte Lösung rechnerisch geprüft. Im Browser: direktes Antippen des Hebels, Rückgängig und komplette Rettung in 34 Aktionen geprüft; keine Browserfehler beobachtet. Kein Test auf einem physischen Smartphone. Die grundlegende Touchsteuerung stammt aus der zuvor bei Smartphone-Breite geprüften Wurzelwerkstatt.

## Vorgemerkt: offene Kippplatte als spätere Bodenfalle

Nutzerentscheidung vom 27.10.2026: Der Entwurf mit breitem Rahmen, offener dunkler Aussparung und darüber kippender Platte bleibt ausdrücklich als mögliche Grundlage für spätere Fallen erhalten. Seine Wirkung als Bodenfalle ist für diesen Zweck interessant. Er ist noch keine ausgewählte oder fertig entwickelte Fallenmechanik.

Gesichert sind die ursprüngliche Materialstudie mit allen sechs Varianten unter `archive/wippen-materialstudie/`, die Werkstattdarstellung in `src/steam-rig.js` und die Ansichten `bodenwippe-detail.png` sowie `bodenwippe-draufsicht.png`. Die separate aktuelle Formstudie `wippenstudie.html` behandelt weiterhin den geschlossenen Wippschalter. Bei späterer Fallenentwicklung auf den offenen Entwurf zurückgreifen; keine Tiere als Gegner daraus ableiten.

## Korrigierte Mechanik: gerichtete Überquerung

Nutzerkorrektur: Die Wippe wird nicht von außen angestoßen. Nurbi betritt sie ausschließlich über das abgesenkte Ende und läuft gerade darüber. Hohes Ende und Seitenfassung blockieren den Eintritt. Beim Betreten kippt die Wippe und schaltet die Anlage um; auf dem Schalter kann Nurbi nur über das neu abgesenkte gegenüberliegende Ende weitergehen. Beim späteren Rückweg schaltet sie erneut zurück. Keine einmalige Verriegelung mehr. Das kann Wege öffnen oder schließen und ist bei Engstellen und Labyrinthen Bestandteil der Rätselplanung.

Beide Richtungen und Zustände, blockierte Eingänge/Ausgänge, Kistenblockade am Schiebewerk und unveränderte Undo-Snapshots rechnerisch geprüft. Neuer vollständiger Rettungsweg: 37 Aktionen. Im Browser Zurückschalten, Rückgängig, vollständige Rettung und Neustart geprüft. Nurbi wird beim Überqueren auf die Höhe des Schalterkörpers angehoben. Screenshot: `wippe-ueberqueren.png`.

## Leitungsführung im Modulraster

Die frei geschwungene Verbindung wurde durch flach eingelassene, mittig geführte Leitungen mit geraden Abschnitten und kleinen 90-Grad-Bögen ersetzt. Dampföffnung, Schalter und Schiebewerk sind verbunden. Die Führung nutzt den kürzesten orthogonalen Weg unabhängig von begehbaren Labyrinthwegen. Bei gleich langen L-Routen wird die stärker von Wänden verdeckte bevorzugt. Wände und darüberliegende Module verdecken die Leitung durch normale Tiefenverdeckung.

Routenprüfung: Endpunkte, Manhattan-Minimallänge, orthogonale Nachbarschaft, identische Start-/Endpunkte und Wanddurchquerung bestanden. Einbau im Browser visuell geprüft, keine Browserfehler. Screenshot `leitungen-im-raster.png`. Spielregeln unverändert.
