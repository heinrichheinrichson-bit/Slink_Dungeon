import {conduitRoute} from './conduit-route.js';
import {createFloorRocker} from './floor-rocker.js';
import * as THREE from 'three';
export function createSteamRig({world,xy,box,ell,mat,rootMode=false,leverMode=false,levelMap=[],compact=false}){
 const [vx,vy]=xy([5,4]),[hx,hy]=xy([5,5]),[ax,ay]=xy([7,3]),[mx,my]=xy([8,6]);
 // Inset stone-and-brass opening; the adjacent floor tile is the actual jet danger zone.
 ell(vx,vy,10.7,compact?20:24,compact?20:24,1.5,'#282e2b');const rim=new THREE.Mesh(new THREE.TorusGeometry(compact?17:20,compact?2.3:3,10,48),mat('#7a7765'));rim.position.set(vx,vy,12);world.add(rim);
 const hotMat=new THREE.MeshStandardMaterial({color:'#d09052',emissive:'#ad562a',emissiveIntensity:.55,roughness:.85});
 for(let i=-1;i<=1;i++){const slit=box(3.5,compact?23:27,1,1,'#282e2b',vx+i*8,vy,12);slit.material=hotMat;}
 const markers=[];for(const side of [-1,1])for(const end of [-1,1])markers.push(box(12,3,1.5,1,'#d3a060',hx+side*22,hy+end*25,11.5));
 // Recessed rigid conduits: centered on cells, shortest route beneath walls.
 const pipeMat=mat('#887a5c');
 function conduit(start,end){
  const cells=conduitRoute(start,end,levelMap),corners=[cells[0]];
  for(let i=1;i<cells.length-1;i++){const a=cells[i-1],b=cells[i],c=cells[i+1];if(b[0]-a[0]!==c[0]-b[0]||b[1]-a[1]!==c[1]-b[1])corners.push(b);}
  if(cells.length<2)return;corners.push(cells.at(-1));
  const points=corners.map(c=>new THREE.Vector3(...xy(c),10.2)),path=new THREE.CurvePath();let previous=points[0];
  for(let i=1;i<points.length-1;i++){
   const center=points[i],r=Math.min(8,center.distanceTo(previous)/3,center.distanceTo(points[i+1])/3);
   const before=center.clone().add(previous.clone().sub(center).normalize().multiplyScalar(r));
   const after=center.clone().add(points[i+1].clone().sub(center).normalize().multiplyScalar(r));
   path.add(new THREE.LineCurve3(previous,before));path.add(new THREE.QuadraticBezierCurve3(before,center,after));previous=after;
  }
  path.add(new THREE.LineCurve3(previous,points.at(-1)));
  const pipe=new THREE.Mesh(new THREE.TubeGeometry(path,Math.max(24,cells.length*10),1.35,8,false),pipeMat);pipe.receiveShadow=true;world.add(pipe);
 }
 conduit([5,4],[7,3]);conduit([7,3],[8,6]);
 const wheel=new THREE.Group();wheel.position.set(ax,ay,23);world.add(wheel);
 const living=new THREE.Group(),leaves=new THREE.Group();living.position.set(ax-15,ay+10,12);living.add(leaves);world.add(living);living.visible=rootMode;
 const rootMat=new THREE.MeshStandardMaterial({color:'#796653',roughness:1});
 function root(points,r,parent=living){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,28,r,8,false),rootMat);parent.add(m);m.castShadow=true;return m;}
 let peg,lever;
 if(leverMode){
 const floorSwitch=createFloorRocker({form:1,palette:1,decor:'inlay',density:.25,compact});
 floorSwitch.group.position.set(ax,ay,10);world.add(floorSwitch.group);lever=floorSwitch.rocker;
 }else if(rootMode){
 ell(ax-14,ay+11,11.5,19,15,1,'#393e30');root([[-12,4,0],[-3,2,3],[6,-1,5],[16,-6,6],[28,-10,9],[38,-10,12]],1.6);
 root([[1,2,3],[0,8,7],[-5,13,11],[-4,18,12]],.9);root([[12,-4,5],[13,4,9],[19,9,13],[23,8,16]],.8);
 for(let i=0;i<7;i++){const leaf=ell(-3+(i%4)*7,4+(i%3)*4,9+(i%3)*3,5,2.3,.9,['#809958','#a8b875','#8fa765'][i%3],leaves);leaf.rotation.set(.15,(i%2?.25:-.2),i*1.7);}
 box(16,22,7,4,'#777662',ax+22,ay,14);peg=box(7,15,13,2,'#b2a27d',ax+23,ay,22);
 }else{
 box(38,36,5,8,'#726853',ax,ay,12);const wheelRing=new THREE.Mesh(new THREE.TorusGeometry(15,2.7,8,36),mat('#b29b70'));wheel.add(wheelRing);for(let i=0;i<3;i++){const spoke=box(28,3.5,3,1,'#a3906c',0,0,0,wheel);spoke.rotation.z=i*Math.PI/3;}ell(ax,ay,23,4,4,3,'#d7c18b');
 }
 // Rails and a stable frame make the old sliding stone's motion legible.
 for(const side of [-1,1])box(139,compact?2.5:4,3,1,'#9c8b66',mx+36,my+side*(compact?25:29),12);box(139,compact?54:62,3,5,'#323a35',mx+36,my,9);
 const slider=new THREE.Group();slider.position.set(mx,my,10);world.add(slider);box(compact?60:64,compact?52:61,compact?28:43,compact?5:7,'#68726a',0,0,compact?14:21.5,slider);for(const y of [-18,18])box(compact?54:58,compact?3:5,2,1,'#a5936c',0,y,compact?29:44,slider);const plate=box(compact?14:18,compact?14:18,2,3,'#c0ac78',0,0,compact?29:44,slider);plate.rotation.z=Math.PI/4;
 const cloud=document.createElement('canvas');cloud.width=cloud.height=96;const c=cloud.getContext('2d');const g=c.createRadialGradient(48,48,2,48,48,45);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(.45,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,96,96);const texture=new THREE.CanvasTexture(cloud);
 const puffs=[];for(let i=0;i<11;i++){const material=new THREE.SpriteMaterial({map:texture,color:'#e6dfce',transparent:true,opacity:0,depthWrite:false});const puff=new THREE.Sprite(material);world.add(puff);puffs.push(puff);}
 let last=0,slide=0,turn=0,growth=0;
 return {update(s,t){const dt=Math.min(.08,Math.max(0,t-last));last=t;const covered=s.boxes.some(b=>b[0]===5&&b[1]===4),active=!s.off&&!covered;
 hotMat.emissiveIntensity=s.off?0:covered?.08:.5;hotMat.color.set(s.off?'#53655d':'#d09052');markers.forEach(m=>m.material=mat(active?'#d3a060':'#718d78'));
 slide+=(Number(s.off)*72-slide)*Math.min(1,dt*7);slider.position.x=mx+slide;turn+=(Number(s.off)*Math.PI*1.2-turn)*Math.min(1,dt*6);wheel.rotation.z=turn;
 if(lever){const target=s.off?.20:-.20;lever.rotation.y+=(target-lever.rotation.y)*Math.min(1,dt*13);}
 if(rootMode){growth+=(Number(s.off)-growth)*Math.min(1,dt*5);leaves.visible=growth>.02;leaves.scale.setScalar(.1+.9*growth);rootMat.color.copy(new THREE.Color('#796653')).lerp(new THREE.Color('#7d9659'),growth);living.scale.z=.66+.34*growth;if(peg)peg.position.x=ax+23+growth*6;}
 puffs.forEach((p,i)=>{p.visible=active;if(!active)return;const age=(t*.48+i/11)%1,spread=compact?14+age*20:19+age*35;p.position.set(vx+Math.sin(i*2.4+age*3)*8,vy-(12+age*62),18+age*51);p.scale.set(spread*.8,spread*1.5,1);p.material.opacity=Math.sin(age*Math.PI)*.55;});
 },dispose(){texture.dispose();}};
}
