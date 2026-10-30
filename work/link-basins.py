from pathlib import Path
p=Path('outputs/nurbis-dungeons/wasserwerkstatt.html');s=p.read_text(encoding='utf-8-sig').replace('<div class="machine-state">','<p><a href="beckenstudie.html" style="color:#ddc48b">Garden-Becken · Wasser & Lava →</a></p><div class="machine-state">');p.write_text(s,encoding='utf-8')
