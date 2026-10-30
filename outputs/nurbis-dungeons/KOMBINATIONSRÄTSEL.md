# Der Umweg zum Freund

Spielbar unter `kombinationsraetsel.html`. Separates Testrätsel; bestehende Räume und Studien bleiben erhalten.

Ein Schiebestein, eine richtungsabhängige Wippe, ein Transportgitter und ein vom Siegel bedientes Zielgitter. Die Mauer im Transportbereich erzwingt einen Richtungswechsel und Platz zum Umrunden des Steins. Wippe und Siegel sind ausschließlich mit dem jeweils bedienten Gitter verbunden. Nurbi befreit einen Käfer; kein Zeitdruck, keine Gegner.

Versenkbares Gitter aus der bestätigten Studie als gemeinsames Modul `src/sinking-gate.js` herausgezogen. Wippenregeln: Zugang nur vom tiefen Ende, gerader Ausstieg, erneute Überquerung schaltet zurück. Schließen auf einen Stein im Transportgitter ist gesperrt. Steine können nicht auf Wippe oder Freund geschoben werden. Sackgassen bleiben möglich; vollständige Zustände lassen sich rückgängig machen.

Steuerung: Wischen, benachbartes Feld antippen, Richtungstasten; Z rückgängig, R Neustart. 180 ms Eingabesperre lässt einen Einzelschritt sichtbar werden. Touchknöpfe mindestens 48 × 48 px.

Validierung: Breitensuche findet kürzeste Lösung mit 32 Schritten und 11 Schüben. Vollständige Lösung im Browser nachgespielt und Sieg bestätigt. Rückgängig nach Sieg und Neustart im Browser bestätigt, keine Konsolenfehler. Kernprüfung für falschen Wippeneingang, seitlichen Ausstieg, Rückschalten, belegtes Gitter und Eck-Sackgasse erfolgreich. Die bestehende Nutzerpartie wurde während der abschließenden Prüfung nicht zurückgesetzt.
