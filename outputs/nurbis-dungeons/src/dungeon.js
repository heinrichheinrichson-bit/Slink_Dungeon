import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createFuzzyCreature} from './garden/fuzzy-creature.js';
import {createStoneTile} from './garden/stone-modules.js';

const old=document.querySelector('#board'),view=document.createElement('canvas');
view.className='world';view.setAttribute('aria-label','Nurbis unterirdische Gartenwelt');old.after(view);
const renderer=new THREE.WebGLRenderer({canvas:view,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-420,420,420,-420,1,2200);camera.up.set(0,0,1);camera.position.set(0,-590,1060);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight('#fce4bf','#584343',1.3));const sun=new THREE.DirectionalLight('#ffe2b1',1.9);sun.position.set(-280,-200,600);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-450,right:450,top:450,bottom:-450,near:1,far:1400});sun.shadow.bias=-.0005;sun.shadow.normalBias=.5;scene.add(sun);
const rim=new THREE.DirectionalLight('#94b7ba',1.2);rim.position.set(200,250,300);scene.add(rim);
let world=new THREE.Group();scene.add(world);const dynamic=new THREE.Group();scene.add(dynamic);const flowers=new THREE.Group();scene.add(flowers);
const materials={};function mat(c){return materials[c]??=new THREE.MeshStandardMaterial({color:c,roughness:.88});}
function box(w,d,h,r,c,x,y,z,parent=world){const m=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,3,r),mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
function ell(x,y,z,sx,sy,sz,c,parent=world){const m=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
function tube(points,r,c,parent=world){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),m=new THREE.Mesh(new THREE.TubeGeometry(curve,24,r,7,false),mat(c));parent.add(m);m.castShadow=true;return m;}
const xy=([x,y])=>[(x-4)*76,(4-y)*76];
const nurbi=createFuzzyCreature();nurbi.setPalette('apricot');nurbi.setSize(145);scene.add(nurbi.group);
let lastRoom=-1,lastState,boxMeshes=[],gates=[],plates=[],beetle,from=new THREE.Vector2(),to=new THREE.Vector2(),start=0,angle=0,goalAngle=0,travel=0,joy=-1;
function clear(group){while(group.children.length){const o=group.children.pop();o.parent=null;o.traverse(v=>{v.geometry?.dispose();});}}
function mushroom(x,y,z,scale=1){const g=new THREE.Group();g.position.set(x,y,z);world.add(g);ell(0,0,8*scale,3*scale,3*scale,9*scale,'#d9c9a5',g);ell(0,0,17*scale,12*scale,10*scale,6*scale,'#8faeaa',g);ell(-3,-4,20*scale,2*scale,2*scale,1*scale,'#efe6c5',g);}
function build(level,idx){boxMeshes.forEach(s=>s.dispose());clear(world);dynamic.clear();clear(flowers);boxMeshes=[];gates=[];plates=[];
box(716,716,29,18,'#534238',0,0,-21);box(704,704,13,14,'#b5a080',0,0,-5);
level.map.forEach((row,y)=>[...row].forEach((c,x)=>{const [X,Y]=xy([x,y]),n=(x*17+y*13)%7;
box(74,74,14,5,c==='#'?'#6e6050':n%3===0?'#95734f':'#886747',X,Y,5);
if(c==='#'){
box(72,72,38+n*1.7,9,n%2?'#847d6c':'#777260',X,Y,31);
box(62,60,4,6,'#99927c',X-1,Y+1,52+n*.8);
if(n===0||n===3){ell(X-15,Y+13,55,16,9,2,'#6d794c');ell(X+4,Y+18,55,9,5,2,'#82905b');}
if(y===0&&x%2===0){tube([[X-22,Y+30,61],[X-8,Y+8,62],[X+3,Y-10,55],[X+15,Y-25,40]],3.4,'#6f4c32');tube([[X-8,Y+8,62],[X-22,Y-3,58],[X-28,Y-15,55]],1.8,'#7b593b');}
if((x===0||x===8)&&y%3===1)mushroom(X+15,Y-10,52,.7);
}else{for(let k=0;k<3;k++)ell(X-24+k*19,Y+((n+k*7)%29)-14,13,1.5,2,1,'#ad8e65');}
if(c==='S'){const p=box(48,48,4,13,'#c6ae72',X,Y,15);plates.push(p);const ring=new THREE.Mesh(new THREE.TorusGeometry(16,2,8,32),mat('#f1dca1'));ring.position.set(X,Y,18);world.add(ring);}
if(c==='G'){const g=new THREE.Group();g.position.set(X,Y,12);world.add(g);for(let k=-1;k<=1;k++)box(9,58,60,4,'#947450',k*21,0,30,g);box(65,9,10,3,'#b39662',0,-28,39,g);gates.push(g);}
if(c==='F'){beetle=new THREE.Group();beetle.position.set(X,Y,19);world.add(beetle);ell(0,0,7,15,18,9,'#bb624b',beetle);ell(0,-15,5,9,8,7,'#514338',beetle);for(let i of [-1,1]){ell(i*4,-21,8,2.3,2,3,'#f8e9bc',beetle);for(let k=0;k<3;k++)tube([[i*9,k*9-8,4],[i*19,k*11-10,1]],1.4,'#514338',beetle);for(let j=0;j<2;j++)ell(i*6,j*11-3,15,3,3,1.2,'#57413a',beetle);}tube([[0,-7,16],[0,5,17],[0,15,13]],.8,'#654137',beetle);}
}));
lastRoom=idx;
}
function bloom(s){clear(flowers);s.flowers.forEach((p,i)=>{const [x,y]=xy(p);for(let k=0;k<2;k++){const X=x-16+k*27,Y=y+(i%3-1)*13; tube([[X,Y,13],[X+2,Y+1,23]],.9,'#7a8a4b',flowers);const leaf=ell(X+5,Y,18,6,2.8,1.2,'#8f9b59',flowers);leaf.rotation.z=.5;for(let j=0;j<5;j++){const a=j/5*Math.PI*2;ell(X+Math.cos(a)*4,Y+Math.sin(a)*4,25,3.5,2.5,1.4,i%3?'#e9d6a4':'#c49cac',flowers);}ell(X,Y,26,2,2,1.3,'#dbaf64',flowers);}});}
window.drawDungeon=(s,l,idx)=>{
if(s===lastState&&idx===lastRoom)return;
const changed=idx!==lastRoom||s.moves===0;if(changed){build(l,idx);const [x,y]=xy(s.p);from.set(x,y);to.copy(from);nurbi.group.position.set(x,y,14);goalAngle=angle=0;}
else{from.set(nurbi.group.position.x,nurbi.group.position.y);const [x,y]=xy(s.p);to.set(x,y);if(to.distanceTo(from)>1)goalAngle=Math.atan2(to.x-from.x,-(to.y-from.y));}
start=performance.now()/1000;
s.boxes.forEach((p,i)=>{let stone=boxMeshes[i];if(!stone){stone=createStoneTile(i%2?'plain':'pebble',{seed:73+i});stone.group.scale.set(.9,.9,.9);dynamic.add(stone.group);boxMeshes.push(stone);}stone.group.position.set(...xy(p),24);});
const open=gateOpenLocal(s,l);gates.forEach(g=>g.scale.z=open?.14:1);plates.forEach(p=>p.material=mat(open?'#a9b66b':'#c6ae72'));beetle.visible=!s.won;if(s.won&&!lastState?.won)joy=start;else if(!s.won)joy=-1;lastState=s;
};
function gateOpenLocal(s,l){let list=[];l.map.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='S')list.push([x,y]);}));return list.length&&list.every(p=>s.boxes.some(b=>p[0]===b[0]&&p[1]===b[1]));}
function resize(){const w=old.clientWidth;renderer.setSize(w,w,false);}new ResizeObserver(resize).observe(old);resize();
let previous=0;function tick(ms){requestAnimationFrame(tick);if(document.hidden)return;const t=ms/1000,dt=Math.min(.05,t-previous);previous=t;const a=Math.min(1,(t-start)/.14),u=a*a*(3-2*a);nurbi.group.position.set(THREE.MathUtils.lerp(from.x,to.x,u),THREE.MathUtils.lerp(from.y,to.y,u),14);const moving=a<1&&from.distanceTo(to)>1;travel+=moving?dt*200:0;let delta=Math.atan2(Math.sin(goalAngle-angle),Math.cos(goalAngle-angle));angle+=delta*Math.min(1,dt*16);nurbi.group.rotation.z=angle;nurbi.update(t,0,{active:moving,travel,celebrationAge:joy<0?-1:t-joy,celebrationStyle:'gentle'});renderer.render(scene,camera);}requestAnimationFrame(tick);
old.style.opacity='0';view.style.pointerEvents='none';window.dispatchEvent(new Event('dungeon-ready'));
