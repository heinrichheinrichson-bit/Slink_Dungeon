from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/rocker-study.js');s=p.read_text(encoding='utf-8')
s=s.replace("const width=d.style", "let switchBody;\n const width=d.style")
s=s.replace("box(rocker,width,depth,20,4,skin.body,0,0,0);", "switchBody=box(rocker,width,depth,20,4,skin.body,0,0,0);")
s=s.replace("body.castShadow=body.receiveShadow=true;rocker.add(body);", "body.castShadow=body.receiveShadow=true;rocker.add(body);switchBody=body;")
a=s.index(' function surface(x)');b=s.index(' const mark=',a)
s=s[:a]+''' switchBody.updateMatrixWorld(true);
 const probe=new THREE.Raycaster();
 function surface(x,y=0){probe.set(new THREE.Vector3(x,y,100),new THREE.Vector3(0,0,-1));return (probe.intersectObject(switchBody)[0]?.point.z??12)-rocker.position.z+.28;}
''' +s[b:]
s=s.replace('surface(x)+.12','surface(x,y)+.12').replace('surface(x)+.15','surface(x,y)+.15')
p.write_text(s,encoding='utf-8')
