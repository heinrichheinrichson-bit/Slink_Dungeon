from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig');s="import {createFloorRocker} from './floor-rocker.js';\n"+s
s=s.replace('traps=[],steamRig,from=', 'traps=[],waterTiles=[],waterSwitch,steamRig,from=')
s=s.replace('traps=[];seedToken=null;', 'traps=[];waterTiles=[];waterSwitch=null;seedToken=null;')
a=s.index("if(c==='C')")
s=s[:a]+'''if(level.water&&(c==='U'||c==='W')){
 // Flat recessed channel floor remains visible when drained.
 box(69,60,1.2,3,'#596d65',X,Y,10.5);
 for(const side of [-1,1])box(71,3,3,1,'#899580',X,Y+side*30,11.7);
 const waterMat=new THREE.MeshStandardMaterial({color:'#477f87',transparent:true,opacity:.8,roughness:.24,metalness:.15,depthWrite:false});
 const water=new THREE.Mesh(new THREE.PlaneGeometry(70,57,12,8),waterMat);water.position.set(X,Y,13);world.add(water);
 const sheen=new THREE.Group();sheen.position.set(X,Y,13.3);world.add(sheen);
 for(let j=0;j<3;j++)box(11+j*3,.65,.12,.06,'#96b9ae',-17+j*14,-12+j*11,0,sheen);
 waterTiles.push({water,sheen,kind:c,level:c==='U'?1:0});
}
if(level.water&&c==='A'){
 const model=createFloorRocker({form:2,palette:5,decor:'inlay',density:.5});model.group.position.set(X,Y,10);world.add(model.group);waterSwitch=model.rocker;
 // The control conduit runs under the separating wall to both real basins.
 const lineMaterial=mat('#8a967f');const junction=xy([5,5]);
 for(const [a,b]of [[[x,y],[5,5]],[[5,3],[5,7]]]){const start=new THREE.Vector3(...xy(a),10.2),end=new THREE.Vector3(...xy(b),10.2);world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(start,end),16,1.3,8,false),lineMaterial));}
}
''' +s[a:]
s=s.replace("if(seedToken)seedToken.visible=!s.key;", "if(seedToken)seedToken.visible=!s.key;if(waterSwitch&&s.moves===0)waterSwitch.rotation.y=s.off?.2:-.2;")
s=s.replace('traps.forEach(trap=>{if(trap.dropAt', "waterTiles.forEach(tile=>{const wet=tile.kind==='U'?!lastState?.off:!!lastState?.off;tile.level+=(Number(wet)-tile.level)*Math.min(1,dt*10);tile.water.position.z=11+tile.level*2;tile.water.material.opacity=tile.level*.82;tile.water.visible=tile.level>.01;tile.sheen.visible=tile.level>.2;tile.sheen.position.z=tile.water.position.z+.3;tile.sheen.position.x=tile.water.position.x+Math.sin(t*1.1)*1.1;});if(waterSwitch)waterSwitch.rotation.y+=((lastState?.off?.2:-.2)-waterSwitch.rotation.y)*Math.min(1,dt*13);traps.forEach(trap=>{if(trap.dropAt")
p.write_text(s,encoding='utf-8')
