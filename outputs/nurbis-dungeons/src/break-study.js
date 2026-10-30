import {createDungeonFoundation} from './dungeon-foundation.js';
import {positionWoodFragment,woodStoneHeight} from './break-motion.js';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createMaterialLibrary} from './material-library.js';
import {createFuzzyCreature} from './garden/fuzzy-creature.js';
const $=id=>document.getElementById(id),library=createMaterialLibrary(),items=[];let time=0,playing=false,last=0;
const smooth=(a,b,t)=>THREE.MathUtils.smoothstep(t,a,b);
function mat(color){return new THREE.MeshStandardMaterial({color,roughness:.94})}
function box(parent,w,d,h,r,color,x,y,z){const m=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),mat(color));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
function line(parent,points,r,color){const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,r,6,false),mat(color));parent.add(m);return m}
function woodMaterial(seed){const c=document.createElement('canvas');c.width=256;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#776249';ctx.fillRect(0,0,256,512);let n=seed;const rng=()=>((n=(n*1664525+1013904223)>>>0)/4294967296);for(let j=0;j<120;j++){let x=rng()*256;ctx.strokeStyle=j%3?'rgba(45,35,25,.13)':'rgba(204,183,139,.15)';ctx.lineWidth=.3+rng()*1.4;ctx.beginPath();for(let y=0;y<=512;y+=16){const xx=x+Math.sin(y*.018+j)*(.5+rng()*2);y?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}ctx.stroke();}for(let j=0;j<2;j++){const x=30+rng()*190,y=60+rng()*390;for(let r=1;r<5;r++){ctx.strokeStyle='rgba(48,37,27,.16)';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,y,2+r*1.6,6+r*4,.08,0,Math.PI*2);ctx.stroke();}}const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshStandardMaterial({map:texture,roughness:.98})}
function fragment(parent,points,material,depth=6){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.35,bevelThickness:.35,bevelSegments:2});const uv=geometry.attributes.uv,pos=geometry.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+34)/68,(pos.getY(i)+32)/64);const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh}
// Soft, irregular dust density rather than individual solid specks.
const dustCanvas=document.createElement('canvas');dustCanvas.width=dustCanvas.height=128;
const dustContext=dustCanvas.getContext('2d');
for(let i=0;i<13;i++){const x=64+Math.sin(i*2.4)*19,y=64+Math.cos(i*1.7)*17,r=21+(i%4)*4;const g=dustContext.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.17)');g.addColorStop(.45,'rgba(255,255,255,.11)');g.addColorStop(1,'rgba(255,255,255,0)');dustContext.fillStyle=g;dustContext.fillRect(0,0,128,128);}
const dustTexture=new THREE.CanvasTexture(dustCanvas);
for(const type of ['wood','stone']){
 const canvas=$(type),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,stencil:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#e9d7b5','#24342e',1.05));const sun=new THREE.DirectionalLight('#ffe3b8',2.1);sun.position.set(-190,-230,400);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-230,right:230,top:230,bottom:-230,near:1,far:850});sun.shadow.normalBias=.2;scene.add(sun);const rim=new THREE.DirectionalLight('#8ba7bc',.7);rim.position.set(170,200,300);scene.add(rim);
 const root=new THREE.Group();scene.add(root);
 // One continuous terrain body closes the module gaps. The shaft is a real
 // hole in its geometry, so only that opening reveals the underground space.
 const foundation=createDungeonFoundation();root.add(foundation);
 // Mask the deep interior to the shaft mouth: a thin carrier must not expose
 // a hanging shaft exterior or falling debris below its outer silhouette.
 const maskMaterial=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false,depthTest:false,stencilWrite:true,stencilRef:1,stencilFunc:THREE.AlwaysStencilFunc,stencilZPass:THREE.ReplaceStencilOp});
 const mask=new THREE.Mesh(new THREE.ShapeGeometry(foundation.userData.shaftOpening),maskMaterial);mask.position.z=5;mask.renderOrder=-20;root.add(mask);
 const shaftMaterial=color=>{const m=mat(color);m.stencilWrite=true;m.stencilWriteMask=0;m.stencilRef=1;m.stencilFunc=THREE.EqualStencilFunc;return m;};
 const shaftParts=[];

 for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){if(x===0&&y===0)continue;const tile=library.stone(1,50+x*7+y*13,root,x*72,y*72,false,0);tile.position.z=-1;tile.scale.set(1.035,1.075,.24);}
 // Open shaft with walls that darken with depth; no flat black replacement tile.
 for(let row=0;row<4;row++){const z=-13-row*27,color=['#5b4b39','#464536','#303a30','#202b25'][row];for(const side of [-1,1]){const a=box(root,5,65,28,3,color,side*34,0,z),b=box(root,66,5,28,3,color,0,side*32,z);a.material=shaftMaterial(color);b.material=shaftMaterial(color);shaftParts.push(a,b);}}
 const bottom=box(root,64,61,3,1,'#0c1610',0,0,-111);bottom.material=shaftMaterial('#0c1610');
 const intact=new THREE.Group(),debris=new THREE.Group(),fissures=new THREE.Group();root.add(intact,debris,fissures);const pieces=[],boards=[];
 if(type==='wood'){
  for(const y of [-30,30])box(root,59,5,6,2,'#57442e',0,y,1);
  for(let b=0;b<4;b++){const board=new THREE.Group();intact.add(board);boards.push({group:board,delay:b*.045});const x=-24+b*16,m=woodMaterial(441+b*137),deck=new THREE.Mesh(new RoundedBoxGeometry(14.5,60,5,4,1),m);deck.position.set(x,0,8);deck.castShadow=deck.receiveShadow=true;const p=deck.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)-(.4+b*.12)*Math.max(0,1-(p.getY(i)/30)**2));deck.geometry.computeVertexNormals();board.add(deck);
   for(const y of [-26,26]){const nail=new THREE.Mesh(new THREE.SphereGeometry(.65,8,6),mat('#414b3b'));nail.scale.z=.3;nail.position.set(x+(b%2?3:-3),y,10.8);board.add(nail);}
   const crack=line(fissures,[[x-2,-28,10.7],[x-1,-19,10.7],[x+1,-12,10.7],[x-1,-2,10.7],[x+2,8,10.7],[x,19,10.7],[x+2,28,10.7]],.17,'#b19b79');crack.material.transparent=true;crack.material.opacity=0;
   const cut=-4+b*2.4;
   for(const side of [-1,1]){const pts=side<0?[[x-7,-30],[x+7,-30],[x+7,cut-1],[x+3,cut+2],[x,cut-1],[x-4,cut+1],[x-7,cut]]:[[x-7,cut+.4],[x-4,cut+1.8],[x,cut-.2],[x+3,cut+3],[x+7,cut],[x+7,30],[x-7,30]];const piece=fragment(debris,pts,[m.clone(),mat('#a58e68')],5);piece.position.z=5.5;piece.geometry.computeBoundingBox();pieces.push({mesh:piece,z:5.5,side,delay:b*.045,spin:side*(.8+b*.17),drift:(b-1.5)*5});}
  }
 }else{
  const tile=library.stone(0,146,intact,0,0,false,0);tile.position.z=-1;tile.scale.set(1,.99,.24);let stoneMat;tile.traverse(o=>{if(o.isMesh&&!stoneMat)stoneMat=o.material});
  const cracks=[[[-28,18,10.2],[-13,12,10.3],[-9,0,10.3],[3,-5,10.3],[8,-25,10.2]],[[3,-5,10.3],[15,3,10.3],[28,5,10.2]],[[-9,0,10.3],[-19,-6,10.3],[-27,-5,10.2]]];for(const points of cracks)line(intact,points,.23,'#424b3f');
  const polygons=[[[-32,-30],[6,-30],[2,-6],[-10,0],[-20,-7],[-32,-6]],[[8,-30],[32,-30],[32,5],[16,3],[4,-6]],[[-32,-4],[-21,-5],[-11,2],[-14,13],[-32,22]],[[-32,24],[-12,15],[-10,4],[15,5],[20,30],[-32,30]],[[18,5],[32,7],[32,30],[22,30]]];
  polygons.forEach((points,i)=>{const piece=fragment(debris,points,stoneMat.clone(),9);piece.position.z=.5;pieces.push({mesh:piece,z:.5,spin:(i%2?1:-1)*(.5+i*.2),drift:(i-2)*6});});
 }
 debris.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material)){m.stencilWrite=true;m.stencilWriteMask=0;m.stencilRef=1;m.stencilFunc=THREE.EqualStencilFunc;}});
 const stone=library.stone(0,73,root,-72,0,true,.08);stone.scale.set(.88,.88,.8);stone.position.z=11;stone.traverse(o=>{if(o.isMesh)o.material=o.material.clone();});
 const nurbi=createFuzzyCreature();nurbi.setPalette('apricot');nurbi.setSize(135);nurbi.group.position.set(-72,-72,11);nurbi.group.rotation.z=.8;scene.add(nurbi.group);
 // Short remnants stay on the bearings, outside the stone footprint plus clearance.
 // Keep the stone upright through the shaft; tilting would enlarge its swept width.
 const stubs=new THREE.Group();root.add(stubs);
 if(type==='wood'){
  const lengths=[[1.2,2.1,1.6,1.8],[1.9,1.1,2,1.4]];
  for(const [si,side]of [-1,1].entries())for(let b=0;b<4;b++){
   const x=-24+b*16,length=lengths[si][b],outer=32.2;
   const count=3+(b+si)%3,edge=[[-7,outer],[-7,outer-length+.4]];
   for(let j=1;j<count;j++){
    const dx=-7+14*j/count+Math.sin((b+1)*17+si*11+j*7)*.8;
    const grain=Math.sin((b+1)*31+si*23+j*13)*.35+Math.cos(b*9+si*5+j*17)*.15;
    edge.push([dx,Math.max(29.6,outer-length+grain)]);
   }
   edge.push([7,outer-length+Math.sin(b*14+si*9)*.25],[7,outer]);
   const points=edge.map(([dx,y])=>[x+dx,side*y]);
   const stub=fragment(stubs,points,[woodMaterial(441+b*137),mat('#937a56')],4.8);
   stub.position.z=5.4;
  }
 }else{
  let rock;intact.traverse(o=>{if(o.isMesh&&!rock)rock=o.material;});
  const patches=[
   [[-35,18],[-32.3,19],[-31.2,24],[-32.1,26],[-31.5,30],[-35,33]],
   [[3,33],[4,30.6],[9,29.8],[12,30.7],[15,30.1],[18,33]],
   [[-25,-33],[-23,-30.4],[-19,-31],[-16,-29.8],[-12,-30.6],[-10,-33]],
   [[35,-13],[32.2,-12],[31.2,-8],[32.4,-5],[31.6,-1],[35,2]]
  ];
  patches.forEach((points,i)=>{const chip=fragment(stubs,points,rock.clone(),3.4+(i%2)*1.1);chip.position.z=4.1+(i%3)*.25;});
 }
 const dust=[];for(let i=0;i<24;i++){
  const material=new THREE.SpriteMaterial({map:dustTexture,color:type==='wood'?'#b3a080':'#a8ad9b',transparent:true,opacity:0,depthWrite:false,depthTest:true});
  const cloud=new THREE.Sprite(material);cloud.visible=false;root.add(cloud);dust.push({cloud,index:i});
 }
 const camera=new THREE.OrthographicCamera(-150,150,150,-150,1,1600);camera.up.set(0,0,1);items.push({type,canvas,renderer,scene,camera,intact,debris,pieces,boards,stone,nurbi,stubs,dust,fissures,foundation});
}
function stateLabel(){const phase=time<.1?'Bereit · der Stein steht vor der Schwachstelle.':time<1.25?'Der Stein wird auf die Schwachstelle geschoben.':time<1.65?'Die Oberfläche gibt unter dem Gewicht nach.':time<2.9?'Der Boden bricht. Stein und Bruchstücke fallen in den Schacht.':'Eingebrochen · der Stein ist in der Tiefe verschwunden.';$('phase').textContent=phase;$('time').value=Math.round(time/8*1000)}
$('play').onclick=()=>{if(playing){playing=false;$('play').textContent='Weiter abspielen';return;}if(time>=8)time=0;playing=true;$('play').textContent='Anhalten';};$('reset').onclick=()=>{time=0;playing=false;$('play').textContent='Stein daraufschieben';stateLabel()};$('time').oninput=()=>{time=Number($('time').value)/1000*8;playing=false;$('play').textContent='Weiter abspielen';stateLabel()};
function tick(ms){requestAnimationFrame(tick);if(document.hidden){last=ms/1000;return;}const t=ms/1000,dt=Math.min(.05,t-last);last=t;if(playing){time=Math.min(8,time+dt*Number($('speed').value));if(time===8){playing=false;$('play').textContent='Erneut daraufschieben';}stateLabel();}
 for(const item of items){const w=item.canvas.clientWidth,h=item.canvas.clientHeight;item.renderer.setSize(w,h,false);const mode=$('view').value;item.camera.position.set(0,mode==='top'?-1:mode==='low'?-420:-260,mode==='top'?720:mode==='low'?600:700);item.camera.lookAt(0,0,-10);const zoom=$('zoom').value==='near'?88:140;Object.assign(item.camera,{left:-zoom*w/h,right:zoom*w/h,top:zoom,bottom:-zoom});item.camera.updateProjectionMatrix();
  const move=smooth(0,1.25,time),stress=smooth(1.25,1.65,time),fall=Math.max(0,time-1.65),wood=item.type==='wood';
  // Restore the first study's direct slide and free fall. Large broken
  // boards, rather than added splinter particles, carry the visible effect.
  item.stone.position.set(-72*(1-move),0,wood?woodStoneHeight(fall,stress):11-stress*2-220*fall*fall);
  item.stone.visible=fall<.85;item.stone.rotation.y=0;
  item.stone.traverse(o=>{if(o.isMesh){o.material.stencilWrite=item.stone.position.z+36<5;o.material.stencilWriteMask=0;o.material.stencilRef=1;o.material.stencilFunc=THREE.EqualStencilFunc;}});
  item.foundation.visible=$('base').checked;item.fissures.visible=false;
  item.intact.visible=time<1.65;item.boards.forEach(b=>b.group.visible=true);item.intact.position.z=-stress*(wood?2.5:1);
  item.debris.visible=time>=1.65&&fall<1;item.stubs.visible=time>=1.65;
  item.pieces.forEach((p,i)=>{
   if(wood){
    p.mesh.visible=true;p.index=i;positionWoodFragment(p,fall,item.stone.position.z-.6);
   }else{const f=Math.max(0,fall-(i%3)*.025);p.mesh.position.set(p.drift*f,Math.sin(i*2)*f*9,p.z-2-170*f*f);p.mesh.rotation.set(f*p.spin,f*(i%2?.3:-.4),f*.2*(i%3-1));}
  });
  item.dust.forEach(({cloud,index:i})=>{
   // Several staggered, round puffs occupy different depths and heights.
   // A fast initial lift gives way to slow buoyancy and a long, gentle fade.
   const age=fall-(.025+(i%8)*.055+Math.floor(i/8)*.12),life=4.3+(i%4)*.28,u=age/life;
   cloud.visible=age>0&&age<life;
   if(!cloud.visible){cloud.material.opacity=0;return;}
   const layer=Math.floor(i/8),inside=layer===0;
   const lift=1-Math.exp(-age*1.5);
   const z=-18+layer*12+lift*(24+layer*12)+age*(4+layer*2);
   const spread=7+layer*3+lift*10+age*2;
   cloud.position.set(Math.sin(i*2.4)*spread+Math.sin(age*.7+i)*3,Math.cos(i*1.7)*spread,z);
   const size=18+(i%4)*3+lift*14+age*3;
   cloud.scale.set(size,size*(1.02+(i%3)*.08),1);
   cloud.material.rotation=Math.sin(i*1.2)*.6+age*.07;
   const appear=smooth(0,.22,age),fade=1-smooth(.42,1,u);
   cloud.material.opacity=appear*fade*(inside?.48:.38);
   // Below the lip dust is seen only through the hole. Above it the cloud
   // can expand naturally over the terrain, with ordinary depth occlusion.
   cloud.material.stencilWrite=z<4;cloud.material.stencilWriteMask=0;cloud.material.stencilRef=1;cloud.material.stencilFunc=THREE.EqualStencilFunc;
  });
  item.nurbi.update(t,0,{active:false,travel:0,celebrationAge:-1,celebrationStyle:'gentle'});item.renderer.render(item.scene,item.camera);
 }
}requestAnimationFrame(tick);
