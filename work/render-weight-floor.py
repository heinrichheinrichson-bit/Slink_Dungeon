from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig').replace("if(c!=='C'&&!level.recesses", "if(c!=='C'&&c!=='T'&&!level.recesses")
pos=s.index("if(c==='C')")
s=s[:pos]+'''if(level.weight&&c==='T'){
 box(66,63,16,5,'#202725',X,Y,0);
 const flap=new THREE.Group();flap.position.set(X,Y,11);world.add(flap);
 const polygons=[
 [[-32,-30],[-3,-30],[2,-9],[-7,1],[-32,8]],
 [[-1,-30],[32,-30],[32,13],[10,5],[4,-10]],
 [[-32,10],[-7,3],[8,7],[32,16],[32,30],[-32,30]]
 ];
 for(const points of polygons){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:5,bevelEnabled:true,bevelSize:.5,bevelThickness:.5,bevelSegments:2,steps:1});const piece=new THREE.Mesh(g,mat('#79664e'));piece.position.z=-5;piece.castShadow=piece.receiveShadow=true;flap.add(piece);}
 // Thin, irregular fissures belong to the surface, not a separate framed tile.
 tube([[-3,-29,1],[2,-10,1],[-7,2,1],[-29,9,1]],.65,'#292c26',flap);
 tube([[3,-9,1],[10,6,1],[30,15,1]],.55,'#292c26',flap);
 const fill=new THREE.Group();world.add(fill);fill.visible=false;
 traps.push({flap,fill,weight:true,cell:[x,y],collapseAt:-1,dropAt:-1,dropFrom:new THREE.Vector2()});
}
''' +s[pos:]
s=s.replace("traps.forEach(t=>{t.fill.visible=!!s.filled;", "traps.forEach(t=>{if(t.weight){if(s.opened&&!lastState?.opened)t.collapseAt=performance.now()/1000;if(!s.opened)t.collapseAt=-1;}t.fill.visible=!!s.filled;")
s=s.replace("const target=lastState?.opened?-1.35:0;trap.flap.rotation.x+=(target-trap.flap.rotation.x)*Math.min(1,dt*10);", "if(trap.weight){const age=trap.collapseAt<0?0:Math.min(1,(t-trap.collapseAt)/.45);trap.flap.visible=!lastState?.opened||age<1;trap.flap.position.z=11-age*40;trap.flap.rotation.x=age*.45;}else{const target=lastState?.opened?-1.35:0;trap.flap.rotation.x+=(target-trap.flap.rotation.x)*Math.min(1,dt*10);}")
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/schieberwerkstatt.html');s=p.read_text(encoding='utf-8-sig').replace('<a href="schieberwerkstatt.html" aria-current="page">Riegel</a>','<a href="schieberwerkstatt.html" aria-current="page">Riegel</a><a href="bruchbodenwerkstatt.html">Bruchboden →</a>');p.write_text(s,encoding='utf-8')
