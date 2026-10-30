from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig').replace('beetle,steamRig,from=', 'beetle,seedToken,traps=[],steamRig,from=')
s=s.replace('boxMeshes=[];gates=[];plates=[];width=', 'boxMeshes=[];gates=[];plates=[];traps=[];seedToken=null;width=')
s=s.replace('const floor=library.stone(',"if(c!=='C'){const floor=library.stone(").replace('floor.scale.set(1.035,1.075,.24);','floor.scale.set(1.035,1.075,.24);}')
pos=s.index("if(c==='S')")
s=s[:pos]+'''if(c==='C'){
 const pit=new THREE.Group();pit.position.set(X,Y,0);world.add(pit);
 box(64,61,22,4,'#181f20',0,0,-1,pit);
 for(const side of [-1,1]){box(5,62,6,2,'#8d8065',side*31,0,11,pit);box(64,5,6,2,'#8d8065',0,side*29,11,pit);}
 const flap=new THREE.Group();flap.position.set(0,-25,10);pit.add(flap);box(54,49,5,4,'#797c66',0,24,0,flap);
 for(const yy of [10,24,38])box(40,1,.6,.25,'#b2a481',0,yy,2.8,flap);
 // One uneven seam hints at age without repeating organic decoration.
 tube([[-16,-6,3],[-5,8,3],[1,12,3],[4,26,3]],.55,'#444b3f',flap);
 for(const side of [-1,1])box(9,5,5,2,'#b3a17c',side*18,-25,12,pit);
 const fill=box(52,48,15,6,'#8b9380',0,0,3,pit);fill.visible=false;
 traps.push({flap,fill});
}
if(c==='K'){seedToken=new THREE.Group();seedToken.position.set(X,Y,14);world.add(seedToken);ell(0,0,3,7,10,5,'#ceb477',seedToken);tube([[0,-5,5],[0,1,9],[4,6,10]],.8,'#7f9b68',seedToken);ell(4,5,10,5,2,1,'#9bad78',seedToken);}
''' +s[pos:]
s=s.replace("beetle.visible=!s.won;", "if(seedToken)seedToken.visible=!s.key;traps.forEach(t=>{t.fill.visible=!!s.filled;t.flap.visible=!s.filled;});beetle.visible=!s.won;")
s=s.replace('if(steamRig&&lastState)steamRig.update(lastState,t);renderer.render',"traps.forEach(trap=>{const target=lastState?.opened?-1.35:0;trap.flap.rotation.x+=(target-trap.flap.rotation.x)*Math.min(1,dt*10);});if(steamRig&&lastState)steamRig.update(lastState,t);renderer.render")
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/hebelwerkstatt.html');s=p.read_text(encoding='utf-8-sig').replace('<a href="hebelwerkstatt.html" aria-current="page">Bodenwippe</a>','<a href="hebelwerkstatt.html" aria-current="page">Bodenwippe</a><a href="fallenwerkstatt.html">Kippboden →</a>');p.write_text(s,encoding='utf-8')
