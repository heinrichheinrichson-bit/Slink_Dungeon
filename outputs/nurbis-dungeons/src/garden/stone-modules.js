import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {TessellateModifier} from 'three/addons/modifiers/TessellateModifier.js';

export const STONE_STYLES={
 reference:{name:'A · Grundform',description:'Die unbearbeitete Grundform als Vergleich.'},
 split:{name:'B · Feiner Felsriss',description:'Der Riss ist schmaler, heller und weniger tief.'},
 pebble:{name:'C · Findling · vorgemerkt',description:'Bereinigte Oberfläche: ruhiger Grundton, feine Quarzader, ohne wolkige Flecken.'},
 fossil:{name:'D · Blattstein',description:'Ein vertieftes vierblättriges Relief. Ruhiger Stein mit einem wiedererkennbaren Akzent.'},
 plain:{name:'E · Ruhiger Kiesel',description:'Dieselbe Findlingsform, ganz ohne Motiv. Nur eine feine mineralische Oberfläche.'},
 strata:{name:'F · Quarzlinien',description:'Zwei feine, geschwungene Mineraladern auf derselben ruhigen Findlingsform.'},
 dimples:{name:'G · Muldenstein',description:'Drei kleine, weich ausgeschliffene Mulden statt Linien oder Blättern.'},
 rosette:{name:'H · Steinblüte',description:'Eine kleine sechsblättrige Vertiefung. Dieselbe Findlingsform wie C, E, F und G.'}
};
const clamp=THREE.MathUtils.clamp;
function segment(x,y,a,b){const vx=b[0]-a[0],vy=b[1]-a[1],t=clamp(((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy),0,1);return Math.hypot(x-a[0]-vx*t,y-a[1]-vy*t)}
const fissures=[[[-24,22],[-8,10]],[[-8,10],[2,-4]],[[2,-4],[18,-14]],[[18,-14],[27,-25]],[[-8,10],[-22,-1]],[[2,-4],[19,7]]];
function detail(style,x,y){
 if(style==='split'){const d=Math.min(...fissures.map(([a,b])=>segment(x+Math.sin(y*.8)*.22,y+Math.sin(x*.7)*.2,a,b)));return {cut:.8*Math.exp(-d*d/.45),ink:.19*Math.exp(-d*d/.55),vein:0}}
 if(style==='fossil'||style==='rosette'){
  let leaf=0;const count=style==='rosette'?6:4;for(let k=0;k<count;k++){const a=.25+k*Math.PI*2/count,u=x*Math.cos(a)+y*Math.sin(a),v=-x*Math.sin(a)+y*Math.cos(a),r=((u-10)/8.5)**2+(v/(count===6?3.2:4.7))**2;leaf=Math.max(leaf,clamp((1-r)*2,0,1))}
  const stem=1.1*Math.exp(-(x*x+y*y)/8);return{cut:leaf*2.4+stem,ink:leaf*.3+stem*.14,vein:0};
 }
 if(style==='pebble'){const d=Math.abs(x*.48+y-5-Math.sin(x*.13)*3);return{cut:0,ink:0,vein:Math.exp(-d*d/2.5)*.7}}
 if(style==='strata'){const d=Math.min(Math.abs(y-x*.3-8-Math.sin(x*.09)*2),Math.abs(y-x*.3+9-Math.sin(x*.09+.5)*2));return{cut:0,ink:0,vein:Math.exp(-d*d/1.1)*.5}}
 if(style==='dimples'){let hollow=0;for(const [a,b,r]of [[-11,8,4.7],[10,5,3.8],[2,-12,5]]){const d=Math.hypot(x-a,y-b)/r;hollow=Math.max(hollow,Math.max(0,1-d*d)**2)}return{cut:hollow*2.3,ink:hollow*.18,vein:0}}
 return{cut:0,ink:0,vein:0};
}
/** Existing stone footprint: 66 x 66, bottom -6.5, nominal top 26.5, Z up.
 * Returns a reusable module with bounded geometry, material and explicit disposal. */
export function createStoneTile(style='fossil',{seed=73}={}){
 if(!STONE_STYLES[style])throw Error('Unknown stone style '+style);
 const rounded=['pebble','plain','strata','dimples','rosette'].includes(style);
 const group=new THREE.Group(),size=256,pixels=new Uint8Array(size*size*4),bumpPixels=new Uint8Array(size*size*4);
 let state=seed>>>0;const rng=()=>((state=(state*1664525+1013904223)>>>0)/4294967296);
 for(let j=0;j<size;j++)for(let i=0;i<size;i++){
  const x=(i/(size-1)-.5)*66,y=(j/(size-1)-.5)*66,d=detail(style,x,y),cloud=Math.sin(x*.18+y*.11)*Math.sin(y*.21-x*.07),grain=rng()-.5;
  let tone=1+cloud*(rounded?.004:.015)+grain*(rounded?.025:.065)-d.ink;
  const base=style==='split'?[151,143,128]:rounded?[158,150,136]:[153,145,130];
  const k=(j*size+i)*4;for(let c=0;c<3;c++)pixels[k+c]=clamp(base[c]*tone+(220-base[c])*d.vein,0,255);pixels[k+3]=255;
  const h=clamp(138+grain*(rounded?4:12)+cloud-d.cut*28,0,255);bumpPixels.set([h,h,h,255],k);
 }
 const texture=new THREE.DataTexture(pixels,size,size);texture.colorSpace=THREE.SRGBColorSpace;
 const bump=new THREE.DataTexture(bumpPixels,size,size);
 for(const t of [texture,bump]){t.magFilter=t.minFilter=THREE.LinearFilter;t.needsUpdate=true}
 const material=new THREE.MeshStandardMaterial({color:style==='reference'?'#928675':'#ffffff',roughness:.86,map:style==='reference'?null:texture,bumpMap:style==='reference'?null:bump,bumpScale:style==='fossil'||style==='rosette'?.5:rounded?.08:.2});
 // Decorative texture belongs to the upper face; clean sides avoid stretched UV streaks.
 if(style!=='reference')material.onBeforeCompile=shader=>{
  const base=new THREE.Color(rounded?'#9e9688':style==='split'?'#978f80':'#999182');
  shader.vertexShader='varying float stoneTop;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstoneTop=smoothstep(.25,.85,normal.z);');
  shader.fragmentShader='varying float stoneTop;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>\ndiffuseColor.rgb=mix(vec3(${base.r},${base.g},${base.b}),diffuseColor.rgb,stoneTop);`);
 };
 material.customProgramCacheKey=()=>`slink-stone-top-${style}`;
 let geometry=new RoundedBoxGeometry(66,66,33,style==='reference'?5:6,rounded?12:8);
 // RoundedBox subdivides the bevel, but leaves a broad central cap. Subdivide that
 // cap as well so the grooves and dome are actual geometry, not just a texture.
 if(style!=='reference'){const detailed=new TessellateModifier(3.5,10).modify(geometry);geometry.dispose();geometry=detailed}
 geometry.translate(0,0,10);
 const pos=geometry.attributes.position,uv=geometry.attributes.uv;
 for(let i=0;i<pos.count;i++){
  let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),weight=clamp((z-10)/16.5,0,1);
  if(style!=='reference'){
   const dome=Math.max(0,1-(x*x+y*y)/1800),irregular=Math.sin(x*.13+y*.035)*Math.cos(y*.1)*(rounded?.12:.7);
   const lift=rounded?dome*5:style==='split'?dome*1.3-Math.max(0,x*.17+y*.09-2)*.6:dome*.6;
   z+=(lift+irregular-detail(style,x,y).cut)*weight;
  }
  pos.setZ(i,z);uv.setXY(i,x/66+.5,y/66+.5);
 }
 geometry.deleteAttribute('normal');const welded=mergeVertices(geometry,1e-4);geometry.dispose();geometry=welded;geometry.computeVertexNormals();
 const stone=new THREE.Mesh(geometry,material);stone.castShadow=stone.receiveShadow=true;stone.userData.cell=-1;group.add(stone);group.userData={style,walkable:false,pitch:80};
 return{group,style,dispose(){geometry.dispose();material.dispose();texture.dispose();bump.dispose()}};
}
