from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig');s="import {createDungeonFoundation} from './dungeon-foundation.js';\n"+s
a=s.index(' const footprint=new THREE.Shape()');b=s.index('for(let y=-1;',a)
s=s[:a]+" const foundation=createDungeonFoundation();root.add(foundation);\n "+s[b:];p.write_text(s,encoding='utf-8')
