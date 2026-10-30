from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/basin-mount-study.js');s=p.read_text(encoding='utf-8-sig');s="import {basinTraversal} from './basin-traversal.js';\n"+s
a=s.index(" const gap=item.mount==='original'?20:0,x=");b=s.index(' item.nurbi.group.position.set',a)
s=s[:a]+" const {x,z}=basinTraversal(progress,item.mount);\n"+s[b:];p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/becken-einbaustudie.html');s=p.read_text(encoding='utf-8-sig').replace('A · IM RASTER','A · BEVORZUGTE VARIANTE');p.write_text(s,encoding='utf-8')
