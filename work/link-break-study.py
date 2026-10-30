from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig').replace("mode==='low'?280:700", "mode==='low'?600:700");p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/bruchbodenwerkstatt.html');s=p.read_text(encoding='utf-8-sig').replace('<div class="machine-state">','<p><a href="bruchbodenstudie.html" style="color:#ddc48b">Holz & Stein · Einsturzstudie →</a></p><div class="machine-state">');p.write_text(s,encoding='utf-8')
