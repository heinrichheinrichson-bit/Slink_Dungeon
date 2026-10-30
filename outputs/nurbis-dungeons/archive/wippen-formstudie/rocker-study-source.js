import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const designs=[
{name:'Kompakte Wippe',sub:'Geschlossene Fassung',style:'compact',text:'Eine dicke, zusammenhängende Taste sitzt dicht im geschlossenen Gehäuse. Ein schmaler umlaufender Spalt zeigt die bewegliche Wippe; darunter liegt ein fester Unterbau.'},
{name:'Gewölbte Taste',sub:'Runder Rücken',style:'curved',text:'Ein gewölbter Rücken und volle Seitenflächen machen aus der Platte einen Schalterkörper. Das abgesenkte Ende taucht in die eng anliegende Fassung ein.'},
{name:'Gelagerte Wippe',sub:'Sichtbare Mittelachse',style:'axis',text:'Zwei kleine Lager an der Mitte erklären die Kippachse. Die breite Taste bleibt ein einziger geschlossener Körper; das Gehäuse schließt dicht an.'},
{name:'Zwei Druckenden',sub:'Sanfte Mulde in der Mitte',style:'saddle',text:'Eine durchgehende Taste mit zwei breiten Druckenden und einer flachen Mulde über der Achse. Die leicht erhöhten Enden betonen die Bedienrichtung.'}
];const $=s=>document.querySelector(s);let chosen=0,on=false;const instances=[];
function material(c){return new THREE.MeshStandardMaterial({color:c,roughness:.86,metalness:0.04})}
function box(g,w,d,h,r,c,x,y,z){const o=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),material(c));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function line(g,points,c,width=.45){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const o=new THREE.Mesh(new THREE.TubeGeometry(curve,24,width,6,false),material(c));g.add(o)}
function build(canvas,index,detail=false){const d=designs[index],renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;const scene=new THREE.Scene();const ambient=new THREE.HemisphereLight('#e5d9bc','#273b34',.9);scene.add(ambient);const light=new THREE.DirectionalLight('#ffe1b1',2);light.position.set(-90,-100,180);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-120,right:120,top:120,bottom:-120,near:1,far:400});light.shadow.normalBias=.15;scene.add(light);const rim=new THREE.DirectionalLight('#a2bfc7',.55);rim.position.set(90,70,130);scene.add(rim);
 const base=new THREE.Group();scene.add(base);box(base,160,144,10,7,'#333e34',0,0,-6);for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){if(!x&&!y)continue;box(base,67,64,5,5,(x+y)%2?'#424b3e':'#3d473c',x*71,y*68,-1)}
 // A solid filled housing, rather than an open well. The moving body extends
 // below the floor; only its exposed upper surface and narrow joint are visible.
 box(base,67,64,6,6,'#414940',0,0,-1);
 box(base,56,46,5,6,'#777d70',0,0,1);
 box(base,49,39,4,5,'#51594f',0,0,3);
 const rocker=new THREE.Group();rocker.position.z=2;scene.add(rocker);
 const width=d.style==='compact'?44:45,depth=34;
 if(d.style==='compact'||d.style==='axis'){
   box(rocker,width,depth,20,4,'#b0b29f',0,0,0);
 }else{
   const shape=new THREE.Shape();shape.moveTo(-22.5,-12);shape.lineTo(22.5,-12);shape.lineTo(22.5,8);
   if(d.style==='curved')shape.bezierCurveTo(15,16,-15,16,-22.5,8);
   else {shape.bezierCurveTo(15,14,10,7,0,7);shape.bezierCurveTo(-10,7,-15,14,-22.5,8);}
   shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:30,steps:1,bevelEnabled:true,bevelSegments:4,bevelSize:1.3,bevelThickness:1.3,curveSegments:24});
   // Extrusion depth becomes Y, profile height becomes Z.
   geo.rotateX(Math.PI/2);geo.translate(0,15,0);
   const body=new THREE.Mesh(geo,material('#b0b29f'));body.castShadow=body.receiveShadow=true;rocker.add(body);
 }
 // The same subtle grip marks on every form keep material comparisons neutral.
 const top=d.style==='curved'?13.8:d.style==='saddle'?10.6:10.3;
 for(const x of [-14,14])for(const y of [-5,0,5])box(rocker,6,.8,.45,.2,'#7d8575',x,y,top);
 if(d.style==='axis')for(const side of [-1,1]){
   box(base,9,6,9,2,'#777d70',0,side*20,4);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(3,3,1.5,24),material('#aaa995'));cap.position.set(0,side*23.3,5);base.add(cap);
 } const camera=new THREE.OrthographicCamera(-56,56,56,-56,1,1000);camera.up.set(0,0,1);const obj={renderer,scene,camera,rocker,ambient,light,canvas,detail};instances.push(obj);return obj;
}
for(let i=0;i<designs.length;i++){const button=document.createElement('button');button.className='choice';button.setAttribute('aria-pressed',i===0);button.innerHTML=`<canvas aria-hidden="true"></canvas><span>${String.fromCharCode(65+i)} · ${designs[i].name}</span><small>${designs[i].sub}</small>`;$('#choices').append(button);build(button.querySelector('canvas'),i);button.onclick=()=>select(i)}
let detail=build($('#detail'),0,true);
function select(i){chosen=i;const old=detail;old.renderer.dispose();old.scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});instances.splice(instances.indexOf(old),1);detail=build($('#detail'),i,true);document.querySelectorAll('.choice').forEach((b,j)=>b.setAttribute('aria-pressed',i===j));$('#name').textContent=designs[i].name;$('#description').textContent=designs[i].text;$('#number').textContent=`ENTWURF ${String.fromCharCode(65+i)} · BODENWIPPE`;}
function toggle(){on=!on;$('#state').textContent=on?'Rechtes Ende abgesenkt · linkes Ende angehoben':'Linkes Ende abgesenkt · rechtes Ende angehoben'}
$('#toggle').onclick=toggle;$('#detail').onclick=toggle;select(0);toggle();on=false;$('#state').textContent='Linkes Ende abgesenkt · rechtes Ende angehoben';
function render(){requestAnimationFrame(render);if(document.hidden)return;for(const o of instances){const w=o.canvas.clientWidth,h=o.canvas.clientHeight;if(!w||!h)continue;o.renderer.setSize(w,h,false);const half=o.detail?84:49,ratio=w/h;o.camera.left=-half*ratio;o.camera.right=half*ratio;o.camera.top=half;o.camera.bottom=-half;const view=o.detail?$('#view').value:'game';o.camera.position.set(view==='side'?240:0,view==='top'?-1:view==='reverse'?240:-155,view==='top'?350:300);o.camera.lookAt(0,0,0);o.camera.updateProjectionMatrix();o.rocker.rotation.y+=((on?.20:-.20)-o.rocker.rotation.y)*.15;o.ambient.intensity=$('#dim').checked?.72:1.15;o.light.intensity=$('#dim').checked?1.5:2.2;o.renderer.render(o.scene,o.camera)}}render();

