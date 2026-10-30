import {createSinkingGate as gate} from './sinking-gate.js';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createMaterialLibrary} from './material-library.js';
import {createFuzzyCreature} from './garden/fuzzy-creature.js';
const $=id=>document.getElementById(id),lib=createMaterialLibrary(),scenes=[];
const materials={stone:new THREE.MeshStandardMaterial({color:'#777966',roughness:.94}),metal:new THREE.MeshStandardMaterial({color:'#5b685d',metalness:.42,roughness:.67}),edge:new THREE.MeshStandardMaterial({color:'#a19b79',metalness:.3,roughness:.7}),dark:new THREE.MeshStandardMaterial({color:'#303d32',roughness:.95})};
function block(parent,w,d,h,x,y,z,material,r=3){const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
for(const [id,amount]of [['closed',0],['half',.46],['open',1],['test',0]]){
 const canvas=$(id),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.localClippingEnabled=true;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#e9d7b5','#24342e',1.2));const light=new THREE.DirectionalLight('#ffe3b8',2);light.position.set(-160,-240,400);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-240,right:240,top:240,bottom:-240,near:1,far:900});light.shadow.normalBias=.3;scene.add(light);const rim=new THREE.DirectionalLight('#92adc0',.7);rim.position.set(130,170,240);scene.add(rim);
 const root=new THREE.Group();scene.add(root);block(root,223,293,12,0,0,0,materials.dark,8);
 for(let y=-1;y<=2;y++)for(let x=-1;x<=1;x++){const tile=lib.stone(1,44+x*9+y*17,root,x*72,y*72-36,false,.06);tile.position.z=2;tile.scale.set(1.035,1.075,.24);}
 for(const x of [-72,72]){const wall=lib.stone(0,66+x,root,x,0,false,.16);wall.position.z=12;wall.scale.set(.62,.65,.58);}
 const device=gate(root,{compact:false});device.set(amount);
 const nurbi=createFuzzyCreature();nurbi.setPalette('apricot');nurbi.setSize(105);nurbi.group.position.set(0,id==='open'?0:-82,14);root.add(nurbi.group);
 const stone=lib.stone(0,73,root,0,0,true,.08);stone.scale.set(.88,.88,.8);stone.position.z=14;stone.visible=false;
 const camera=new THREE.OrthographicCamera();camera.up.set(0,0,1);scenes.push({id,canvas,renderer,scene,camera,device,nurbi,stone,root});
}
const demo=scenes.find(s=>s.id==='test');let opening=0,target=0,crossing=false,travel=0,from=-82,to=82,blockedNotice=false,last=0;
function status(text){$('status').textContent=text;}
function controls(){ $('toggle').textContent=target===1?'Tor schließen':'Tor öffnen';$('cross').disabled=crossing||opening<.999||$('obstacle').value!=='none'; }
$('toggle').onclick=()=>{target=target===1?0:1;blockedNotice=false;controls();};
$('cross').onclick=()=>{if(opening<.999||crossing||$('obstacle').value!=='none')return;crossing=true;travel=0;from=demo.nurbi.group.position.y;to=from<0?82:-82;controls();};
$('obstacle').onchange=()=>{crossing=false;const kind=$('obstacle').value;demo.stone.visible=kind==='stone';demo.nurbi.group.visible=kind!=='stone';demo.nurbi.group.position.y=kind==='nurbi'?0:-82;if(kind!=='none'&&opening<.999){target=1;status('Hindernis gewählt · das Tor öffnet zuerst für den Test.');}controls();};
$('reset').onclick=()=>{opening=target=0;crossing=false;blockedNotice=false;demo.nurbi.group.visible=true;demo.nurbi.group.position.y=-82;demo.stone.visible=false;$('obstacle').value='none';controls();status('Geschlossen · der Durchgang ist blockiert.');};
function tick(ms){requestAnimationFrame(tick);const dt=Math.min(.04,(ms-last)/1000);last=ms;const kind=$('obstacle').value,occupied=kind!=='none'||crossing;
 if(target===0&&occupied&&opening>0){target=1;blockedNotice=true;status('Hindernis erkannt · das Gitter hält vor dem Kontakt an und öffnet wieder.');controls();}
 if(opening!==target){opening=THREE.MathUtils.clamp(opening+Math.sign(target-opening)*dt*.65,0,1);if(Math.abs(target-opening)<.001)opening=target;if(!blockedNotice)status(opening===1?'Offen · der Weg ist frei.':opening===0?'Geschlossen · der Durchgang ist blockiert.':target?'Das Gitter fährt nach oben.':'Das Gitter fährt nach unten.');controls();}
 demo.device.set(opening);
 if(crossing){travel=Math.min(1,travel+dt*.55);demo.nurbi.group.position.y=THREE.MathUtils.lerp(from,to,THREE.MathUtils.smoothstep(travel,0,1));demo.nurbi.group.rotation.z=to>from?Math.PI:0;if(travel===1){crossing=false;controls();status('Nurbi ist durch das offene Tor gegangen.');}}
 for(const s of scenes){const angle=Number($('orientation').value)*Math.PI/180;s.root.rotation.z=angle;const w=s.canvas.clientWidth,h=s.canvas.clientHeight;s.renderer.setSize(w,h,false);const view=$('view').value;s.camera.position.set(0,view==='top'?-1:view==='low'?-510:-350,view==='top'?720:view==='low'?440:700);s.camera.lookAt(0,5,35);const scale=s.id==='test'?190:170;s.camera.left=-scale*w/h;s.camera.right=scale*w/h;s.camera.top=scale;s.camera.bottom=-scale;s.camera.near=1;s.camera.far=1600;s.camera.updateProjectionMatrix();s.nurbi.update(ms/1000,dt,{active:s===demo&&crossing,travel:s===demo&&crossing?1:0,celebrationAge:-1,celebrationStyle:'gentle'});s.renderer.render(s.scene,s.camera);}
}controls();requestAnimationFrame(tick);
