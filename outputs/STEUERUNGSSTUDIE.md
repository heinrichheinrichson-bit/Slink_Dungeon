# Steuerungsstudie · Android 0.1.3

Über die bestehende Test-App installieren, nicht vorher deinstallieren. Paket-ID und Signatur bleiben gleich.

Im Spiel unten zwischen A Steuerkreuz, B Daumenfeld und C Nur Wischen umschalten. Das Rätsel und alle bisherigen Züge bleiben beim Wechsel erhalten. A und B lassen sich links/rechts platzieren. Die Auswahl wird in der APK gespeichert. Wischen und Nachbarfeld-Tippen bleiben bei A/B ebenfalls möglich.

Daumenfeld: in der Mitte ansetzen, mindestens 22 Bildschirmpunkte in eine klare Richtung ziehen und loslassen. Ein Loslassen ergibt genau einen Bewegungsversuch. Keine Wiederholung beim Halten. Sehr kleine oder fast diagonale Gesten lösen keinen Schritt aus.

Rückgängig ist oben. Hilfe, Raumwahl und Neustart im Menü rechts oben. Unter Tester kann die Lösungsleiste am Spielfeld eingeblendet werden.

Die Spielfeldgröße wird aus der tatsächlich verbleibenden Höhe und Breite berechnet. Bei hohen Displays begrenzt die Breite die Größe auch ohne Steuerfeld. Bei wenig Höhe kann Wischsteuerung entsprechend mehr Platz für das Spielfeld freigeben.

Geprüft im Browser: Steuerkreuz, Daumen-Ziehbewegung, Wischen, Rückgängig, Links/Rechts-Wechsel ohne Rücksetzen, Lösungsschritte. Bei 360 x 640 passen Spielfeld, Steuerkreuz und Lösungsleiste ohne Seitenscrollen ins Fenster. APK gebaut und Signatur geprüft; Bediengefühl auf dem physischen S22 bleibt zu testen. Keine Änderungen an Rätsellogik oder Lösungen.
