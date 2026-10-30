from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig');s="import {positionWoodFragment} from './break-motion.js';\n"+s
a=s.index('    const f=fall,free=');b=s.index('\n   }else{',a);s=s[:a]+"    positionWoodFragment(p,fall,item.stone.position.z-.6);"+s[b:];p.write_text(s,encoding='utf-8')
