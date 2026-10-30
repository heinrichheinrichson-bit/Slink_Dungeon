from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-motion.js');s=p.read_text(encoding='utf-8-sig').replace('f-.12','f-.24');s+="\nexport function woodStoneHeight(fall,stress=1){const f=Math.max(0,fall);return 11-stress*2-12*Math.min(f,.24)-220*Math.max(0,f-.24)**2;}\n";p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig').replace('import {positionWoodFragment}', 'import {positionWoodFragment,woodStoneHeight}')
needle=' const root=new THREE.Group();scene.add(root);'
replacement=''' const root=new THREE.Group();scene.add(root);
 // One continuous terrain body closes the module gaps. The shaft is a real
 // hole in its geometry, so only that opening reveals the underground space.
 const footprint=new THREE.Shape(),r=11,lo=-112,hi=112;
 footprint.moveTo(lo+r,lo);footprint.lineTo(hi-r,lo);footprint.quadraticCurveTo(hi,lo,hi,lo+r);footprint.lineTo(hi,hi-r);footprint.quadraticCurveTo(hi,hi,hi-r,hi);footprint.lineTo(lo+r,hi);footprint.quadraticCurveTo(lo,hi,lo,hi-r);footprint.lineTo(lo,lo+r);footprint.quadraticCurveTo(lo,lo,lo+r,lo);
 const shaft=new THREE.Path();shaft.moveTo(-33,-31);shaft.lineTo(-33,31);shaft.lineTo(33,31);shaft.lineTo(33,-31);shaft.closePath();footprint.holes.push(shaft);
 const bodyGeometry=new THREE.ExtrudeGeometry(footprint,{depth:112,bevelEnabled:true,bevelSize:2,bevelThickness:2,bevelSegments:4,curveSegments:20});bodyGeometry.translate(0,0,-110);
 const foundation=new THREE.Mesh(bodyGeometry,[mat('#515340'),mat('#343c30')]);foundation.receiveShadow=foundation.castShadow=true;root.add(foundation);
'''
assert needle in s;s=s.replace(needle,replacement)
s=s.replace('const intact=new THREE.Group(),debris=new THREE.Group();','const intact=new THREE.Group(),debris=new THREE.Group(),fissures=new THREE.Group();')
s=s.replace('root.add(intact,debris);const pieces=[];', 'root.add(intact,debris,fissures);const pieces=[];')
s=s.replace('const piece=fragment(debris,pts,m,5);','const piece=fragment(debris,pts,[m,mat(\'#a58e68\')],5);')
needle='   const cut=-4+b*2.4;'
s=s.replace(needle,"""   const crack=line(fissures,[[x-2,-28,10.7],[x-1,-19,10.7],[x+1,-12,10.7],[x-1,-2,10.7],[x+2,8,10.7],[x,19,10.7],[x+2,28,10.7]],.17,'#b19b79');crack.material.transparent=true;crack.material.opacity=0;
"""+needle)
# Splinters start outside the stone footprint so they remain visible and cannot
# intersect the load. Debris itself remains constrained below the load.
needle=' const dust=[];'
s=s.replace(needle,""" const splinters=[];if(type==='wood')for(let i=0;i<14;i++){const side=i%2?1:-1;const shard=box(root,.6+(i%3)*.2,2.2+(i%4)*.8,.6,.1,'#b29a70',0,0,0);shard.visible=false;splinters.push({mesh:shard,side,x:-25+(i%7)*8});}
"""+needle)
s=s.replace('stubs,dust});', 'stubs,dust,splinters,fissures,foundation});')
s=s.replace('const stoneFall=wood?Math.max(0,fall-.12):fall;', 'const stoneFall=fall;')
s=s.replace('11-stress*2-220*stoneFall*stoneFall', 'wood?woodStoneHeight(fall,stress):11-stress*2-220*stoneFall*stoneFall')
s=s.replace('item.intact.visible=time<1.65;', "item.foundation.visible=$('base').checked;item.fissures.visible=time<1.65;item.fissures.position.z=-stress*2.5;item.fissures.children.forEach(c=>c.material.opacity=stress*.8);item.intact.visible=time<1.65;")
s=s.replace('  item.dust.forEach', """  item.splinters.forEach((s,i)=>{const age=fall-i*.006;s.mesh.visible=age>=0&&age<.55;s.mesh.position.set(s.x+Math.sin(i*3)*age*5,s.side*(31+age*24),10+age*(24+i%4*4)-90*age*age);s.mesh.rotation.set(age*(i%2?4:-3),age*2,i*.7+age*4);});
  item.dust.forEach""")
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/bruchbodenstudie.html');s=p.read_text(encoding='utf-8-sig').replace('<button id="play"','<label class="base-option"><input id="base" type="checkbox" checked> Durchgehende Grundschicht</label><button id="play"',1);s=s.replace('</style>', '.base-option{display:flex;align-items:center;gap:9px;flex:0 0 100%}.base-option input{width:19px;min-height:19px}</style>');s=s.replace('Nurbi steht daneben als Größenvergleich.','Nurbi steht daneben als Größenvergleich. Eine durchgehende Erd-/Felsbasis schließt die Fugen; nur der Schacht bleibt offen.');p.write_text(s,encoding='utf-8')
p=Path('work/check-break-motion.mjs');s=p.read_text(encoding='utf-8-sig').replace('{positionWoodFragment}', '{positionWoodFragment,woodStoneHeight}').replace('stoneZ=9-220*Math.max(0,fall-.12)**2','stoneZ=woodStoneHeight(fall)');p.write_text(s,encoding='utf-8')
