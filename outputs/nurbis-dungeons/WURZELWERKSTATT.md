# Wurzelwerkstatt – Touch als Hauptsteuerung

`wurzelwerkstatt.html` ist eine eigene Vergleichsversion zur erhaltenen Ventil-Werkstatt. Die Materialien und bisherigen Rätsel bleiben erhalten.

## Steuerung und Verhalten

- Ein direkt benachbartes Feld antippen oder einmal in eine Richtung wischen: Nurbi macht genau einen Schritt beziehungsweise schiebt einen angrenzenden Stein.
- Keine automatische Wegsuche bei entfernten Taps, keine Eingabewarteschlange. Die präzise Schiebereihenfolge bleibt beim Spieler.
- Die ruhende Wurzel wird beim Betreten ihres Feldes automatisch belebt. Das erfordert keinen separaten Aktionsknopf und keine Taste E.
- Die Wurzel begrünt sich, entfaltet Blätter und bewegt einen kleinen Schieber an der alten Anlage. Druckentlastung und großes Schiebewerk funktionieren danach wie in der Vergleichsversion.
- Rückgängig nimmt diesen Schritt einschließlich Belebung und Anlagenzustand zurück.
- Die Bildschirm-Richtungstasten sind zusätzliche Touch-Bedienelemente. Tastaturunterstützung bleibt nur eine zusätzliche Möglichkeit für den Browser-Prototyp.

## Prüfung

Rechnerisch geprüfte komplette Rettung mit ausschließlich Bewegungen: 31 Schritte. Im Browser wurden Antippen eines Nachbarfelds, Wischen, Belebung durch direktes Antippen des Wurzelfelds, Rückgängig der Belebung und die vollständige Lösung geprüft. Layout bei 390 × 844 ohne horizontalen Überlauf geprüft; Richtungstasten bleiben im sichtbaren Bereich. Dies ist ein Browser-Test, kein Test auf einem physischen Smartphone.

## Dauerhafte Gestaltungsregel

Das fertige Spiel ist für Smartphones und hauptsächlich Touchsteuerung gedacht. Zentrale Mechaniken dürfen keine Tastatur voraussetzen. Bevor neue Aktionsknöpfe entstehen, prüfen, ob Bewegung, Schieben und Nurbis Berührung die Aktion verständlich auslösen können. Keine von Nurbi hinterlassenen Spuren; die belebte Wurzel ist ein festes Raumelement.

Die Wurzel-Variante wurde anschließend vom Nutzer nicht bevorzugt. Sie bleibt als Vergleich erhalten; der aktive neue Ansatz ist die Kipphebel-Variante unter hebelwerkstatt.html.

