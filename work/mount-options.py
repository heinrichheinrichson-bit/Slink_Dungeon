from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/garden/ivory-frame.js');s=p.read_text(encoding='utf-8-sig').replace("style='soft',pitch=80}={})", "style='soft',pitch=80,specOverride={}}={})").replace('const spec=IVORY_STYLES[style];if(!spec)', 'const baseSpec=IVORY_STYLES[style];if(!baseSpec)').replace("throw Error('Unknown ivory style');let occupied", "throw Error('Unknown ivory style');const spec={...baseSpec,...specOverride};let occupied");p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/src/garden-basins.js');s=p.read_text(encoding='utf-8-sig').replace("initialOff=false})", "initialOff=false,mount='original'})").replace("style:'soft',pitch});", "style:'soft',pitch,specOverride:mount==='flush'?{outer:-2,bevel:1.5,inset:7,corner:16}:{}});")
s=s.replace('n*pitch/2,3);group.add(frame.group);', "n*pitch/2,8-frame.spec.bevel);if(mount!=='neighbors')group.add(frame.group);")
p.write_text(s,encoding='utf-8')
