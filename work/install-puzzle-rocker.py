from pathlib import Path
r=Path('outputs/nurbis-dungeons/src');s=(r/'rocker-study.js').read_text(encoding='utf-8-sig')
a=s.index('const designs=');b=s.index('let paletteIndex=')
data=s[a:b].replace('const designs=','export const designs=').replace('const palettes=','export const palettes=')
helpers=s[s.index('function material('):s.index('function build(')]
a=s.index(' box(base,67,64');b=s.index(' const camera=',a)
model=s[a:b].replace('} const camera=', '}')
# The final axis block ends immediately before the camera declaration.
module="import * as THREE from 'three';\nimport {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';\n"+data+helpers+"\nexport function createFloorRocker({form=1,palette=1,decor='inlay',density=.25}={}){\n const d=designs[form]||designs[1],skin=palettes[palette]||palettes[1];const scene=new THREE.Group(),base=new THREE.Group();scene.add(base);\n"+model+"\n rocker.rotation.y=-.20;return {group:scene,rocker};\n}\n"
(r/'floor-rocker.js').write_text(module,encoding='utf-8')
# Both study and puzzle use the same accepted geometry and decoration implementation.
a=s.index(' // A solid filled housing');b=s.index(' const camera=',a)
s=s[:a]+" const {group,rocker}=createFloorRocker({form:index,palette:paletteIndex,decor,density});scene.add(group);\n"+s[b:]
s="import {createFloorRocker} from './floor-rocker.js';\n"+s
(r/'rocker-study.js').write_text(s,encoding='utf-8')
p=r/'steam-rig.js';s=p.read_text(encoding='utf-8');s="import {createFloorRocker} from './floor-rocker.js';\n"+s
a=s.index(' // Broad recessed');b=s.index(' }else if(rootMode)',a)
s=s[:a]+" const floorSwitch=createFloorRocker({form:1,palette:1,decor:'inlay',density:.25});\n floorSwitch.group.position.set(ax,ay,10);world.add(floorSwitch.group);lever=floorSwitch.rocker;\n"+s[b:]
s=s.replace('s.off?.24:-.24','s.off?.20:-.20');p.write_text(s,encoding='utf-8')
