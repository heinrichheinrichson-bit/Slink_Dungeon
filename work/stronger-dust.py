from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig').replace('life=1.35+(i%3)*.12','life=2.2+(i%3)*.16').replace('age*(inside?35:20)','age*(inside?27:15)').replace('age*26;cloud.scale','age*21;cloud.scale').replace('*(inside?.38:.29)','*(inside?.52:.42)');p.write_text(s,encoding='utf-8')
