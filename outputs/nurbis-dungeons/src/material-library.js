// Preserved material study v04; same colours, geometry, motifs and detail strengths.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export function createMaterialLibrary({pattern=0}={}){
const settings={tone:'natural',grain:35,soft:15,pattern};
let textures=[],stoneMats=[];
function surface(type){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d'),image=c.createImageData(512,512);let seed=913+type*71;const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);let base=[[112,119,104],[90,65,48],[64,80,96],[81,73,66],[134,99,70],[73,60,47]][type];if(settings.tone!=='natural'){const tint={earth:[1.09,.98,.85],slate:[.85,.99,1.12],moss:[.96,1.07,.86]}[settings.tone];base=base.map((v,i)=>v*tint[i]);}
for(let y=0;y<512;y++)for(let x=0;x<512;x++){const noise=rng()-.5,cloud=Math.sin(x*.019+y*.011)*Math.sin(y*.016-x*.007),v=(noise*16+cloud*11)*settings.grain/100,k=(y*512+x)*4;for(let j=0;j<3;j++)image.data[k+j]=base[j]+v;image.data[k+3]=255;}c.putImageData(image,0,0);
const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
function mesh(g,m,parent){const o=new THREE.Mesh(g,m);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
// Identical straight, rounded Garden module in every variant. Details never change its footprint.
function shape(){const g=new RoundedBoxGeometry(67,64,43,5,8);g.translate(0,0,21.5);return g;}
function pebble(parent,x,y,z,sx,sy,sz,color){const m=new THREE.MeshStandardMaterial({color,roughness:.95});const o=mesh(new THREE.SphereGeometry(1,12,8),m,parent);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o;}
function strand(parent,points,width,color){const c=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),g=new THREE.TubeGeometry(c,Math.max(20,points.length*5),width,7,false),pos=g.attributes.position,rings=Math.max(20,points.length*5);for(let i=0;i<=rings;i++){const t=i/rings,center=c.getPointAt(t),taper=.08+.92*Math.pow(1-t,.72);for(let j=0;j<=7;j++){const k=i*8+j;pos.setXYZ(k,center.x+(pos.getX(k)-center.x)*taper,center.y+(pos.getY(k)-center.y)*taper,center.z+(pos.getZ(k)-center.z)*taper);}}g.computeVertexNormals();return mesh(g,new THREE.MeshStandardMaterial({color,roughness:.95}),parent);}
function network(parent,rng,density,mycelium=false){
 const edge=rng()*Math.PI*2,origin=[Math.cos(edge)*26,Math.sin(edge)*25],heading=edge+Math.PI+(rng()-.5)*.65;
 const color=mycelium?'#c0b79b':'#ad906a';
 function grow(start,angle,length,width,depth){const preferred=angle;const points=[[...start,43.35]],angles=[];let x=start[0],y=start[1],turn=(rng()-.5)*.3;const count=Math.max(5,Math.round(length/3.2));
 for(let i=1;i<=count;i++){turn=turn*.5+(rng()-.5)*(mycelium?.3:.2);angle+=turn+Math.atan2(Math.sin(preferred-angle),Math.cos(preferred-angle))*.2;const step=length/count*(.8+rng()*.4),nx=x+Math.cos(angle)*step,ny=y+Math.sin(angle)*step;if(Math.abs(nx)>26.2||Math.abs(ny)>24.8)break;x=nx;y=ny;points.push([x,y,43.35+Math.sin(i*.8)*.12]);angles.push(angle);}
 if(points.length<3)return;strand(parent,points,width,color);
 if(depth>0){const branches=1+Math.floor(rng()*(mycelium?4:3)+density*1.4),used=[];for(let k=0;k<branches;k++){const fraction=.23+rng()*.56;const at=Math.min(points.length-2,Math.max(1,Math.round(fraction*(points.length-1))));if(used.includes(at))continue;used.push(at);const side=rng()<.5?-1:1;const branchAngle=angles[at-1]+side*(.5+rng()*.85),branchLength=length*(.3+rng()*.3)*(1-fraction*.25);grow(points[at].slice(0,2),branchAngle,branchLength,width*(.4+rng()*.23),depth-1);}}
 }
 grow(origin,heading,(37+rng()*15)*(.28+density*.9),(mycelium?.26:.78)*( .8+density*.55),density<.2?1:mycelium?3:2);
 if(mycelium&&rng()<density*.8)grow([origin[0]*.65,origin[1]*.65],heading+(rng()-.5)*1.4,23+rng()*16,.2,2);
}
function stone(type,seed,parent,x=0,y=0,movable=false,amount=settings.soft/100){const group=new THREE.Group();group.position.set(x,y,2);parent.add(group);mesh(shape(),stoneMats[type],group);let n=(seed+311+settings.pattern*7297)>>>0;const rng=()=>((n=(n*1664525+1013904223)>>>0)/4294967296),density=amount;
if(type===0&&density>0){const angle=rng()*6.28,cx=Math.cos(angle)*16,cy=Math.sin(angle)*15;for(let j=0;j<Math.max(1,Math.round(density*52));j++){const a=rng()*6.28,r=Math.sqrt(rng()),xx=cx+Math.cos(a)*r*(6+rng()*9),yy=cy+Math.sin(a)*r*(5+rng()*7);if(Math.abs(xx)>26||Math.abs(yy)>24)continue;const size=.8+rng()*2.6;pebble(group,xx,yy,42.9,size,size*(.7+rng()*.5),.45+rng()*.65,['#78894d','#899858','#657747','#9ba064'][Math.floor(rng()*4)]);}}
if((type===1||type===5)&&density>0)network(group,rng,type===5?density*.65:density,false);
if(type===2&&density>0){for(let j=0;j<Math.max(1,Math.round(density*45));j++){const xx=-24+rng()*48,yy=-23+rng()*46;const chip=mesh(new THREE.CircleGeometry(.5+rng()*1.3,5),new THREE.MeshStandardMaterial({color:j%5===0?'#c9b78b':j%2?'#829baf':'#b4bfbe',metalness:.35,roughness:.6}),group);chip.position.set(xx,yy,43.15);chip.rotation.z=rng()*6;}}
if(type===3&&density>0){network(group,rng,density,true);if(rng()<density*.75){const xx=-18+rng()*36,yy=-18+rng()*36;pebble(group,xx,yy,44.5,.7,.7,1.6,'#c7bfa3');pebble(group,xx+.2,yy,46,1.9,1.6,.55,'#b2ad91');}}
if(type===4&&density>0){const cx=-5+rng()*10,cy=-5+rng()*10,angle=rng()*6.28,length=(22+rng()*11)*(.3+density*.9),leaves=2+Math.floor(density*5+rng()*2);const leafPoint=(u,v)=>[cx+Math.cos(angle)*u-Math.sin(angle)*v,cy+Math.sin(angle)*u+Math.cos(angle)*v,43.12];let bend=(rng()-.5)*4;const stem=[];for(let k=0;k<=7;k++){const u=(k/7-.5)*length;stem.push(leafPoint(u,Math.sin(k/7*Math.PI)*bend));}strand(group,stem,.2,'#79583e');for(let k=0;k<leaves;k++){const u=-length*.36+k/(leaves-1)*length*.7+(rng()-.5)*2,side=rng()<.5?-1:1,reach=3+rng()*5,base=Math.sin((u/length+.5)*Math.PI)*bend;strand(group,[leafPoint(u,base),leafPoint(u+reach*.35,base+side*reach*.6),leafPoint(u+reach*.7,base+side*reach)],.12+rng()*.09,'#806045');if(rng()<.45)strand(group,[leafPoint(u+1,base),leafPoint(u+2,base-side*reach*.45),leafPoint(u+4,base-side*reach*.75)],.11,'#806045');}}
if(type===5&&density>0){for(let j=0;j<Math.max(1,Math.round(density*14));j++){const xx=-23+rng()*46,yy=-22+rng()*44;const c=j%4===0?'#ba8751':j%2?'#9d927c':'#6b736c';const o=pebble(group,xx,yy,42.7,1.1+rng()*1.8,1+rng()*1.5,.5+rng()*.5,c);o.rotation.z=rng()*5;}}
if(movable){const ring=mesh(new THREE.TorusGeometry(9,1,7,36),new THREE.MeshStandardMaterial({color:'#c6b48b',roughness:1}),group);ring.position.set(0,-5,44.3);}
return group;}

textures=Array.from({length:6},(_,i)=>surface(i));
stoneMats=textures.map((t,i)=>new THREE.MeshStandardMaterial({map:t,roughness:i===2?.76:.96,bumpMap:t,bumpScale:settings.grain*.003}));
return {stone,materials:stoneMats,dispose(){textures.forEach(t=>t.dispose());stoneMats.forEach(m=>m.dispose());}};
}
