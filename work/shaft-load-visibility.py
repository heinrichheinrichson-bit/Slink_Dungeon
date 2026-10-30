from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig').replace('o.material.stencilWrite=item.stone.position.z<5;', 'o.material.stencilWrite=item.stone.position.z+36<5;');p.write_text(s,encoding='utf-8')
