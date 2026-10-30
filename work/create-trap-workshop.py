from pathlib import Path
r=Path('outputs/nurbis-dungeons');s=(r/'src/lever-workshop-app.js').read_text(encoding='utf-8-sig');s=s.replace("initial,act,hot,covered,canUse",'initial,act').replace("'./lever-workshop-core.js'","'./trap-workshop-core.js'").replace("message='Decke die Öffnung ab, bevor du den Durchgang betrittst.'","message='Hole den Samen und finde einen sicheren Rückweg.'")
a=s.index("$('#steamStatus').textContent=");b=s.index('// Readable 2D fallback',a)
s=s[:a]+"$('#steamStatus').textContent=state.filled?'FESTER STEINTRITT':state.opened?'KIPPBODEN OFFEN':'PLATTE NOCH GESCHLOSSEN';$('#machineStatus').textContent=state.key?'Gartensamen dabei':'Gartensamen auf der anderen Seite';$('.win').hidden=!state.won;$('#wintext').textContent='Du hast den Rückweg wiederhergestellt und den Gartensamen zum Freund gebracht.';canvas.dataset.opened=String(state.opened);canvas.dataset.filled=String(state.filled);canvas.dataset.key=String(state.key);canvas.dataset.moves=String(state.moves);\n"+s[b:]
a=s.index('const icon=');b=s.index('state.boxes.forEach',a)
s=s[:a]+"const icon={C:state.filled?'▣':state.opened?'○':'▱',K:state.key?'':'✦',F:state.won?'':'🐞'}[ch];if(icon){c.fillStyle='#c5bd91';c.font='30px sans-serif';c.textAlign='center';c.fillText(icon,(x+.5)*t,(y+.65)*t);}}));"+s[b:]
s=s.replace('Auch Wippe und Schiebewerk werden zurückgesetzt.','Auch Platte, Stein und Gartensamen werden zurückgesetzt.').replace('Die Anlage steht wieder unter Druck.','Platte und Stein sind wieder im Ausgangszustand.')
(r/'src/trap-workshop-app.js').write_text(s,encoding='utf-8')
s=(r/'hebelwerkstatt.html').read_text(encoding='utf-8-sig').replace('Hebelwerkstatt','Fallenwerkstatt').replace('HEBELWERKSTATT · 01','KIPPBODEN · 01').replace('lever-workshop.js','trap-workshop.js')
a=s.index('<nav class="variant-nav"');b=s.index('<div class="machine-state">',a)
s=s[:a]+'<nav class="variant-nav"><a href="hebelwerkstatt.html">Dampf & Wippe</a><a href="fallenwerkstatt.html" aria-current="page">Kippboden</a></nav>'+s[b:]
a=s.index('<p class="touch-instruction">');b=s.index('<div class="hint">',a)
s=s[:a]+'<p class="touch-instruction">Nachbarfeld antippen oder wischen. Die Platte öffnet sich beim Verlassen. Kein Zeitdruck. Rückgängig stellt jeden Schritt wieder her.</p>'+s[b:]
a=s.index('<div class="legend">');b=s.index('</section>',a)
s=s[:a]+'<div class="legend"><span><b>▱</b>Kippboden · hält einen Durchgang</span><span><b>○</b>Offene Falle · nicht begehbar</span><span><b>▣</b>Stein · füllt die Öffnung dauerhaft</span><span><b>✦</b>Gartensamen · zum Freund bringen</span></div>'+s[b:]
s=s.replace('Separate Hebelwerkstatt','Separate Fallenwerkstatt').replace('Separate Fallenwerkstatt · Gefährliche','Separate Fallenwerkstatt · Gefährliche')
(r/'fallenwerkstatt.html').write_text(s,encoding='utf-8')
