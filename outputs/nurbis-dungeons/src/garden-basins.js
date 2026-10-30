import * as THREE from 'three';
import {createIvoryFrame} from './garden/ivory-frame.js';
import {createLivingLiquid} from './garden/living-liquid.js';
// Reuse Garden's connected sculpted basin and original water/lava shaders.
export function createGardenBasins({map,liquidType='water',initialOff=false,mount='original'}){
 const n=map[0].length,h=map.length,pitch=72,cells=[],upper=[],lower=[];
 map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='U'||c==='W'){const i=y*n+x;cells.push(i);(c==='U'?upper:lower).push(i);}}));
 const frame=createIvoryFrame({n,cells,water:liquidType==='water'?cells:[],lava:liquidType==='lava'?cells:[],style:'soft',pitch,specOverride:mount==='flush'?{outer:-3,bevel:2,inset:7,corner:16}:{}});
 // Keep Garden's sculpted geometry, but give the underground casting the
 // same quiet grey-green stone family as the dungeon modules.
 const tinted=new Set();frame.group.traverse(mesh=>{for(const material of [].concat(mesh.material||[])){if(tinted.has(material))continue;tinted.add(material);const compile=material.onBeforeCompile,cache=material.customProgramCacheKey.bind(material);material.onBeforeCompile=function(shader,...args){compile.call(this,shader,...args);shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb*=casting;','diffuseColor.rgb*=mix(vec3(.065,.085,.09),vec3(.14,.20,.22),shoulderTone)*(0.92+clouds*.12);');};material.customProgramCacheKey=()=>cache()+'-dungeon-stone-v1';material.needsUpdate=true;}});
 const group=new THREE.Group();group.position.set(-n*pitch/2,h*pitch/2,8-frame.spec.bevel);if(mount!=='neighbors')group.add(frame.group);
 const basins=frame.openings.map(opening=>{
  const first=opening.cells[0],kind=upper.includes(first)?'U':'W',liquid=createLivingLiquid(liquidType,{style:liquidType==='water'?'sway':'bubbles',center:[first%n*pitch+pitch/2,-(Math.floor(first/n)*pitch+pitch/2)]});
  const bed=new THREE.Mesh(new THREE.ShapeGeometry(opening.shape,24),new THREE.MeshStandardMaterial({color:'#6a756a',roughness:1}));bed.position.z=-23;bed.receiveShadow=true;group.add(bed);
  const water=new THREE.Mesh(new THREE.ExtrudeGeometry(opening.shape,{depth:1,bevelEnabled:false,curveSegments:24}),liquid.material);water.position.z=9-group.position.z;water.receiveShadow=true;water.castShadow=false;group.add(water);
  const level=Number(kind==='U'?!initialOff:initialOff);water.visible=level>0;
  return {kind,liquid,water,level,fullZ:9-group.position.z};
 });
 return {group,update(off,time,dt){for(const basin of basins){const target=Number(basin.kind==='U'?!off:off);basin.level+=(target-basin.level)*Math.min(1,dt*10);basin.water.visible=basin.level>.015;basin.water.position.z=-24+basin.level*(basin.fullZ+24);basin.liquid.update(time);}},dispose(){for(const b of basins)b.liquid.dispose();}};
}

