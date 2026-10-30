from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig').replace('gardenBasins,steamRig,from=','gardenBasins,presses=[],steamRig,from=').replace('waterSwitch=null;seedToken=null;','waterSwitch=null;presses=[];seedToken=null;')
s=s.replace("if(c==='#'&&!(level.workshop", "if(c==='#'&&!level.recesses?.some(p=>p[0]===x&&p[1]===y)&&!(level.workshop")
s=s.replace("if(level.water&&c==='A')", "if((level.water||level.press)&&c==='A')")
pos=s.index("if(c==='C')")
s=s[:pos]+'''if(level.press&&(c==='U'||c==='W')){
 const pocket=[x,c==='U'?y+1:y-1],[px,py]=xy(pocket),centerY=(Y+py)/2;
 box(65,138,3,5,'#333d39',X,centerY,10);
 for(const side of [-1,1])box(4,139,3,1,'#a79773',X+side*28,centerY,12);
 // Side cheeks and back stop identify a fixed machine socket, not a free crate.
 for(const side of [-1,1])box(5,66,35,2,'#606f68',px+side*31,py,27);
 box(66,5,34,2,'#606f68',px,py+(c==='U'?-31:31),27);
 const block=new THREE.Group();world.add(block);box(54,57,40,6,'#697c78',0,0,20,block);
 for(const yy of [-17,17])box(50,5,2,1,'#b5a27a',0,yy,41,block);
 const badge=box(16,16,2,3,'#d0bd8b',0,0,41,block);badge.rotation.z=Math.PI/4;
 // Identical matching marker at the stationary track end.
 const marker=box(9,9,1,2,'#d0bd8b',X+34,centerY,12);marker.rotation.z=Math.PI/4;
 block.position.set(X,c==='U'?Y:py,11);presses.push({block,kind:c,x:X,closedY:Y,parkY:py,current:c==='U'?1:0});
}
''' +s[pos:]
s=s.replace("if(waterSwitch&&s.moves===0)waterSwitch.rotation.y=s.off?.2:-.2;", "if(waterSwitch&&s.moves===0)waterSwitch.rotation.y=s.off?.2:-.2;presses.forEach(p=>{if(s.moves===0)p.current=Number(p.kind==='U'?!s.off:s.off);});")
s=s.replace('if(gardenBasins)gardenBasins.update', "presses.forEach(p=>{const target=Number(p.kind==='U'?!lastState?.off:lastState?.off);p.current+=(target-p.current)*Math.min(1,dt*9);p.block.position.y=THREE.MathUtils.lerp(p.parkY,p.closedY,p.current);});if(gardenBasins)gardenBasins.update")
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/wasserwerkstatt.html');s=p.read_text(encoding='utf-8-sig').replace('<a href="wasserwerkstatt.html" aria-current="page">Wasser</a>','<a href="wasserwerkstatt.html" aria-current="page">Wasser</a><a href="schieberwerkstatt.html">Riegel →</a>');p.write_text(s,encoding='utf-8')
