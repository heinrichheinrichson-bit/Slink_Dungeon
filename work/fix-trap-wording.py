from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/trap-workshop-core.js');s=p.read_text(encoding='utf-8-sig').replace('Der Rückweg ist jetzt offen.','Der Rückweg ist jetzt unterbrochen.');p.write_text(s,encoding='utf-8')
