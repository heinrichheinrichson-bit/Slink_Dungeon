from pathlib import Path
r=Path('outputs/nurbis-dungeons');s=(r/'src/trap-workshop-app.js').read_text(encoding='utf-8-sig').replace('initial,act}', 'initial,act,flooded}').replace("'./trap-workshop-core.js'","'./water-workshop-core.js'").replace("message='Hole den Samen und finde einen sicheren Rückweg.'","message='Oben geflutet, unten trocken. Die Wippe liegt links in der Mitte.'")
a=s.index("$('#steamStatus').textContent=");b=s.index('// Readable 2D fallback',a)
s=s[:a]+"$('#steamStatus').textContent=state.off?'OBEN TROCKEN · UNTEN GEFLUTET':'OBEN GEFLUTET · UNTEN TROCKEN';$('#machineStatus').textContent=(state.off?'Tiefes Wippenende rechts':'Tiefes Wippenende links')+' · '+(state.key?'Samen dabei':'Samen noch oben');$('.win').hidden=!state.won;$('#wintext').textContent='Du hast beide Kanäle passend umgeleitet und den Gartensamen zum Freund gebracht.';canvas.dataset.off=String(state.off);canvas.dataset.key=String(state.key);canvas.dataset.moves=String(state.moves);\n"+s[b:]
s=s.replace("const icon={C:state.filled?'▣':state.opened?'○':'▱',K:state.key?'':'✦',F:state.won?'':'🐞'}[ch]", "const icon={U:flooded(state,ch)?'≈':'·',W:flooded(state,ch)?'≈':'·',A:state.off?'←':'→',K:state.key?'':'✦',F:state.won?'':'🐞'}[ch]")
s=s.replace('Auch Platte, Stein und Gartensamen','Auch Wippe, Wasserstände und Gartensamen').replace('Platte und Stein sind wieder im Ausgangszustand.','Beide Becken sind wieder im Ausgangszustand.')
(r/'src/water-workshop-app.js').write_text(s,encoding='utf-8')
s=(r/'fallenwerkstatt.html').read_text(encoding='utf-8-sig').replace('Fallenwerkstatt','Wasserwerkstatt').replace('KIPPBODEN · 01','WASSERBECKEN · 01').replace('trap-workshop.js','water-workshop.js')
a=s.index('<nav class="variant-nav"');b=s.index('<div class="machine-state">',a)
s=s[:a]+'<nav class="variant-nav"><a href="hebelwerkstatt.html">Dampf</a><a href="fallenwerkstatt.html">Kippboden</a><a href="wasserwerkstatt.html" aria-current="page">Wasser</a></nav>'+s[b:]
a=s.index('<p class="touch-instruction">');b=s.index('<div class="hint">',a)
s=s[:a]+'<p class="touch-instruction">Nachbarfeld antippen oder wischen. Wippe nur vom tiefen Ende gerade überqueren. Wasser wechselt zwischen den Becken. Kein Zeitdruck.</p>'+s[b:]
a=s.index('<div class="legend">');b=s.index('</section>',a)
s=s[:a]+'<div class="legend"><span><b>≈</b>Gefluteter Kanal · gesperrt</span><span><b>·</b>Trockener Kanal · begehbar</span><span><b>↔</b>Wippe · verlagert das Wasser</span><span><b>✦</b>Gartensamen · oben holen, unten abgeben</span></div>'+s[b:]
(r/'wasserwerkstatt.html').write_text(s,encoding='utf-8')
p=r/'fallenwerkstatt.html';s=p.read_text(encoding='utf-8-sig').replace('<a href="fallenwerkstatt.html" aria-current="page">Kippboden</a>','<a href="fallenwerkstatt.html" aria-current="page">Kippboden</a><a href="wasserwerkstatt.html">Wasser →</a>');p.write_text(s,encoding='utf-8')
