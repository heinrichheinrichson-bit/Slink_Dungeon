# Bruchbodenstudie · Holz und Stein

Eigenständiger Einstieg `bruchbodenstudie.html`, aus der Bruchbodenwerkstatt verlinkt. Zwei Varianten unter denselben Licht- und Größenbedingungen. A: vier breite gealterte Holzbretter mit individueller deterministischer Maserung, Befestigungen und leichter Durchbiegung über seitlichen Auflagern. B: bestehende abgerundete Steinform aus der Materialbibliothek mit feineren unregelmäßigen Rissen.

Gemeinsamer Ablauf: Stein fährt auf, Oberfläche gibt unter Last nach, getrennte Bruchstücke fallen mit dem Stein in die Tiefe. Gedämpfte Staubpartikel begleiten den Bruch. Sichtbare Innenwände werden nach unten dunkler; Bruchreste bleiben am Rand. Stein und Trümmer verschwinden erst in der Tiefe, kein Austausch gegen ein schwarzes Feld. Nurbi steht als Größenvergleich daneben.

Abspielen/Anhalten, Zurücksetzen und Zeitregler; Spielperspektive, Draufsicht und flachere Ansicht. Vorwärts- und rückwärts Scrubbing rekonstruiert den Zustand deterministisch. Die bisherige Spielwerkstatt bleibt für Vergleiche erhalten. Noch keine Variante gewählt, noch nicht in die Spiellogik integriert. Torstudie ist weiterhin offen.

Browserprüfung: Initialzustand, Abspielen, Endzustand, Zurücksetzen, Zeitregler und Blickwinkel geprüft. Keine Browserfehler. Screenshots `bruchbodenstudie.png` und `bruchbodenstudie-schacht.png`.

## Korrektur: Bretter durchdrangen den Stein

Die freien Drehungen der Brettstücke und ihre langsamere Fallbeschleunigung konnten sie durch die Steinunterseite bewegen. Holzbretter drehen jetzt an ihren äußeren Auflagerpunkten nach unten; erst nach dem Wegknicken beginnt der vertikale Fall des Steins. Brettstücke fallen anschließend schneller. Beim Holz bleibt der Stein aufrecht. Die vollständige transformierte Bounding-Box jedes Brettstücks wird zusätzlich unterhalb der Steinunterseite gehalten, einschließlich der Fasen. Die Steinvariante wurde nicht mit dieser Holzbewegung verändert.

Prüfung `work/check-break-motion.mjs`: acht gefaste Brettstücke über jeweils 1101 Fallpositionen, keine Überschneidung mit der Steinunterseite. Im Browser Zeitregler im Bruchmoment und Zurücksetzen geprüft, keine Browserfehler. Screenshot `bretter-einsturz-korrigiert.png`.

## Durchgehende Grundschicht und lesbarer Holzbruch

Die Studie besitzt jetzt einen geschlossenen Erd-/Felskörper unter allen Modulen mit weich abgerundeter Außenkante. Nur der Schacht ist geometrisch ausgespart. Fugen zeigen die Grundschicht statt Unterwelt/Trümmer. Per Checkbox für den direkten Vergleich ausblendbar. Noch nicht als allgemeiner Unterbau in sämtliche Werkstätten übernommen.

Der Holzbruch beginnt jetzt unter der vorderen Last, bevor der Stein den ganzen Bruchbereich verdeckt. Die Rückseite des Steins bleibt zunächst auf dem Anfahrtsboden abgestützt; erst wenn der Stein vollständig über der Öffnung steht, sinkt er ab. Risse erscheinen unter Last, hellere frische Holzseiten und seitliche Splitter machen den Bruch lesbarer. Die äußeren Enden bleiben im ersten Bruchmoment sichtbar, bevor die Hälften hinunterfallen. Bretter bleiben weiterhin unter der Steinunterseite begrenzt.

Prüfung: Raycasts gegen die tatsächliche Grundkörper-Geometrie bestätigen geschlossene Fugen und eine offene Schachtmitte. Begrenzung der Holzfragmente über 1101 Fallpositionen erneut bestanden. Browser: Bruchmoment am Zeitregler, Grundschicht ein/aus, Endzustand, Reset und Wiedergabe geprüft; keine Browserfehler. Screenshot `bruchboden-grundschicht-und-bruch.png`.

## Dünne Trägerplatte, weichere Kanten, zeitlich gestaffelter Holzbruch

Nutzer findet die Gestaltung der Grundschicht gut, die massive Dicke jedoch unpassend. Grundkörper daher von 112 auf 22 Einheiten reduziert, ähnlich der Garden-Trägerplatte. Farbstimmung beibehalten. Der tiefe Schacht wird nur durch seine geometrisch abgerundete Öffnung sichtbar; Tiefengeometrie und fallende Teile werden mit einer Öffnungsmaske begrenzt, damit unter der dünnen Platte keine Schachtaußenwände oder Trümmer hervorragen.

Die grünlich-graue rechteckige Schachteinfassung wurde zurückgenommen: oberste Schachtwand abgesenkt, wärmeres Bodenmaterial, weichere Öffnung, Holzauflager kürzer und unterhalb der Oberfläche. Noch kein vom Nutzer freigegebener finaler Rand.

Der Holzbruch ist nun pro Brett zeitlich versetzt. Frische Bruchflächen und Splitter bleiben sichtbar. Stein fährt erst nach den ersten Bruchbewegungen vollständig über die Öffnung und sinkt dann nach. Nahansicht und halbe Geschwindigkeit helfen beim direkten Beurteilen, Normaltempo und Gesamtausschnitt bleiben verfügbar. Weiterhin keine Nutzerfreigabe des Effekts.

Geometrische Fugen-/Öffnungsprüfung und Fragmentbegrenzung erneut bestanden. Browser: neue Optionen, Bruchphase und Endzustand ohne Shader-/Browserfehler geprüft. Screenshot `bruchboden-duenne-grundschicht.png`.

## Rückkehr zum ersten Bruchgefühl auf Nutzerkorrektur

Der Nutzer fand den ersten sichtbaren Holzeffekt gut und beanstandete dort nur das Durchdringen des Steins. Die danach hinzugefügten kleinen Splitter und das stark verzögerte Wegklappen wurden als Rückschritt beurteilt. Daher entfernt: zusätzliche kleine Holzsplitter, gestaffeltes Verschwinden pro Brett, vorgezogener Frontlast-Bruch und verzögerter Lastfall. Wiederhergestellt: direkter Schiebeweg, gemeinsamer Bruchmoment und große frei rotierende Bretthälften. Normales Tempo und Gesamtszene sind wieder Standard.

Kollisionskorrektur nun räumlich begrenzt: Die tatsächlichen Fragmentdreiecke werden gegen den horizontalen Stein-Fußabdruck geschnitten. Nur die dort überlappende Oberfläche wird unter der Steinunterseite gehalten; außen sichtbare Bruchenden werden nicht wegen der gesamten Bounding-Box weggedrückt. Eine höhere Fallbeschleunigung der Bretter verhindert späteres Aufholen durch den Stein. Große Trümmer bleiben auf die Schachtöffnung begrenzt, zusätzliche kleine Holzsplitter sind vollständig entfernt. Dünne Grundschicht und weichere Kante bleiben erhalten.

Überlappungsprüfung über 8 Fragmente × 1101 Fallpositionen erneut bestanden. Browser: Zeitregler im Bruchmoment, ursprüngliche Normalgeschwindigkeit und flache Ansicht geprüft. Dieser Stand ist erneut zu beurteilen und nicht als Nutzerfreigabe zu behandeln.

## Staubwolke ergänzt, Bruchablauf vorerst belassen

Nutzer möchte den Bruchablauf vorerst belassen und eine Staubwolke in und über dem Loch ergänzen. Nur der Staub wurde geändert: statt fester kleiner Partikel jetzt weiche, unregelmäßige transparente Wolken. Unterhalb der Kante sind sie auf die Schachtöffnung begrenzt, darüber steigen sie auf, breiten sich aus und lösen sich auf. Gedämpfter warmer Holzstaub bzw. grauer Steinstaub. Zeitregler und Zurücksetzen rekonstruieren auch die Staubphase.

Im Browser sichtbare Wolke im Fallmoment, Endzustand und Zurücksetzen geprüft; keine Browserfehler. Screenshot `einsturz-staubwolke.png`. Der Nutzer hat die Effektqualität nicht final freigegeben; weitere Bruchänderungen sind vorerst zurückgestellt.

## Natürliche zurückbleibende Bruchkanten

Die regelmäßigen drei Klötzchen pro Seite wurden entfernt. Holz: vier mit den ursprünglichen Brettern ausgerichtete Restenden pro Seite, unterschiedlich lang, mit individuell unregelmäßigen Ausrissen und helleren frischen Bruchseiten. Keine identisch wiederholte Zackenfolge. Stein: wenige unregelmäßige Abplatzungen an unterschiedlichen Stellen des Öffnungsrands statt einer Reihe aufgesetzter Blöcke. Verwendet das ursprüngliche Steinmaterial.

Nur die verbleibenden Kanten wurden geändert; Fallbewegung und verstärkte längere Staubwolke bleiben erhalten. Bundle gebaut und Endzustand in der Nahansicht im Browser geprüft, keine Browserfehler. Screenshot `natuerliche-bruchkanten.png`.

### Freier Fallweg (28.10.)
Randreste deutlich gekürzt und auf die Auflager zurückgezogen. Unregelmäßige Holz- und Steinkanten bleiben erhalten. Der Schiebestein fällt in beiden Studien aufrecht. Geometrieprüfung einschließlich Fasen: mindestens 1,28 Einheiten Abstand zwischen Reststücken und Stein-Fallquerschnitt. Staub und Bruchbewegung unverändert.


### Längerer, räumlicher Staub
24 zeitversetzte Wolken auf drei Höhenlagen. Schneller erster Auftrieb, danach langsames Weitersteigen; längere Standzeit und weiches Ausblenden über 4,3–5,14 Sekunden pro Wolke. Kleinere rundliche Wolken statt flach auseinandergezogener Flächen. Studienablauf auf acht Sekunden verlängert, damit der Staub vollständig ausklingen kann.

