from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig');s="import {createGardenBasins} from './garden-basins.js';\n"+s
s=s.replace('waterSwitch,steamRig,from=', 'waterSwitch,gardenBasins,steamRig,from=')
s=s.replace('steamRig?.dispose();steamRig=null;', 'steamRig?.dispose();steamRig=null;gardenBasins?.dispose();gardenBasins=null;')
s=s.replace("if(c!=='C'){const floor=", "if(c!=='C'&&!(level.water&&(c==='U'||c==='W'))){const floor=")
a=s.index("if(level.water&&(c==='U'||c==='W')){");b=s.index("if(level.water&&c==='A')",a);s=s[:a]+s[b:]
s=s.replace('}));if(level.workshop)',"}));if(level.water){gardenBasins=createGardenBasins({map:level.map,liquidType:level.liquidType||'water'});world.add(gardenBasins.group);}if(level.workshop)")
s=s.replace("toZ=l.lever&&l.map[s.p[1]]?.[s.p[0]]==='A'?25:11;", "toZ=l.lever&&l.map[s.p[1]]?.[s.p[0]]==='A'?25:l.water&&['U','W'].includes(l.map[s.p[1]]?.[s.p[0]])?-19:11;")
s=s.replace('waterTiles.forEach(tile=>{', 'if(gardenBasins)gardenBasins.update(!!lastState?.off,t,dt);waterTiles.forEach(tile=>{')
p.write_text(s,encoding='utf-8')
