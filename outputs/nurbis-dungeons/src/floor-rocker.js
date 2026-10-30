import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export const designs=[
{name:'Kompakte Wippe',sub:'Geschlossene Fassung',style:'compact',text:'Eine dicke, zusammenhängende Taste sitzt dicht im geschlossenen Gehäuse. Ein schmaler umlaufender Spalt zeigt die bewegliche Wippe; darunter liegt ein fester Unterbau.'},
{name:'Gewölbte Taste',sub:'Runder Rücken',style:'curved',text:'Ein gewölbter Rücken und volle Seitenflächen machen aus der Platte einen Schalterkörper. Das abgesenkte Ende taucht in die eng anliegende Fassung ein.'},
{name:'Gelagerte Wippe',sub:'Sichtbare Mittelachse',style:'axis',text:'Zwei kleine Lager an der Mitte erklären die Kippachse. Die breite Taste bleibt ein einziger geschlossener Körper; das Gehäuse schließt dicht an.'},
{name:'Zwei Druckenden',sub:'Sanfte Mulde in der Mitte',style:'saddle',text:'Eine durchgehende Taste mit zwei breiten Druckenden und einer flachen Mulde über der Achse. Die leicht erhöhten Enden betonen die Bedienrichtung.'}
];export const palettes=[
 {name:'Kalk & Salbei',body:'#b1b49c',rim:'#78836c',accent:'#697d60',metal:false},
 {name:'Schiefer & Messing',body:'#627479',rim:'#a08b62',accent:'#c6b17d',metal:true},
 {name:'Ton & Kreide',body:'#a77960',rim:'#736c5a',accent:'#d6c5a2',metal:false},
 {name:'Nachtstein & Silber',body:'#596476',rim:'#7f8c90',accent:'#b7c9c5',metal:true},
 {name:'Humus & Bernstein',body:'#78604e',rim:'#8d8061',accent:'#c4a166',metal:false},
 {name:'Jade & Sand',body:'#789787',rim:'#aa9b79',accent:'#d4c5a2',metal:false}
];
function material(c){return new THREE.MeshStandardMaterial({color:c,roughness:.86,metalness:0.04})}
function box(g,w,d,h,r,c,x,y,z){const o=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),material(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function line(g,points,c,width=.45){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const o=new THREE.Mesh(new THREE.TubeGeometry(curve,24,width,6,false),material(c));g.add(o)}

export function createFloorRocker({form=1,palette=1,decor='inlay',density=.25,compact=false}={}){
 const d=designs[form]||designs[1],skin=palettes[palette]||palettes[1];const scene=new THREE.Group(),base=new THREE.Group();scene.add(base);
 box(base,compact?54:67,compact?46:64,6,6,'#414940',0,0,-1);
 box(base,compact?50:56,compact?40:46,5,5,skin.rim,0,0,1);
 box(base,compact?47:49,compact?36:39,4,4,'#51594f',0,0,3);
 const rocker=new THREE.Group();rocker.position.z=2;scene.add(rocker);
 let switchBody;
 const width=d.style==='compact'?44:45,depth=34;
 if(d.style==='compact'||d.style==='axis'){
   switchBody=box(rocker,width,depth,20,4,skin.body,0,0,0);
 }else{
   const shape=new THREE.Shape();shape.moveTo(-22.5,-12);shape.lineTo(22.5,-12);shape.lineTo(22.5,8);
   if(d.style==='curved')shape.bezierCurveTo(15,16,-15,16,-22.5,8);
   else {shape.bezierCurveTo(15,14,10,7,0,7);shape.bezierCurveTo(-10,7,-15,14,-22.5,8);}
   shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:30,steps:1,bevelEnabled:true,bevelSegments:4,bevelSize:1.3,bevelThickness:1.3,curveSegments:24});
   // Extrusion depth becomes Y, profile height becomes Z.
   geo.rotateX(Math.PI/2);geo.translate(0,15,0);
   const body=new THREE.Mesh(geo,material(skin.body));body.castShadow=body.receiveShadow=true;rocker.add(body);switchBody=body;
 }
 // Surface-following relief: decoration stays attached to every accepted profile.
 scene.updateMatrixWorld(true);
 const probe=new THREE.Raycaster();
 function surface(x,y=0){probe.set(new THREE.Vector3(x,y,100),new THREE.Vector3(0,0,-1));return (probe.intersectObject(switchBody)[0]?.point.z??12)-rocker.position.z+.28;}
 const mark=(points,width=.35)=>line(rocker,points.map(([x,y])=>[x,y,surface(x,y)+.12]),skin.accent,width);
 const amt=Math.round(density*4);
 if(decor==='rills'&&amt)for(const x of [-14,14])for(let j=0;j<amt;j++){const y=(j-(amt-1)/2)*4;mark([[x-3,y],[x+3,y]],.32)}
 if(decor==='inlay'&&amt){
   for(const side of [-1,1])mark([[side*19,-10],[side*20,0],[side*19,10]],.35);
   if(amt>1)for(const side of [-1,1])mark([[side*9,-11],[side*17,-11]],.3);
   if(amt>3)for(const side of [-1,1])mark([[side*9,11],[side*17,11]],.3);
 }
 if(decor==='fern'&&amt){
   mark([[-13,-10],[-11,-5],[-8,1],[-5,8]],.28);
   for(let j=0;j<amt+1;j++){const y=-7+j*3.2,x=-12+j*1.45;mark([[x,y],[x-3.5-j*.2,y+1],[x-4,y+3]],.2);if(j%2===0)mark([[x+1,y+1],[x+4,y+2.6]],.18)}
 }
 if(decor==='mineral'&&amt){
   const chips=[[-17,8,1.3],[-13,10,.7],[-18,4,.6],[15,-9,1.1],[18,-6,.5],[12,-10,.6],[16,-3,.45],[9,-11,.4]];
   for(const [x,y,size] of chips.slice(0,amt*2)){const chip=new THREE.Mesh(new THREE.CircleGeometry(size,5),material(skin.accent));chip.position.set(x,y,surface(x,y)+.15);rocker.add(chip)}
 }
 if(decor==='seal'&&amt){
   for(const x of [-13,13]){const pts=[];for(let n=0;n<=36;n++){let a=n/36*Math.PI*2;pts.push([x+3.8*Math.cos(a),3.8*Math.sin(a)])}mark(pts,.28);if(amt>1)mark([[x-1.5,0],[x+1.5,0]],.38);if(amt>3)mark([[x,-1.5],[x,1.5]],.38)}
 }
 if(decor==='moss'&&amt){
   const spots=[[-23,18,1.2],[-20.5,19,1.5],[-18,19,.8],[-22,16.5,.8],[-24,15.8,.65],[-16.5,19.5,.7],[-20,17,.9],[-25,18,.7]];
   for(const [x,y,r] of spots.slice(0,amt*2)){const o=new THREE.Mesh(new THREE.SphereGeometry(r,10,7),material('#687850'));o.position.set(x,y,3.3);o.scale.z=.35;base.add(o)}
 }
 if(d.style==='axis')for(const side of [-1,1]){
   box(base,9,6,9,2,skin.rim,0,side*20,4);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(3,3,1.5,24),material(skin.accent));cap.position.set(0,side*23.3,5);base.add(cap);
 }
 rocker.rotation.y=-.20;if(compact)scene.scale.z=.72;return {group:scene,rocker};
}
