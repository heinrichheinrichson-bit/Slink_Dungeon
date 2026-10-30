# Fallenwerkstatt 01: alter Kippboden

Einstieg: `fallenwerkstatt.html`. Eigenständiger erster Mechanikprototyp; Dampfwerkstatt und Studien bleiben erhalten. Greift die vorgemerkte offene Kippplatte als Fallenidee auf. Keine Tiere als Gegner, kein Echtzeitdruck.

Die Platte trägt Nurbi beim ersten Betreten. Beim Verlassen klappt sie auf und unterbricht den Rückweg. Das offene Feld ist nicht begehbar; gefährliche Schritte werden unverändert zurückgewiesen. Ein hineingeschobener Stein wird als fester Tritt eingesetzt, aus den schiebbaren Steinen entfernt und macht den Weg dauerhaft begehbar. Rückgängig stellt auch Platte und eingesetzten Stein wieder her.

Kleiner Testraum: Gartensamen holen, Stein für den Rückweg einsetzen, zum wartenden Freund zurückkehren. Der Samen ist hier ein Testziel für den notwendigen Hin- und Rückweg, keine Entscheidung für ein allgemeines Sammelsystem.

Rechnerisch geprüft: erster Eintritt, Öffnen beim Verlassen, Gefahrenabwehr ohne Zustandsänderung, Einsetzen des Steins, unveränderte Undo-Snapshots und vollständige Lösung in 25 Bewegungen. Im Browser vollständige Rettung, Rückgängig, Neustart, Öffnungsdarstellung und Meldungen geprüft. Keine Browserfehler. Kein Test auf einem physischen Smartphone.

## Fehlerkorrektur: zurückbleibender Stein im 3D-Bild

Beim Füllen entfernte die Spiellogik den beweglichen Stein korrekt, der Renderer blendete dessen bisheriges Mesh aber nicht aus. Dadurch sah es aus, als liefe Nurbi durch einen weiterhin vorhandenen Stein. Der Renderer gleicht jetzt auch die Anzahl sichtbarer Steinmodelle ab und zeigt bei Rückgängig wieder den korrekten beweglichen Stein. Der eingesetzte Tritt verwendet dasselbe Steinmodell mit sichtbarer Bewegung ins Loch und Absenkung auf Bodenhöhe.

Im Browser: Einsetzen bei Aktion 19 visuell geprüft (kein alter Stein auf dem Vorgängerfeld), Rückgängig auf Aktion 18, erneutes Einsetzen und Rettung bei Aktion 25. Keine Browserfehler. Kernprüfungen weiterhin bestanden. Screenshot `kippboden-stein-korrigiert.png`.
