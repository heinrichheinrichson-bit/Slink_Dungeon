import {createRoomAccess} from './room-access.js';
import {createCollapseFloor,createCollectionBase} from './collapse-floor.js';
import {basinTraversal} from './basin-traversal.js';
import {createSinkingGate} from './sinking-gate.js';
import {createGardenBasins} from './garden-basins.js';
import {createFloorRocker} from './floor-rocker.js';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createFuzzyCreature} from './garden/fuzzy-creature.js';
import {createMaterialLibrary} from './material-library.js';
import {gateRotation} from './gate-layout.js';
import {createSteamRig} from './steam-rig.js';
const old=document.querySelector('#board'),view=document.createElement('canvas');view.className='world';view.setAttribute('aria-label','Nurbis unterirdische Gartenwelt');old.after(view);
const renderer=new THREE.WebGLRenderer({canvas:view,alpha:true,antialias:true});renderer.localClippingEnabled=true;renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-437,437,437,-437,1,2200);camera.up.set(0,0,1);camera.position.set(0,-470,1150);camera.lookAt(0,0,0);
const rockerPreview=new URLSearchParams(location.search).get('rockerPreview');if(['top','north','east','south'].includes(rockerPreview)){camera.left=-105;camera.right=105;camera.top=105;camera.bottom=-105;camera.position.set(144+(rockerPreview==='east'?360:0),144+(rockerPreview==='north'?360:rockerPreview==='south'?-360:rockerPreview==='top'?-1:0),rockerPreview==='top'?650:420);camera.lookAt(144,144,14);camera.updateProjectionMatrix();}
scene.add(new THREE.HemisphereLight('#e9d7b5','#293b3e',1.15));const sun=new THREE.DirectionalLight('#ffe3b8',2.05);sun.position.set(-280,-200,600);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-470,right:470,top:470,bottom:-470,near:1,far:1400});sun.shadow.bias=-.0005;sun.shadow.normalBias=.4;scene.add(sun);const rim=new THREE.DirectionalLight('#8ba7bc',.85);rim.position.set(200,250,300);scene.add(rim);
const world=new THREE.Group(),dynamic=new THREE.Group();scene.add(world,dynamic);const library=createMaterialLibrary(),materials={};
function mat(c){return materials[c]??=new THREE.MeshStandardMaterial({color:c,roughness:.88});}
function box(w,d,h,r,c,x,y,z,parent=world){const m=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,3,r),mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
function ell(x,y,z,sx,sy,sz,c,parent=world){const m=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
function tube(points,r,c,parent=world){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),m=new THREE.Mesh(new THREE.TubeGeometry(curve,20,r,7,false),mat(c));parent.add(m);return m;}
let width=11,height=11;const xy=([x,y])=>[(x-(width-1)/2)*72,((height-1)/2-y)*72];const nurbi=createFuzzyCreature();nurbi.setPalette('apricot');nurbi.setSize(135);scene.add(nurbi.group);
const pickRay=new THREE.Raycaster(),pickPlane=new THREE.Plane(new THREE.Vector3(0,0,1),-11),pickHit=new THREE.Vector3();
window.pickDungeonCell=(clientX,clientY)=>{const r=old.getBoundingClientRect();pickRay.setFromCamera(new THREE.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),camera);if(!pickRay.ray.intersectPlane(pickPlane,pickHit))return null;return [Math.round(pickHit.x/72+(width-1)/2),Math.round((height-1)/2-pickHit.y/72)];};
let activeRescue=null,activeAccess=null,collapseFloors=[],basinRuns=[],sinkingGates=[],lastRoom=-1,lastState,boxMeshes=[],gates=[],plates=[],beetle,seedToken,traps=[],waterTiles=[],waterSwitch,gardenBasins,presses=[],steamRig,from=new THREE.Vector2(),to=new THREE.Vector2(),start=0,fromZ=11,toZ=11,angle=0,goalAngle=0,travel=0,joy=-1,bumpAt=-1,bumpDirection=[0,0];
window.dungeonBump=(dx,dy)=>{bumpAt=performance.now()/1000;bumpDirection=[dx,-dy];};
function clear(group){const localMats=new Set();group.traverse(o=>{o.geometry?.dispose();for(const material of [].concat(o.material||[])){if(!library.materials.includes(material)&&!Object.values(materials).includes(material))localMats.add(material);}});group.clear();localMats.forEach(m=>m.dispose());}
function hash(x,y,seed){let n=(Math.imul(x+971,374761393)^Math.imul(y+173,668265263)^seed)>>>0;n=Math.imul(n^(n>>>13),1274126177)>>>0;return((n^(n>>>16))>>>0)/4294967296;}
// Stable sparse detail groups, not a new random assignment on every redraw.
function detailAmount(x,y,l,floor=false){const cx=2+(l.seed%5),cy=2+Math.floor(l.seed/7)%5,dist=Math.hypot(x-cx,y-cy),r=hash(x,y,l.seed+(floor?419:0));if(dist<1.2&&r>.35)return floor?.15:.5;if(dist<2.7&&r>.55)return floor?.08:.15;if(r<.07)return .15;return 0;}
function build(level,idx){steamRig?.dispose();steamRig=null;gardenBasins?.dispose();gardenBasins=null;clear(world);clear(dynamic);boxMeshes=[];gates=[];sinkingGates=[];collapseFloors=[];basinRuns=[];plates=[];traps=[];waterTiles=[];waterSwitch=null;presses=[];seedToken=null;beetle=null;width=level.map[0].length;height=level.map.length;activeAccess=level.access||null;activeRescue=level.rescue?level:null;if(!rockerPreview){const cells=[];level.map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c!=='#'&&c!==' '&&!(level.rescue&&c==='O'))cells.push([x,y]);}));const xs=cells.map(c=>c[0]),ys=cells.map(c=>c[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const center=xy([(minX+maxX)/2,(minY+maxY)/2]);const half=activeAccess?470:Math.max((maxX-minX+2)*36,(maxY-minY+2)*36)+24;camera.position.set(center[0],center[1]-470,1150);camera.lookAt(center[0],center[1],0);camera.left=-half;camera.right=half;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();}if(level.collection&&!level.water)createCollectionBase(level.map,world);
level.map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c===' ')return;const [X,Y]=xy([x,y]),seed=Math.floor(hash(x,y,level.seed)*100000);
if(c!=='C'&&c!=='T'&&!level.recesses?.some(p=>p[0]===x&&p[1]===y)&&!(level.water&&(c==='U'||c==='W'))){const floor=library.stone(level.floor,seed,world,X,Y,false,detailAmount(x,y,level,true));floor.position.z=-1;floor.scale.set(1.035,1.075,.24);}
if(c==='#'&&!level.recesses?.some(p=>p[0]===x&&p[1]===y)&&!(level.workshop&&x===level.recess[0]&&y===level.recess[1])){const wall=library.stone(level.wall,seed,world,X,Y,false,detailAmount(x,y,level));wall.position.z=10;wall.scale.set(1.035,1.075,1.08);}
if(level.combined&&c==='A'){const model=createFloorRocker({form:2,palette:1,decor:'inlay',density:.25,compact:true});model.group.position.set(X,Y,10);world.add(model.group);waterSwitch=model.rocker;}
if((level.water||level.press)&&c==='A'){
 const model=createFloorRocker({form:2,palette:5,decor:'inlay',density:.5,compact:true});model.group.position.set(X,Y,10);world.add(model.group);waterSwitch=model.rocker;
 // The control conduit runs under the separating wall to both real basins.
 const lineMaterial=mat('#8a967f');const junction=xy([5,5]);
 for(const [a,b]of (level.waterRescue?[]:[[[x,y],[5,5]],[[5,3],[5,7]]])){const start=new THREE.Vector3(...xy(a),10.2),end=new THREE.Vector3(...xy(b),10.2);world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(start,end),16,1.3,8,false),lineMaterial));}
}
if(level.press&&(c==='U'||c==='W')){
 const pocket=[x,c==='U'?y+1:y-1],[px,py]=xy(pocket),centerY=(Y+py)/2;
 // The traversable tile has a continuous load-bearing deck. The parking
 // socket is a dark recessed machine bay, visually distinct from the path.
 box(65,138,3,5,'#333d39',X,centerY,7);
 const tread=library.stone(level.floor,seed,world,X,Y,false,0);tread.position.z=-1;tread.scale.set(.77,1.075,.24);
 box(54,59,3,3,'#182321',px,py,8);
 // A fixed cross brace belongs to the non-walkable socket, not the deck.
 for(const sign of [-1,1]){const brace=box(49,3,2,1,'#8f896b',px,py,10.5);brace.rotation.z=sign*.72;}

 for(const side of [-1,1])box(4,139,3,1,'#a79773',X+side*28,centerY,12);
 // Side cheeks and back stop identify a fixed machine socket, not a free crate.
 for(const side of [-1,1])box(4,62,23,2,'#606f68',px+side*29,py,22);
 box(62,4,23,2,'#606f68',px,py+(c==='U'?-29:29),22);
 const block=new THREE.Group();world.add(block);box(52,54,28,5,'#697c78',0,0,14,block);
 for(const yy of [-17,17])box(48,3,2,1,'#b5a27a',0,yy,29,block);
 const badge=box(14,14,2,3,'#d0bd8b',0,0,29,block);badge.rotation.z=Math.PI/4;
 // Identical matching marker at the stationary track end.
 const marker=box(9,9,1,2,'#d0bd8b',X+34,centerY,12);marker.rotation.z=Math.PI/4;
 block.position.set(X,c==='U'?Y:py,11);presses.push({block,kind:c,x:X,closedY:Y,parkY:py,current:c==='U'?1:0});
}
if(level.collection&&level.weight&&c==='T'){collapseFloors.push({model:createCollapseFloor(world,library,X,Y),cell:[x,y]});}
if(!level.collection&&level.weight&&c==='T'){
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
if(c==='C'){
 const pit=new THREE.Group();pit.position.set(X,Y,0);world.add(pit);
 box(64,61,22,4,'#181f20',0,0,-1,pit);
 for(const side of [-1,1]){box(5,62,6,2,'#8d8065',side*31,0,11,pit);box(64,5,6,2,'#8d8065',0,side*29,11,pit);}
 const flap=new THREE.Group();flap.position.set(0,-25,10);pit.add(flap);box(54,49,5,4,'#797c66',0,24,0,flap);
 for(const yy of [10,24,38])box(40,1,.6,.25,'#b2a481',0,yy,2.8,flap);
 // One uneven seam hints at age without repeating organic decoration.
 tube([[-16,-6,3],[-5,8,3],[1,12,3],[4,26,3]],.55,'#444b3f',flap);
 for(const side of [-1,1])box(9,5,5,2,'#b3a17c',side*18,-25,12,pit);
 const fill=library.stone(0,73,pit,0,0,true,.08);fill.scale.set(.88,.88,.8);fill.position.z=-23.4;fill.visible=false;
 traps.push({flap,fill,cell:[x,y],dropAt:-1,dropFrom:new THREE.Vector2()});
}
if(c==='K'){seedToken=new THREE.Group();seedToken.position.set(X,Y,14);world.add(seedToken);ell(0,0,3,7,10,5,'#ceb477',seedToken);tube([[0,-5,5],[0,1,9],[4,6,10]],.8,'#7f9b68',seedToken);ell(4,5,10,5,2,1,'#9bad78',seedToken);}
if(c==='S'){const p=box(46,46,3,12,'#b1a578',X,Y,11.5);plates.push({mesh:p,cell:[x,y]});const ring=new THREE.Mesh(new THREE.TorusGeometry(15,1.6,7,32),mat('#e8cc8c'));ring.position.set(X,Y,14);world.add(ring);ell(X,Y,14,5,5,.5,'#e8cc8c');}
if(c==='G'||c==='D'||c==='E'){const frame=new THREE.Group();frame.position.set(X,Y,-2);frame.rotation.z=gateRotation(level,x,y);world.add(frame);const device=createSinkingGate(frame);device.set(0);sinkingGates.push({device,kind:c,current:0,target:0});}
if(c==='F'){beetle=new THREE.Group();beetle.position.set(X,Y,17);world.add(beetle);ell(0,0,7,13,16,8,'#bd7055',beetle);ell(0,-13,5,8,7,6,'#514338',beetle);for(let i of [-1,1]){ell(i*3,-18,8,2,2,2.7,'#f8e9bc',beetle);for(let k=0;k<3;k++)tube([[i*8,k*8-7,4],[i*16,k*9-9,1]],1,'#514338',beetle);for(let j=0;j<2;j++)ell(i*5,j*9-2,14,2.6,2.6,1,'#57413a',beetle);}tube([[0,-6,15],[0,4,16],[0,13,12]],.7,'#654137',beetle);const glow=new THREE.PointLight('#f4c889',.7,150,1);glow.position.set(X,Y,60);world.add(glow);}
}));if(level.rescue){const side=Math.sign(level.outside[0]-level.exit[0])||1;const [ex,ey]=xy([level.exit[0]-side,level.exit[1]]);createRoomAccess(world,library,{x:ex,y:ey,rotation:-side*Math.PI/2,compact:true,posts:false});}if(level.access){for(const [cell,rotation]of [[level.access.entry,level.access.entryRotation],[level.access.exit,level.access.exitRotation]]){createRoomAccess(world,library,{type:level.access.type,compact:true,x:xy(cell)[0],y:xy(cell)[1],rotation});}}if(level.combined||level.waterRescue){for(const cells of (level.connections||[[[3,3],[3,4],[5,4]],[[8,7],[9,7],[9,8]]])){for(let i=1;i<cells.length;i++){tube([[...xy(cells[i-1]),10.1],[...xy(cells[i]),10.1]],1.15,'#8a967f');}}}if(level.water){gardenBasins=createGardenBasins({map:level.map,liquidType:level.liquidType||'water',mount:level.basinMount||'original'});world.add(gardenBasins.group);if(level.basinMount==='flush'){
 level.map.forEach((row,y)=>{for(let x=0;x<row.length;x++){const kind=row[x];if(!['U','W'].includes(kind)||row[x-1]===kind)continue;let end=x;while(row[end+1]===kind)end++;const [cx,cy]=xy([(x+end)/2,y]);basinRuns.push({x:cx,y:cy,kind});for(const side of [-1,1])for(let step=0;step<4;step++){const top=4-step*7,bed=-17,h=top-bed;if(h>0)box(14,45,h,1,'#737e72',cx+side*(101-step*14-7),cy,bed+h/2);}x=end;}});
 }}if(level.workshop)steamRig=createSteamRig({world,xy,box,ell,mat,rootMode:level.root===true,leverMode:level.lever===true,levelMap:level.map,compact:true});lastRoom=idx;}
function actorCell(s){const p=xy(s.p);if(s.rockerEntry)p[0]-=s.rockerEntry*18;return p;}
window.drawDungeon=(s,l,idx)=>{if(s===lastState&&idx===lastRoom)return;const changed=idx!==lastRoom||s.moves===0;if(changed){build(l,idx);const [x,y]=actorCell(s);from.set(x,y);to.copy(from);nurbi.group.position.set(x,y,11);goalAngle=angle=0;if(l.access){const [ex,ey]=xy(l.access.entry);from.set(ex-96,ey);nurbi.group.position.set(from.x,from.y,11);goalAngle=angle=Math.PI/2;}}else{from.set(nurbi.group.position.x,nurbi.group.position.y);const [x,y]=actorCell(s);to.set(x,y);if(to.distanceTo(from)>1)goalAngle=Math.atan2(to.x-from.x,-(to.y-from.y));}fromZ=nurbi.group.position.z;toZ=l.lever&&l.map[s.p[1]]?.[s.p[0]]==='A'?18:l.water&&['U','W'].includes(l.map[s.p[1]]?.[s.p[0]])?-19:11;start=performance.now()/1000;
s.boxes.forEach((p,i)=>{let stone=boxMeshes[i];if(!stone){const group=library.stone(l.wall===2?0:2,73+i,dynamic,0,0,true,i%3===0?.08:0);group.scale.set(.88,.88,.8);stone={group};boxMeshes.push(stone);}stone.group.visible=true;stone.group.position.set(...xy(p),l.waterRescue?basinSupportAt(...xy(p),s.off,false):11);});
// Filled traps consume a movable stone. Never leave its old mesh behind.
boxMeshes.forEach((stone,i)=>{stone.group.visible=i<s.boxes.length;});
sinkingGates.forEach(g=>{g.target=Number(l.switchRescue?(g.kind==='G'?s.off:g.kind==='E'?!s.off:gateOpenLocal(s,l)):l.rescue?l.map.every((row,y)=>[...row].every((c,x)=>c!=='S'||s.boxes.some(b=>b[0]===x&&b[1]===y))):l.advanced&&g.kind==='E'?!s.off:l.combined&&g.kind==='G'?s.off:s.boxes.some(b=>l.map[b[1]]?.[b[0]]==='S'));if(changed){g.current=g.target;g.device.set(g.current);}});collapseFloors.forEach(f=>{if(s.opened&&!lastState?.opened){const consumed=lastState?.boxes.find(b=>!s.boxes.some(p=>p[0]===b[0]&&p[1]===b[1]));f.model.trigger(performance.now()/1000,consumed?[(consumed[0]-f.cell[0])*72,(f.cell[1]-consumed[1])*72]:[0,0],!l.fragileWalk||!!s.collapseStone);}f.model.update(!!s.opened,performance.now()/1000);});const open=gateOpenLocal(s,l);gates.forEach(g=>g.scale.z=open?.08:1);plates.forEach(p=>p.mesh.material=mat(s.boxes.some(b=>b[0]===p.cell[0]&&b[1]===p.cell[1])?'#98ad72':'#b1a578'));if(seedToken)seedToken.visible=!s.key;if(waterSwitch&&s.moves===0)waterSwitch.rotation.y=s.off?.2:-.2;presses.forEach(p=>{if(s.moves===0)p.current=Number(p.kind==='U'?!s.off:s.off);});traps.forEach(t=>{if(t.weight){if(s.opened&&!lastState?.opened)t.collapseAt=performance.now()/1000;if(!s.opened)t.collapseAt=-1;}t.fill.visible=!!s.filled;t.flap.visible=!s.filled;if(s.filled&&!lastState?.filled){const consumed=lastState?.boxes.find(b=>!s.boxes.some(p=>p[0]===b[0]&&p[1]===b[1]));t.dropFrom.set(consumed?(consumed[0]-t.cell[0])*72:0,consumed?(t.cell[1]-consumed[1])*72:0);t.dropAt=performance.now()/1000;}if(!s.filled){t.dropAt=-1;t.fill.position.set(0,0,-23.4);}});if(beetle){beetle.visible=l.access||l.rescue?true:!s.won;if(l.rescue&&!s.won)beetle.position.set(...xy(l.friend),17);}if(s.won&&!lastState?.won&&!l.access&&!l.rescue)joy=start;else if(!s.won)joy=-1;lastState=s;view.dataset.room=String(idx+1);view.dataset.moves=String(s.moves);view.dataset.gate=open?'open':'closed';view.dataset.won=String(s.won);if(steamRig)steamRig.update(s,performance.now()/1000);renderer.render(scene,camera);};
function gateOpenLocal(s,l){if(l.combined&&!l.switchRescue)return s.off;let list=[];l.map.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='S')list.push([x,y]);}));return list.length&&list.every(p=>s.boxes.some(b=>p[0]===b[0]&&p[1]===b[1]));}

function basinSupportAt(x,y,off,dryOnly=true){for(const b of basinRuns){const dry=b.kind==='U'?off:!off;if((dry||!dryOnly)&&Math.abs(y-b.y)<22&&Math.abs(x-b.x)<=144)return basinTraversal((x-b.x)/288+.5,'flush',true).z;}return 11;}
function resize(){const w=old.clientWidth;renderer.setSize(w,w,false);}new ResizeObserver(resize).observe(old);resize();let previous=0;
function tick(ms){requestAnimationFrame(tick);if(document.hidden||!old.clientWidth)return;const t=ms/1000,dt=Math.min(.05,t-previous);previous=t;const a=Math.min(1,(t-start)/(activeAccess&&(lastState?.won||lastState?.moves===0)?.85:.14)),u=a*a*(3-2*a);nurbi.group.position.set(THREE.MathUtils.lerp(from.x,to.x,u),THREE.MathUtils.lerp(from.y,to.y,u),THREE.MathUtils.lerp(fromZ,toZ,u));for(const basin of basinRuns){const dry=basin.kind==='U'?lastState?.off:!lastState?.off;if(dry&&Math.abs(nurbi.group.position.y-basin.y)<22&&Math.abs(nurbi.group.position.x-basin.x)<=144){nurbi.group.position.z=basinTraversal((nurbi.group.position.x-basin.x)/288+.5,'flush',true).z;}}const moving=a<1&&from.distanceTo(to)>1;travel+=moving?dt*200:0;const delta=Math.atan2(Math.sin(goalAngle-angle),Math.cos(goalAngle-angle));angle+=delta*Math.min(1,dt*16);nurbi.group.rotation.z=angle;nurbi.update(t,0,{active:moving,travel,celebrationAge:joy<0?-1:t-joy,celebrationStyle:'gentle'});if(activeRescue&&lastState?.won){const advance=(route,actor,lag=0)=>{const progress=Math.max(0,(t-start-lag)/.22),i=Math.min(route.length-1,Math.floor(progress)),next=Math.min(route.length-1,i+1),fraction=THREE.MathUtils.smoothstep(progress-i,0,1),aa=xy(route[i]),bb=xy(route[next]);actor.position.set(THREE.MathUtils.lerp(aa[0],bb[0],fraction),THREE.MathUtils.lerp(aa[1],bb[1],fraction),actor===nurbi.group?11:17);if(actor===beetle&&i!==next)actor.rotation.z=Math.atan2(bb[0]-aa[0],-(bb[1]-aa[1]));};advance(lastState.nurbiRoute,nurbi.group,.12);if(beetle)advance(lastState.escapeRoute,beetle,.3);if(activeRescue.waterRescue){nurbi.group.position.z=basinSupportAt(nurbi.group.position.x,nurbi.group.position.y,lastState.off);if(beetle)beetle.position.z=basinSupportAt(beetle.position.x,beetle.position.y,lastState.off)+6;}}if(activeAccess&&beetle&&lastState?.won){const follow=THREE.MathUtils.smoothstep(Math.max(0,a-.16)/.84,0,1);beetle.position.set(THREE.MathUtils.lerp(from.x,to.x-30,follow),THREE.MathUtils.lerp(from.y,to.y,follow),16);}if(bumpAt>=0){const phase=(t-bumpAt)/.32;if(phase<1){const offset=Math.sin(phase*Math.PI)*7;nurbi.group.position.x+=bumpDirection[0]*offset;nurbi.group.position.y+=bumpDirection[1]*offset;}else bumpAt=-1;}presses.forEach(p=>{const target=Number(p.kind==='U'?!lastState?.off:lastState?.off);p.current+=(target-p.current)*Math.min(1,dt*9);p.block.position.y=THREE.MathUtils.lerp(p.parkY,p.closedY,p.current);});sinkingGates.forEach(g=>{g.current=THREE.MathUtils.lerp(g.current,g.target,Math.min(1,dt*9));g.device.set(g.current);});collapseFloors.forEach(f=>f.model.update(!!lastState?.opened,t));if(gardenBasins)gardenBasins.update(!!lastState?.off,t,dt);waterTiles.forEach(tile=>{const wet=tile.kind==='U'?!lastState?.off:!!lastState?.off;tile.level+=(Number(wet)-tile.level)*Math.min(1,dt*10);tile.water.position.z=11+tile.level*2;tile.water.material.opacity=tile.level*.82;tile.water.visible=tile.level>.01;tile.sheen.visible=tile.level>.2;tile.sheen.position.z=tile.water.position.z+.3;tile.sheen.position.x=tile.water.position.x+Math.sin(t*1.1)*1.1;});if(waterSwitch)waterSwitch.rotation.y+=((lastState?.off?.2:-.2)-waterSwitch.rotation.y)*Math.min(1,dt*13);traps.forEach(trap=>{if(trap.dropAt>=0){const a=Math.min(1,Math.max(0,(t-trap.dropAt)/.22)),u=a*a*(3-2*a);trap.fill.position.set(trap.dropFrom.x*(1-u),trap.dropFrom.y*(1-u),11+(-23.4-11)*u);if(a===1)trap.dropAt=-1;}if(trap.weight){const age=trap.collapseAt<0?0:Math.min(1,(t-trap.collapseAt)/.45);trap.flap.visible=!lastState?.opened||age<1;trap.flap.position.z=11-age*40;trap.flap.rotation.x=age*.45;}else{const target=lastState?.opened?-1.35:0;trap.flap.rotation.x+=(target-trap.flap.rotation.x)*Math.min(1,dt*10);}});if(steamRig&&lastState)steamRig.update(lastState,t);renderer.render(scene,camera);}requestAnimationFrame(tick);old.style.opacity='0';view.style.pointerEvents='none';window.dispatchEvent(new Event('dungeon-ready'));
