from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig').replace('time/4*1000','time/5*1000').replace('time>=4','time>=5').replace('/1000*4','/1000*5').replace('Math.min(4,time+','Math.min(5,time+').replace('time===4','time===5');p.write_text(s,encoding='utf-8')
