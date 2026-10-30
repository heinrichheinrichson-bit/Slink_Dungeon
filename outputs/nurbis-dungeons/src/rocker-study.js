import {createFloorRocker} from './floor-rocker.js';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const designs=[
{name:'Kompakte Wippe',sub:'Geschlossene Fassung',style:'compact',text:'Eine dicke, zusammenhängende Taste sitzt dicht im geschlossenen Gehäuse. Ein schmaler umlaufender Spalt zeigt die bewegliche Wippe; darunter liegt ein fester Unterbau.'},
{name:'Gewölbte Taste',sub:'Runder Rücken',style:'curved',text:'Ein gewölbter Rücken und volle Seitenflächen machen aus der Platte einen Schalterkörper. Das abgesenkte Ende taucht in die eng anliegende Fassung ein.'},
{name:'Gelagerte Wippe',sub:'Sichtbare Mittelachse',style:'axis',text:'Zwei kleine Lager an der Mitte erklären die Kippachse. Die breite Taste bleibt ein einziger geschlossener Körper; das Gehäuse schließt dicht an.'},
{name:'Zwei Druckenden',sub:'Sanfte Mulde in der Mitte',style:'saddle',text:'Eine durchgehende Taste mit zwei breiten Druckenden und einer flachen Mulde über der Achse. Die leicht erhöhten Enden betonen die Bedienrichtung.'}
];const palettes=[
 {name:'Kalk & Salbei',body:'#b1b49c',rim:'#78836c',accent:'#697d60',metal:false},
 {name:'Schiefer & Messing',body:'#627479',rim:'#a08b62',accent:'#c6b17d',metal:true},
 {name:'Ton & Kreide',body:'#a77960',rim:'#736c5a',accent:'#d6c5a2',metal:false},
 {name:'Nachtstein & Silber',body:'#596476',rim:'#7f8c90',accent:'#b7c9c5',metal:true},
 {name:'Humus & Bernstein',body:'#78604e',rim:'#8d8061',accent:'#c4a166',metal:false},
 {name:'Jade & Sand',body:'#789787',rim:'#aa9b79',accent:'#d4c5a2',metal:false}
];
let paletteIndex=0,decor='rills',density=.5;
const $=s=>document.querySelector(s);let chosen=0,on=false;const instances=[];
function material(c){return new THREE.MeshStandardMaterial({color:c,roughness:.86,metalness:0.04})}
function box(g,w,d,h,r,c,x,y,z){const o=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),material(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function line(g,points,c,width=.45){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const o=new THREE.Mesh(new THREE.TubeGeometry(curve,24,width,6,false),material(c));g.add(o)}
function build(canvas,index,detail=false){const d=designs[index],skin=palettes[paletteIndex],renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;const scene=new THREE.Scene();const ambient=new THREE.HemisphereLight('#e5d9bc','#273b34',.9);scene.add(ambient);const light=new THREE.DirectionalLight('#ffe1b1',2);light.position.set(-90,-100,180);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-120,right:120,top:120,bottom:-120,near:1,far:400});light.shadow.normalBias=.15;scene.add(light);const rim=new THREE.DirectionalLight('#a2bfc7',.55);rim.position.set(90,70,130);scene.add(rim);
 const base=new THREE.Group();scene.add(base);box(base,160,144,10,7,'#333e34',0,0,-6);for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){if(!x&&!y)continue;box(base,67,64,5,5,(x+y)%2?'#424b3e':'#3d473c',x*71,y*68,-1)}
 const {group,rocker}=createFloorRocker({form:index,palette:paletteIndex,decor,density});scene.add(group);
 const camera=new THREE.OrthographicCamera(-56,56,56,-56,1,1000);camera.up.set(0,0,1);const obj={renderer,scene,camera,rocker,ambient,light,canvas,detail};instances.push(obj);return obj;
}
for(let i=0;i<designs.length;i++){const button=document.createElement('button');button.className='choice';button.setAttribute('aria-pressed',i===0);button.innerHTML=`<canvas aria-hidden="true"></canvas><span>${String.fromCharCode(65+i)} · ${designs[i].name}</span><small>${designs[i].sub}</small>`;$('#choices').append(button);build(button.querySelector('canvas'),i);button.onclick=()=>select(i)}
let detail=build($('#detail'),0,true);
function select(i){chosen=i;const old=detail;old.renderer.dispose();old.scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});instances.splice(instances.indexOf(old),1);detail=build($('#detail'),i,true);document.querySelectorAll('.choice').forEach((b,j)=>b.setAttribute('aria-pressed',i===j));$('#name').textContent=designs[i].name;$('#description').textContent=designs[i].text;$('#number').textContent=`ENTWURF ${String.fromCharCode(65+i)} · BODENWIPPE`;}
function rebuild(){
 for(const o of [...instances]){o.renderer.dispose();o.scene.traverse(m=>{m.geometry?.dispose();if(m.material)m.material.dispose()})}
 instances.length=0;
 document.querySelectorAll('.choice canvas').forEach((c,i)=>build(c,i));
 detail=build($('#detail'),chosen,true);
 $('#finish-status').textContent=palettes[paletteIndex].name+' · '+$('#decor').selectedOptions[0].textContent+' · '+Math.round(density*100)+' %';
}
palettes.forEach((p,i)=>{const b=document.createElement('button');b.className='swatch';b.setAttribute('aria-pressed',i===0);b.innerHTML=`<i style="background:${p.body}"></i><i style="background:${p.rim}"></i><span>${p.name}</span>`;b.onclick=()=>{paletteIndex=i;document.querySelectorAll('.swatch').forEach((n,j)=>n.setAttribute('aria-pressed',i===j));rebuild()};$('#palettes').append(b)});
$('#decor').onchange=()=>{decor=$('#decor').value;rebuild()};
$('#density').oninput=()=>{density=Number($('#density').value)/100;$('#density-value').textContent=Math.round(density*100)+' %';rebuild()};
$('#neutral').onclick=()=>{paletteIndex=0;decor='none';$('#decor').value='none';document.querySelectorAll('.swatch').forEach((n,j)=>n.setAttribute('aria-pressed',j===0));rebuild()};
function toggle(){on=!on;$('#state').textContent=on?'Rechtes Ende abgesenkt · linkes Ende angehoben':'Linkes Ende abgesenkt · rechtes Ende angehoben'}
$('#toggle').onclick=toggle;$('#detail').onclick=toggle;select(0);rebuild();toggle();on=false;$('#state').textContent='Linkes Ende abgesenkt · rechtes Ende angehoben';
function render(){requestAnimationFrame(render);if(document.hidden)return;for(const o of instances){const w=o.canvas.clientWidth,h=o.canvas.clientHeight;if(!w||!h)continue;o.renderer.setSize(w,h,false);const half=o.detail?84:49,ratio=w/h;o.camera.left=-half*ratio;o.camera.right=half*ratio;o.camera.top=half;o.camera.bottom=-half;const view=o.detail?$('#view').value:'game';o.camera.position.set(view==='side'?240:0,view==='top'?-1:view==='reverse'?240:-155,view==='top'?350:300);o.camera.lookAt(0,0,0);o.camera.updateProjectionMatrix();o.rocker.rotation.y+=((on?.20:-.20)-o.rocker.rotation.y)*.15;o.ambient.intensity=$('#dim').checked?.72:1.15;o.light.intensity=$('#dim').checked?1.5:2.2;o.renderer.render(o.scene,o.camera)}}render();


