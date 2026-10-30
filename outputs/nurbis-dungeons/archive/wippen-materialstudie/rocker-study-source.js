import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const designs=[
{name:'Gartenmechanik',sub:'Salbei · Sand · Stein',rim:'#afa084',plate:'#99917b',ends:['#89987a','#bea573'],detail:'#ddd1ae',style:'grip',text:'Der bisherige Ausgangspunkt: ein heller Steinrahmen, salbeigrüne und sandfarbene Enden. Breite Griffrillen betonen die Richtung.'},
{name:'Alter Kalkstein',sub:'Kalk · eingelassene Kerben',rim:'#a89d85',plate:'#b4aa90',ends:['#999d83','#a49a80'],detail:'#686f5d',style:'carve',text:'Fast vollständig aus Stein. Eingeschnittene Bögen statt aufgesetzter farbiger Felder geben der Anlage einen ruhigen, alten Charakter.'},
{name:'Schiefer & Bronze',sub:'Dunkler Stein · warme Kanten',rim:'#8a7857',plate:'#505e5d',ends:['#63766b','#8e805e'],detail:'#bca575',style:'rivet',text:'Eine dunkle Steinwippe in einem schmalen Bronzerahmen. Kleine Befestigungen und eine eingelassene Linie erinnern an eine langlebige alte Anlage.'},
{name:'Versunkenes Holz',sub:'Altes Holz · dunkles Eisen',rim:'#545f56',plate:'#8b7354',ends:['#887552','#a08a62'],detail:'#454e43',style:'wood',text:'Abgegriffenes Holz, zurückhaltende Maserung und dunkle Metallbänder. Eine handwerkliche Verbindung zur Gartenwelt ohne frisches Grün.'},
{name:'Glasierte Erde',sub:'Ton · matte grüne Glasur',rim:'#88755e',plate:'#858a70',ends:['#687d6d','#b1a17d'],detail:'#c4b795',style:'ceramic',text:'Ein Tonrahmen mit weichen, glasierten Einlagen. Die Farbe bleibt gedämpft; ein einzelner ruhiger Bogen pro Ende ersetzt technische Symbole.'},
{name:'Farn im Fels',sub:'Graustein · Pflanzenabdruck',rim:'#777f70',plate:'#979c85',ends:['#87927a','#9f9d7e'],detail:'#5c6c55',style:'leaf',text:'Ein alter Pflanzenabdruck im Stein verbindet die Mechanik mit Nurbis Naturwelt. Kein wachsender Bewuchs: die Fläche bleibt ruhig und gut lesbar.'}
];
const $=s=>document.querySelector(s);let chosen=0,on=false;const instances=[];
function material(c){return new THREE.MeshStandardMaterial({color:c,roughness:.86,metalness:0.04})}
function box(g,w,d,h,r,c,x,y,z){const o=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),material(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function line(g,points,c,width=.45){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const o=new THREE.Mesh(new THREE.TubeGeometry(curve,24,width,6,false),material(c));g.add(o)}
function build(canvas,index,detail=false){const d=designs[index],renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;const scene=new THREE.Scene();const ambient=new THREE.HemisphereLight('#e5d9bc','#273b34',.9);scene.add(ambient);const light=new THREE.DirectionalLight('#ffe1b1',2);light.position.set(-90,-100,180);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-120,right:120,top:120,bottom:-120,near:1,far:400});light.shadow.normalBias=.15;scene.add(light);const rim=new THREE.DirectionalLight('#a2bfc7',.55);rim.position.set(90,70,130);scene.add(rim);
 const base=new THREE.Group();scene.add(base);box(base,160,144,10,7,'#333e34',0,0,-6);for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){if(!x&&!y)continue;box(base,67,64,5,5,(x+y)%2?'#424b3e':'#3d473c',x*71,y*68,-1)}
 box(base,65,57,3,7,'#1c2521',0,0,1);for(const s of [-1,1]){box(base,4,52,6,2,d.rim,s*30,0,4);box(base,62,4,6,2,d.rim,0,s*25,4)}
 const rocker=new THREE.Group();rocker.position.z=8;scene.add(rocker);box(rocker,50,40,7,4,d.plate,0,0,0);
 for(const [i,x] of [-13,13].entries()){
  if(d.style!=='carve'&&d.style!=='leaf'&&d.style!=='wood')box(rocker,19,31,1,3,d.ends[i],x,0,4);
  if(d.style==='grip')for(const y of [-7,0,7])box(rocker,10,1.2,.9,.4,d.detail,x,y,4.9);
  if(d.style==='carve'||d.style==='ceramic'){line(rocker,[[x-4,-9,4.7],[x-7,0,4.7],[x-4,9,4.7]],d.detail,d.style==='carve'?.55:.7)}
  if(d.style==='rivet'){box(rocker,1,24,.6,.2,d.detail,x,0,4.7);for(const y of [-13,13])box(rocker,2.1,2.1,.7,.8,d.detail,x,y,4.9)}
  if(d.style==='leaf'){line(rocker,[[x-4,-11,3.8],[x,0,3.8],[x+3,11,3.8]],d.detail,.4);for(let j=0;j<4;j++){let y=-7+j*4.5;line(rocker,[[x+y*.28,y,3.85],[x-5,y+3,3.85]],d.detail,.3);line(rocker,[[x+y*.28,y+1,3.85],[x+5,y+4,3.85]],d.detail,.3)}}
 }
 if(d.style==='wood'){for(const y of [-13,13])box(rocker,43,3,1,1,d.detail,0,y,4);for(let j=0;j<6;j++){let y=-10+j*4;line(rocker,[[-21,y,3.6],[-8,y+Math.sin(j)*1.3,3.6],[6,y-.7,3.6],[21,y+.3,3.6]],'#6d5c45',.17)}}
 box(rocker,1,32,.6,.2,'#4d594b',0,0,4.2);
 for(const s of [-1,1])box(base,5,4,3,1,d.rim,0,s*22,7);
 const camera=new THREE.OrthographicCamera(-56,56,56,-56,1,1000);camera.up.set(0,0,1);const obj={renderer,scene,camera,rocker,ambient,light,canvas,detail};instances.push(obj);return obj;
}
for(let i=0;i<6;i++){const button=document.createElement('button');button.className='choice';button.setAttribute('aria-pressed',i===0);button.innerHTML=`<canvas aria-hidden="true"></canvas><span>${String.fromCharCode(65+i)} · ${designs[i].name}</span><small>${designs[i].sub}</small>`;$('#choices').append(button);build(button.querySelector('canvas'),i);button.onclick=()=>select(i)}
let detail=build($('#detail'),0,true);
function select(i){chosen=i;const old=detail;old.renderer.dispose();old.scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});instances.splice(instances.indexOf(old),1);detail=build($('#detail'),i,true);document.querySelectorAll('.choice').forEach((b,j)=>b.setAttribute('aria-pressed',i===j));$('#name').textContent=designs[i].name;$('#description').textContent=designs[i].text;$('#number').textContent=`ENTWURF ${String.fromCharCode(65+i)} · BODENWIPPE`;}
function toggle(){on=!on;$('#state').textContent=on?'Rechtes Ende abgesenkt · linkes Ende angehoben':'Linkes Ende abgesenkt · rechtes Ende angehoben'}
$('#toggle').onclick=toggle;$('#detail').onclick=toggle;select(0);toggle();on=false;$('#state').textContent='Linkes Ende abgesenkt · rechtes Ende angehoben';
function render(){requestAnimationFrame(render);if(document.hidden)return;for(const o of instances){const w=o.canvas.clientWidth,h=o.canvas.clientHeight;if(!w||!h)continue;o.renderer.setSize(w,h,false);const half=o.detail?84:49,ratio=w/h;o.camera.left=-half*ratio;o.camera.right=half*ratio;o.camera.top=half;o.camera.bottom=-half;const view=o.detail?$('#view').value:'game';o.camera.position.set(view==='side'?240:0,view==='top'?-1:view==='reverse'?240:-155,view==='top'?350:300);o.camera.lookAt(0,0,0);o.camera.updateProjectionMatrix();o.rocker.rotation.y+=((on?.24:-.24)-o.rocker.rotation.y)*.15;o.ambient.intensity=$('#dim').checked?.72:1.15;o.light.intensity=$('#dim').checked?1.5:2.2;o.renderer.render(o.scene,o.camera)}}render();
