from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/garden-basins.js');s=p.read_text(encoding='utf-8-sig').replace('outer:-2,bevel:1.5','outer:-3,bevel:2');p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/beckenstudie.html');s=p.read_text(encoding='utf-8-sig').replace('<h1>', '<p><a href="becken-einbaustudie.html">Einbau im Modulraster vergleichen →</a></p><h1>',1);p.write_text(s,encoding='utf-8')
