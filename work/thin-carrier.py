from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-foundation.js');s=p.read_text(encoding='utf-8-sig');a=s.index(' const shaft=new THREE.Path()');b=s.index(' const material=',a)
s=s[:a]+''' const shaft=new THREE.Path(),x=33,y=31,c=7;
 shaft.moveTo(-x,-y+c);shaft.lineTo(-x,y-c);shaft.quadraticCurveTo(-x,y,-x+c,y);shaft.lineTo(x-c,y);shaft.quadraticCurveTo(x,y,x,y-c);shaft.lineTo(x,-y+c);shaft.quadraticCurveTo(x,-y,x-c,-y);shaft.lineTo(-x+c,-y);shaft.quadraticCurveTo(-x,-y,-x,-y+c);shaft.closePath();footprint.holes.push(shaft);
 // Garden-like carrier thickness; the shaft depth is rendered independently.
 const geometry=new THREE.ExtrudeGeometry(footprint,{depth:22,bevelEnabled:true,bevelSize:2,bevelThickness:2,bevelSegments:5,curveSegments:24});geometry.translate(0,0,-20);
''' +s[b:]
s=s.replace('body.receiveShadow=body.castShadow=true;return body;', 'body.receiveShadow=body.castShadow=true;body.userData.shaftOpening=new THREE.Shape(shaft.getPoints(24));return body;');p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig').replace('canvas,alpha:true,antialias:true','canvas,alpha:true,antialias:true,stencil:true')
s=s.replace(' const foundation=createDungeonFoundation();root.add(foundation);', ''' const foundation=createDungeonFoundation();root.add(foundation);
 // Mask the deep interior to the shaft mouth: a thin carrier must not expose
 // a hanging shaft exterior or falling debris below its outer silhouette.
 const maskMaterial=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false,depthTest:false,stencilWrite:true,stencilRef:1,stencilFunc:THREE.AlwaysStencilFunc,stencilZPass:THREE.ReplaceStencilOp});
 const mask=new THREE.Mesh(new THREE.ShapeGeometry(foundation.userData.shaftOpening),maskMaterial);mask.position.z=5;mask.renderOrder=-20;root.add(mask);
 const shaftMaterial=color=>{const m=mat(color);m.stencilWrite=true;m.stencilWriteMask=0;m.stencilRef=1;m.stencilFunc=THREE.EqualStencilFunc;return m;};
 const shaftParts=[];
''')
s=s.replace("const z=-6-row*27,color=['#626b5f','#485349','#323e36','#202b25'][row]", "const z=-13-row*27,color=['#5b4b39','#464536','#303a30','#202b25'][row]")
s=s.replace("box(root,5,65,28,1,color,side*34,0,z);box(root,66,5,28,1,color,0,side*32,z);", "const a=box(root,5,65,28,3,color,side*34,0,z),b=box(root,66,5,28,3,color,0,side*32,z);a.material=shaftMaterial(color);b.material=shaftMaterial(color);shaftParts.push(a,b);")
s=s.replace("box(root,64,61,3,1,'#0c1610',0,0,-111);", "const bottom=box(root,64,61,3,1,'#0c1610',0,0,-111);bottom.material=shaftMaterial('#0c1610');")
s=s.replace("box(root,66,5,7,1,'#4d4937',0,y,4)","box(root,59,5,6,2,'#57442e',0,y,1)")
# Clip only material fragments in the shaft. Never alter the shared stone library materials.
s=s.replace('const piece=fragment(debris,points,stoneMat,9);', "const piece=fragment(debris,points,stoneMat.clone(),9);")
s=s.replace(' const stone=library.stone', ''' debris.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material)){m.stencilWrite=true;m.stencilWriteMask=0;m.stencilRef=1;m.stencilFunc=THREE.EqualStencilFunc;}});
 const stone=library.stone''')
# Wood top fragment shares intact material; clone it before enabling clipping.
s=s.replace("fragment(debris,pts,[m,mat('#a58e68')]", "fragment(debris,pts,[m.clone(),mat('#a58e68')]")
# Give only the falling load its own materials so stencil switches never affect nearby stones.
s=s.replace('stone.scale.set(.88,.88,.8);stone.position.z=11;', "stone.scale.set(.88,.88,.8);stone.position.z=11;stone.traverse(o=>{if(o.isMesh)o.material=o.material.clone();});")
s=s.replace("item.stone.visible=fall<(wood?1:.85);", "item.stone.visible=fall<(wood?1:.85);item.stone.traverse(o=>{if(o.isMesh){o.material.stencilWrite=item.stone.position.z<5;o.material.stencilWriteMask=0;o.material.stencilRef=1;o.material.stencilFunc=THREE.EqualStencilFunc;}});")
p.write_text(s,encoding='utf-8')
