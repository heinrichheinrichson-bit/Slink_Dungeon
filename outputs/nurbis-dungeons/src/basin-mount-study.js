import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {basinTraversal} from './basin-traversal.js';
import {createFuzzyCreature} from './garden/fuzzy-creature.js';
import * as THREE from 'three';
import {createGardenBasins} from './garden-basins.js';
import {createMaterialLibrary} from './material-library.js';
const $=id=>document.getElementById(id),map=['.....','.....','.UUU.','.....','.....'],library=createMaterialLibrary(),items=[];let empty=true,showGrid=false,progress=.5,playing=false,direction=1,travel=0;
for(const mount of ['flush','neighbors','original']){const canvas=$(mount),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#e9d7b5','#293b3e',1.15));const sun=new THREE.DirectionalLight('#ffe3b8',2.05);sun.position.set(-200,-240,500);sun.castShadow=true;Object.assign(sun.shadow.camera,{left:-300,right:300,top:300,bottom:-300});scene.add(sun);const rim=new THREE.DirectionalLight('#8ba7bc',.85);rim.position.set(200,250,300);scene.add(rim);const camera=new THREE.OrthographicCamera(-220,220,220,-220,1,1800);camera.up.set(0,0,1);const root=new THREE.Group();scene.add(root);const nurbi=createFuzzyCreature();nurbi.setPalette('apricot');nurbi.setSize(135);scene.add(nurbi.group);items.push({mount,canvas,renderer,scene,camera,root,nurbi,model:null,grid:null});}
function rebuild(){for(const item of items){item.model?.dispose();item.root.traverse(o=>{o.geometry?.dispose();});item.root.clear();const model=createGardenBasins({map,liquidType:$('liquid').value,mount:item.mount,initialOff:empty});item.model=model;item.root.add(model.group);
 if(item.mount==='flush'&&$('stairs').checked){
   const bed=-17,stone=new THREE.MeshStandardMaterial({color:'#737e72',roughness:.94});
   for(const side of [-1,1])for(let step=0;step<4;step++){
     const top=4-step*7,depth=14,x=side*(101-step*14-depth/2),h=top-bed;
     if(h<=0)continue;
     const tread=new THREE.Mesh(new RoundedBoxGeometry(depth,45,h,3,1),stone);tread.position.set(x,0,bed+h/2);tread.castShadow=tread.receiveShadow=true;item.root.add(tread);
   }
 }

 const gap=item.mount==='original'?20:0;
 for(let y=1;y<=3;y++)for(let x=0;x<=4;x++){if(y===2&&x>=1&&x<=3)continue;if((y===1||y===3)&&(x===0||x===4))continue;const xx=(x-2)*72+(x===0?-gap:x===4?gap:0),yy=(2-y)*72+(y===1?gap:y===3?-gap:0);const floor=library.stone(5,93+x+y*9,item.root,xx,yy,false,0);floor.position.z=-1;floor.scale.set(1.035,1.075,.24);if(y===1&&$('surround').value==='mixed'){const wall=library.stone(2,93+x,item.root,xx,yy,false,x===2?.08:0);wall.position.z=10;wall.scale.set(1.035,1.075,1.08);}}
 const grid=new THREE.Group();const material=new THREE.LineBasicMaterial({color:'#c6b98a',transparent:true,opacity:.45,depthTest:false});for(let i=-2.5;i<=2.5;i++){for(const axis of [0,1]){const points=axis?[new THREE.Vector3(i*72,-180,12),new THREE.Vector3(i*72,180,12)]:[new THREE.Vector3(-180,i*72,12),new THREE.Vector3(180,i*72,12)];grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material));}}grid.visible=showGrid;item.grid=grid;item.root.add(grid);
}}
$('stairs').onchange=rebuild;$('liquid').onchange=rebuild;$('surround').onchange=rebuild;$('fill').onclick=()=>{empty=!empty;playing=false;progress=0;sync();$('fill').textContent=empty?'Becken füllen':'Becken leeren';$('walk').disabled=$('back').disabled=$('position').disabled=!empty;};$('grid').onclick=()=>{showGrid=!showGrid;$('grid').textContent=showGrid?'Raster ausblenden':'Raster einblenden';$('grid').setAttribute('aria-pressed',showGrid);for(const item of items)item.grid.visible=showGrid};rebuild();
function sync(){$('position').value=Math.round(progress*100);$('walk-status').textContent=!empty?'Becken gefüllt · Nurbi wartet sicher am Rand.':playing?'Nurbi durchquert die leeren Becken.':progress===0?'Am linken Ufer':progress===1?'Am rechten Ufer':'Position: '+Math.round(progress*100)+' %';}
$('walk').onclick=()=>{empty=true;direction=1;progress=0;playing=true;sync()};$('back').onclick=()=>{empty=true;direction=-1;progress=1;playing=true;sync()};$('position').oninput=()=>{playing=false;progress=Number($('position').value)/100;sync()};$('shore').onclick=()=>{playing=false;progress=0;sync()};sync();
let last=0;function tick(ms){requestAnimationFrame(tick);if(document.hidden)return;const t=ms/1000,dt=Math.min(.05,t-last);last=t;if(playing){progress=Math.max(0,Math.min(1,progress+direction*dt/5));travel+=dt*200;if(progress===0||progress===1)playing=false;sync();}for(const item of items){const w=item.canvas.clientWidth,h=item.canvas.clientHeight;item.renderer.setSize(w,h,false);const view=$('view').value;item.camera.position.set(0,view==='top'?-1:view==='low'?-500:-260,view==='top'?700:view==='low'?210:660);item.camera.lookAt(0,0,8);const half=175;Object.assign(item.camera,{left:-half*w/h,right:half*w/h,top:half,bottom:-half});item.camera.updateProjectionMatrix();item.model.update(empty,t,dt);
 const {x,z}=basinTraversal(progress,item.mount,item.mount==='flush'&&$('stairs').checked);
 item.nurbi.group.position.set(x,0,empty?z:11);item.nurbi.group.rotation.z=direction>0?Math.PI/2:-Math.PI/2;
 item.nurbi.update(t,0,{active:playing,travel,celebrationAge:-1,celebrationStyle:'gentle'});
 item.canvas.setAttribute('aria-description',(empty?'Leeres Becken':'Gefülltes Becken')+' · Nurbi bei '+Math.round(progress*100)+' Prozent');
 item.renderer.render(item.scene,item.camera)}}requestAnimationFrame(tick);

