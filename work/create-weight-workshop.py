from pathlib import Path
r=Path('outputs/nurbis-dungeons');s=(r/'src/trap-workshop-app.js').read_text(encoding='utf-8-sig').replace('initial,act}', 'initial,act,plate}').replace('trap-workshop-core','weight-workshop-core').replace('Hole den Samen und finde einen sicheren Rückweg.','Bringe den Stein auf das Siegel. Vermeide die rissige Stelle mit dem Stein.')
s=s.replace("state.filled?'FESTER STEINTRITT':state.opened?'KIPPBODEN OFFEN':'PLATTE NOCH GESCHLOSSEN'", "state.opened?'BODEN EINGEBROCHEN':'BODEN TRÄGT NURBI'").replace("state.key?'Gartensamen dabei':'Gartensamen auf der anderen Seite'", "plate(state)?'Siegel belegt · Tor offen':state.boxes.length?'Stein für das Siegel erhalten':'Stein verloren · Rückgängig möglich'").replace('Du hast den Rückweg wiederhergestellt und den Gartensamen zum Freund gebracht.','Du hast einen sicheren Schiebeweg gefunden und den Freund befreit.').replace('Auch Platte, Stein und Gartensamen','Auch Boden, Stein und Siegel').replace('Platte und Stein sind wieder im Ausgangszustand.','Boden und Stein sind wieder im Ausgangszustand.')
s=s.replace("{C:state.filled?'▣':state.opened?'○':'▱',K:state.key?'':'✦',F:state.won?'':'🐞'}", "{T:state.opened?'○':'⌁',S:'◎',G:plate(state)?'·':'▥',F:state.won?'':'🐞'}")
(r/'src/weight-workshop-app.js').write_text(s,encoding='utf-8')
s=(r/'fallenwerkstatt.html').read_text(encoding='utf-8-sig').replace('Fallenwerkstatt','Bodenwerkstatt').replace('KIPPBODEN · 01','TRAGFÄHIGKEIT · 01').replace('trap-workshop.js','weight-workshop.js')
a=s.index('<nav class="variant-nav"');b=s.index('<div class="machine-state">',a)
s=s[:a]+'<nav class="variant-nav"><a href="fallenwerkstatt.html">Kippboden</a><a href="schieberwerkstatt.html">Riegel</a><a href="bruchbodenwerkstatt.html" aria-current="page">Brüchiger Boden</a></nav>'+s[b:]
a=s.index('<p class="touch-instruction">');b=s.index('<div class="hint">',a)
s=s[:a]+'<p class="touch-instruction">Nachbarfeld antippen oder wischen. Nurbi darf über die Risse laufen. Ein Stein lässt die Stelle einbrechen. Rückgängig stellt auch den verlorenen Stein wieder her.</p>'+s[b:]
a=s.index('<div class="legend">');b=s.index('</section>',a)
s=s[:a]+'<div class="legend"><span><b>⌁</b>Risse · tragen Nurbi, keinen Stein</span><span><b>○</b>Eingebrochen · gesperrt</span><span><b>▣</b>Stein · zum Siegel schieben</span><span><b>◎</b>Siegel · öffnet das Tor</span></div>'+s[b:]
(r/'bruchbodenwerkstatt.html').write_text(s,encoding='utf-8')
