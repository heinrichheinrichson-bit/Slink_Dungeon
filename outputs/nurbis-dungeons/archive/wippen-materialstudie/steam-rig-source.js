import * as THREE from 'three';
export function createSteamRig({world,xy,box,ell,mat,rootMode=false,leverMode=false}){
 const [vx,vy]=xy([5,4]),[hx,hy]=xy([5,5]),[ax,ay]=xy([7,3]),[mx,my]=xy([8,6]);
 // Inset stone-and-brass opening; the adjacent floor tile is the actual jet danger zone.
 ell(vx,vy,10.7,24,24,1.5,'#282e2b');const rim=new THREE.Mesh(new THREE.TorusGeometry(20,3,10,48),mat('#7a7765'));rim.position.set(vx,vy,12);world.add(rim);
 const hotMat=new THREE.MeshStandardMaterial({color:'#d09052',emissive:'#ad562a',emissiveIntensity:.55,roughness:.85});
 for(let i=-1;i<=1;i++){const slit=box(4,27,1,1,'#282e2b',vx+i*8,vy,12);slit.material=hotMat;}
 const markers=[];for(const side of [-1,1])for(const end of [-1,1])markers.push(box(12,3,1.5,1,'#d3a060',hx+side*22,hy+end*25,11.5));
 // Short embedded supply pipe ties the valve, vent and sliding mechanism together visually.
 const pipeMat=mat('#887a5c');const points=[[vx+25,vy+5,13],[vx+42,vy+5,13],[vx+42,ay,13],[ax,ay,13]];
 world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),28,2.1,8,false),pipeMat));
 const wheel=new THREE.Group();wheel.position.set(ax,ay,23);world.add(wheel);
 const living=new THREE.Group(),leaves=new THREE.Group();living.position.set(ax-15,ay+10,12);living.add(leaves);world.add(living);living.visible=rootMode;
 const rootMat=new THREE.MeshStandardMaterial({color:'#796653',roughness:1});
 function root(points,r,parent=living){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,28,r,8,false),rootMat);parent.add(m);m.castShadow=true;return m;}
 let peg,lever;
 if(leverMode){
 // Broad recessed floor rocker: the silhouette and two contrasting ends remain visible from above.
 box(62,54,2,7,'#232b29',ax,ay,10.2);
 for(const side of [-1,1]){box(4,52,6,2,'#b1a487',ax+side*30,ay,12);box(62,4,6,2,'#b1a487',ax,ay+side*25,12);}
 for(const x of [-1,1])for(const y of [-1,1])ell(ax+x*28,ay+y*23,15.3,1.5,1.5,.6,'#6c715e');
 lever=new THREE.Group();lever.position.set(ax,ay,16);world.add(lever);lever.rotation.y=-.24;
 box(50,40,7,4,'#9c967f',0,0,0,lever);
 box(19,31,1.2,3,'#8a9b7b',-13,0,4,lever);box(19,31,1.2,3,'#c4ac78',13,0,4,lever);
 box(1.4,34,.7,.3,'#535c50',0,0,4.1,lever);
 // Embedded grip ridges separate the two pressable ends without a modern electrical icon.
 for(const x of [-13,13])for(const y of [-7,0,7])box(10,1.2,.9,.4,'#e0d2ae',x,y,4.9,lever);
 for(const side of [-1,1])ell(ax,ay+side*22,15.5,3,2,2,'#7b836b');
 }else if(rootMode){
 ell(ax-14,ay+11,11.5,19,15,1,'#393e30');root([[-12,4,0],[-3,2,3],[6,-1,5],[16,-6,6],[28,-10,9],[38,-10,12]],1.6);
 root([[1,2,3],[0,8,7],[-5,13,11],[-4,18,12]],.9);root([[12,-4,5],[13,4,9],[19,9,13],[23,8,16]],.8);
 for(let i=0;i<7;i++){const leaf=ell(-3+(i%4)*7,4+(i%3)*4,9+(i%3)*3,5,2.3,.9,['#809958','#a8b875','#8fa765'][i%3],leaves);leaf.rotation.set(.15,(i%2?.25:-.2),i*1.7);}
 box(16,22,7,4,'#777662',ax+22,ay,14);peg=box(7,15,13,2,'#b2a27d',ax+23,ay,22);
 }else{
 box(38,36,5,8,'#726853',ax,ay,12);const wheelRing=new THREE.Mesh(new THREE.TorusGeometry(15,2.7,8,36),mat('#b29b70'));wheel.add(wheelRing);for(let i=0;i<3;i++){const spoke=box(28,3.5,3,1,'#a3906c',0,0,0,wheel);spoke.rotation.z=i*Math.PI/3;}ell(ax,ay,23,4,4,3,'#d7c18b');
 }
 // Rails and a stable frame make the old sliding stone's motion legible.
 for(const side of [-1,1])box(139,4,3,1,'#9c8b66',mx+36,my+side*29,12);box(139,62,3,5,'#323a35',mx+36,my,9);
 const slider=new THREE.Group();slider.position.set(mx,my,10);world.add(slider);box(64,61,43,7,'#68726a',0,0,21.5,slider);for(const y of [-18,18])box(58,5,3,1,'#a5936c',0,y,44,slider);const plate=box(18,18,2,4,'#c0ac78',0,0,44,slider);plate.rotation.z=Math.PI/4;
 const cloud=document.createElement('canvas');cloud.width=cloud.height=96;const c=cloud.getContext('2d');const g=c.createRadialGradient(48,48,2,48,48,45);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(.45,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,96,96);const texture=new THREE.CanvasTexture(cloud);
 const puffs=[];for(let i=0;i<11;i++){const material=new THREE.SpriteMaterial({map:texture,color:'#e6dfce',transparent:true,opacity:0,depthWrite:false});const puff=new THREE.Sprite(material);world.add(puff);puffs.push(puff);}
 let last=0,slide=0,turn=0,growth=0;
 return {update(s,t){const dt=Math.min(.08,Math.max(0,t-last));last=t;const covered=s.boxes.some(b=>b[0]===5&&b[1]===4),active=!s.off&&!covered;
 hotMat.emissiveIntensity=s.off?0:covered?.08:.5;hotMat.color.set(s.off?'#53655d':'#d09052');markers.forEach(m=>m.material=mat(active?'#d3a060':'#718d78'));
 slide+=(Number(s.off)*72-slide)*Math.min(1,dt*7);slider.position.x=mx+slide;turn+=(Number(s.off)*Math.PI*1.2-turn)*Math.min(1,dt*6);wheel.rotation.z=turn;
 if(lever){const target=s.off?.24:-.24;lever.rotation.y+=(target-lever.rotation.y)*Math.min(1,dt*13);}
 if(rootMode){growth+=(Number(s.off)-growth)*Math.min(1,dt*5);leaves.visible=growth>.02;leaves.scale.setScalar(.1+.9*growth);rootMat.color.copy(new THREE.Color('#796653')).lerp(new THREE.Color('#7d9659'),growth);living.scale.z=.66+.34*growth;if(peg)peg.position.x=ax+23+growth*6;}
 puffs.forEach((p,i)=>{p.visible=active;if(!active)return;const age=(t*.48+i/11)%1,spread=19+age*35;p.position.set(vx+Math.sin(i*2.4+age*3)*8,vy-(12+age*62),18+age*51);p.scale.set(spread*.8,spread*1.5,1);p.material.opacity=Math.sin(age*Math.PI)*.55;});
 },dispose(){texture.dispose();}};
}
