from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/weight-workshop-core.js');s=p.read_text(encoding='utf-8-sig').replace('#...#..S..#','#...#..S#.#');p.write_text(s,encoding='utf-8')
