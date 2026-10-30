# Gegenläufig

Spielbar: http://127.0.0.1:4173/gegenlaeufig.html

Neuer Grundriss mit vier Steinen, vier Druckplatten, einer richtungsabhängigen Bodenwippe und zwei gegenläufigen inneren Gittern. Alle vier Druckplatten halten ausschließlich das Ausgangsgitter offen. Die Wippe steuert ausschließlich die beiden inneren Gitter; nur zu diesen führen ihre Leitungen.

Die Wippe kann nur vom abgesenkten Ende betreten werden. Beim Betreten schaltet sie um. Der nächste Schritt muss die Überquerung gerade vollenden. Ein versperrtes anderes Ende und ein Stein im schließenden Gitter verhindern das Umschalten.

## Entwurf und Prüfung

- Eigenständiger Grundriss; kein übernommenes Fremdlevel und keine bloß angehängte Schalterstation am vorigen Raum.
- Suche mit Schub- und Wippenübergängen sowie Erreichbarkeitsregionen. Die gefundene Route benötigt 44 Schübe und drei Wippenbetätigungen. 44 ist hier die Schubzahl der geprüften Route, kein unabhängig bewiesenes globales Schubminimum.
- Eine vollständige eingeschränkte Suche findet keine Lösung mit höchstens zwei Wippenbetätigungen.
- Vollständiger Rettungsablauf: 238 einzelne Bewegungen. Die Schrittzahl ist kein bewiesenes Gehwegminimum.
- Beide Fluchtwege werden im endgültigen Gitterzustand geprüft. Die Wegsuche führt nicht über die Wippe: Ein solches Betreten würde die Anlage erneut verändern.
- Alle 238 Bewegungen mit dem sichtbaren Testerknopf im Browser durchgespielt. Sieg erreicht, keine protokollierten Browserfehler.
- Regelfälle für falsche Einstiegsrichtung, seitlichen Einstieg/Ausstieg, blockiertes anderes Ende und Stein im schließenden Gitter geprüft.
- Vollständiges Rückgängig im Regeltest; der bisherige Raum Verzahnte Wege besteht seinen Rettungs- und Rückgängigtest weiterhin.
- Die Smartphone-Darstellung und Wisch-/Nachbarfeldsteuerung werden aus dem bestehenden kompakten Testrahmen übernommen. Dieser neue Raum wurde noch nicht auf physischer Android-/iOS-Hardware geprüft.

## Testersteuerung

Nächster Lösungsschritt führt genau eine gewöhnliche Bewegung aus. Lösung von vorn setzt den Raum ausdrücklich zurück. Abweichungen vom vorgegebenen Ablauf sperren die Fortsetzung bis zum Rückgängigmachen oder Neustart. Der Abgleich enthält auch die Stellung der Wippe. Die Lösung ist ausschließlich ein Testwerkzeug und kein Teil der späteren Spielanforderung.
