import * as THREE from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
export const IVORY_STYLES={
 current:{name:'A · Schlanker Vergleich',outer:8,inset:6,corner:10,bevel:5,depth:22},
 soft:{name:'B · Modelliertes Elfenbein',outer:11,inset:6,corner:23,bevel:5,depth:26},
 plush:{name:'C · Warmer Formguss',outer:13,inset:6,corner:27,bevel:5,depth:28}
};
const adjacent=(i,n)=>[i-n,i+n,i%n?i-1:-1,i%n<n-1?i+1:-1].filter(j=>j>=0&&j<n*n);
function groups(cells,n){let left=new Set(cells),result=[];while(left.size){let q=[left.values().next().value];left.delete(q[0]);for(let k=0;k<q.length;k++)for(let j of adjacent(q[k],n))if(left.delete(j))q.push(j);result.push(q)}return result}
function loops(cells,n,pitch){let set=new Set(cells),edges=[];const has=(x,y)=>x>=0&&x<n&&y>=0&&y<n&&set.has(y*n+x);for(let i of set){let x=i%n,y=i/n|0,a=x*pitch,b=y*pitch;if(!has(x,y-1))edges.push([[a,b],[a+pitch,b]]);if(!has(x+1,y))edges.push([[a+pitch,b],[a+pitch,b+pitch]]);if(!has(x,y+1))edges.push([[a+pitch,b+pitch],[a,b+pitch]]);if(!has(x-1,y))edges.push([[a,b+pitch],[a,b]])}let result=[];while(edges.length){let edge=edges.shift(),start=edge[0],at=edge[1],previous=start,points=[start];while(at[0]!==start[0]||at[1]!==start[1]){points.push(at);let options=[];for(let k=0;k<edges.length;k++)if(edges[k][0][0]===at[0]&&edges[k][0][1]===at[1]){let dx=at[0]-previous[0],dy=at[1]-previous[1],vx=edges[k][1][0]-at[0],vy=edges[k][1][1]-at[1],cross=dx*vy-dy*vx,dot=dx*vx+dy*vy;options.push({k,rank:cross>0?0:dot>0?1:cross<0?2:3})}if(!options.length)throw Error('Open frame contour');options.sort((a,b)=>a.rank-b.rank);previous=at;at=edges.splice(options[0].k,1)[0][1]}points=points.filter((b,k)=>{let a=points[(k+points.length-1)%points.length],c=points[(k+1)%points.length];return!(a[0]===b[0]&&b[0]===c[0]||a[1]===b[1]&&b[1]===c[1])});result.push(points.map(([x,y])=>new THREE.Vector2(x,-y)))}return result.sort((a,b)=>Math.abs(THREE.ShapeUtils.area(b))-Math.abs(THREE.ShapeUtils.area(a)))}
function shifted(points,d){let sign=THREE.ShapeUtils.area(points)>0?1:-1;return points.map((p,k)=>{let a=points[(k+points.length-1)%points.length],b=points[(k+1)%points.length],u=p.clone().sub(a).normalize(),v=b.clone().sub(p).normalize(),normal=new THREE.Vector2(u.y,-u.x).add(new THREE.Vector2(v.y,-v.x)).multiplyScalar(sign).normalize();let one=new THREE.Vector2(u.y,-u.x).multiplyScalar(sign);return p.clone().add(normal.multiplyScalar(d/Math.max(.25,normal.dot(one))))})}
function rounded(points,r){let path=new THREE.Shape();points.forEach((p,k)=>{let a=points[(k+points.length-1)%points.length],b=points[(k+1)%points.length],radius=Math.min(r,p.distanceTo(a)*.45,p.distanceTo(b)*.45),u=p.clone().add(a.clone().sub(p).normalize().multiplyScalar(radius)),v=p.clone().add(b.clone().sub(p).normalize().multiplyScalar(radius));if(k)path.lineTo(u.x,u.y);else path.moveTo(u.x,u.y);path.quadraticCurveTo(p.x,p.y,v.x,v.y)});path.closePath();return path}
// One continuous material across cap, shoulder and walls; no colour seam at the bevel.
function sculptedMaterial(material,spec,style,pits){
 material.color.set('#ffffff');
 material.onBeforeCompile=shader=>{
 shader.uniforms.ivoryPits={value:pits};
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 ivoryPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nivoryPosition = position;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
 varying vec3 ivoryPosition;
 ${pits.length?`uniform vec4 ivoryPits[${pits.length}];`:''}
 float ivoryNoise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float ivorySoftNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(ivoryNoise(i),ivoryNoise(i+vec2(1,0)),f.x),mix(ivoryNoise(i+vec2(0,1)),ivoryNoise(i+vec2(1,1)),f.x),f.y);}
 `).replace('#include <color_fragment>',`#include <color_fragment>
 float heightTone=smoothstep(${-spec.depth-spec.bevel}.0, 3.0, ivoryPosition.z);
 float shoulderTone=smoothstep(${-spec.bevel+3}.0, 3.0, ivoryPosition.z);
 vec3 warmBase=mix(vec3(0.62,0.44,0.26),vec3(0.82,0.67,0.46),heightTone);
 vec3 ivoryTop=${style==='plush'?'vec3(0.92,0.79,0.58)':'vec3(0.95,0.84,0.65)'};
 vec3 casting=mix(warmBase,ivoryTop,shoulderTone);
 float pitDistance=10000.0;
 ${pits.length?`for(int i=0;i<${pits.length};i++){vec2 q=abs(ivoryPosition.xy-ivoryPits[i].xy)-ivoryPits[i].zw+vec2(12.0);float d=length(max(q,0.0))+min(max(q.x,q.y),0.0)-12.0;pitDistance=min(pitDistance,d);}`:''}
 float recess=(1.0-smoothstep(-2.0,17.0,pitDistance))*shoulderTone;
 casting=mix(casting,vec3(.72,.55,.33),recess*.25);
 float clouds=ivorySoftNoise(ivoryPosition.xy*.035)*.65+ivorySoftNoise(ivoryPosition.xy*.12)*.35;
 casting*=mix(.92,1.04,clouds);
 float pores=ivorySoftNoise(ivoryPosition.xy*1.8);
 casting*=1.0-${style==='plush'?'.075':'.045'}*pores;
 diffuseColor.rgb*=casting;
 `);
 };
 material.customProgramCacheKey=()=>`ivory-casting-${style}-${spec.depth}-${spec.bevel}-${pits.length}`;
}
/** Z-up. Cell pitch 80; centres at (x*80+40,-y*80-40).
 * One connected cream body per occupied component. No ribs between walkable cells.
 * Same-type adjacent liquid cells share one opening, including at the outer rim.
 * Returns matching liquid shapes so the renderer cannot leave seams at the rim. */
export function createIvoryFrame({n,cells,water=[],lava=[],stones=[],style='soft',pitch=80,specOverride={}}={}){
 const baseSpec=IVORY_STYLES[style];if(!baseSpec)throw Error('Unknown ivory style');const spec={...baseSpec,...specOverride};let occupied=new Set(cells);if(!Number.isInteger(n)||n<1||!cells.length||cells.some(i=>!Number.isInteger(i)||i<0||i>=n*n))throw Error('Invalid frame cells');let hazards=[...water,...lava,...stones];if(new Set(hazards).size!==hazards.length||hazards.some(i=>!occupied.has(i)))throw Error('Invalid obstacle cells');
 const grain=new Uint8Array(128*128*4);let seed=375;for(let i=0;i<128*128;i++){seed=(seed*1664525+1013904223)>>>0;let v=110+(seed>>>24)*.16;grain.set([v,v,v,255],i*4)}
 const texture=new THREE.DataTexture(grain,128,128);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=texture.minFilter=THREE.LinearFilter;texture.needsUpdate=true;
 let group=new THREE.Group(),openings=[],geometries=[],top=new THREE.MeshStandardMaterial({color:style==='plush'?'#f3dcb3':'#f7e5c3',roughness:.88,bumpMap:texture,bumpScale:style==='current'?.12:.65}),side=new THREE.MeshStandardMaterial({color:'#d4ad7d',roughness:.9,bumpMap:texture,bumpScale:.45});
 if(style!=='current'){const pits=hazards.map(i=>new THREE.Vector4(i%n*pitch+pitch/2,-(Math.floor(i/n)*pitch+pitch/2),pitch/2-spec.inset,pitch/2-spec.inset));sculptedMaterial(top,spec,style,pits);sculptedMaterial(side,spec,style,pits)}
 // Hole contours must oppose the clockwise outer contour; otherwise inner walls face away.
 for(let component of groups(cells,n)){let set=new Set(component),outlines=loops(component,n,pitch),islands=[],shape=rounded(shifted(outlines[0],spec.outer),spec.corner);for(let hole of outlines.slice(1))shape.holes.push(rounded(shifted(hole,-spec.outer),spec.corner));for(let [type,items]of [['water',water],['lava',lava]])for(let part of groups(items.filter(i=>set.has(i)),n)){let contours=loops(part,n,pitch),opening=rounded(shifted(contours[0],-spec.inset).reverse(),16);shape.holes.push(opening);for(let inner of contours.slice(1)){islands.push(rounded(shifted(inner,spec.inset),16))}let liquidShape=rounded(shifted(contours[0],-spec.inset+spec.bevel),16+spec.bevel);for(let inner of contours.slice(1))liquidShape.holes.push(rounded(shifted(inner,spec.inset-spec.bevel),16+spec.bevel));openings.push({type,cells:part,shape:liquidShape,rimShape:opening,surfaceZ:-20})}
 for(let bodyShape of [shape,...islands]){
 let geometry=new THREE.ExtrudeGeometry(bodyShape,{depth:spec.depth,bevelEnabled:true,bevelThickness:spec.bevel,bevelSize:spec.bevel,bevelSegments:16,curveSegments:24,steps:1});
 geometry.translate(0,0,-spec.depth-spec.bevel+3);
 const pos=geometry.attributes.position,uv=geometry.attributes.uv;
 for(let i=0;i<pos.count;i++){
 const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
 // The entire casting shares a gently irregular shoulder; no separate raised rail.
 const wave=style==='current'?0:(Math.sin(x*.043+y*.017)*.55+Math.sin(y*.067-x*.023)*.38);
 pos.setZ(i,z+wave);uv.setXY(i,x/90,y/90);
 }
 // Weld normals across the many bevel rings, without separate tube seams.
 geometry.deleteAttribute('normal');let welded=mergeVertices(geometry,1e-3);geometry.dispose();geometry=welded;geometry.computeVertexNormals();
 geometries.push(geometry);let body=new THREE.Mesh(geometry,[top,side]);body.castShadow=body.receiveShadow=true;group.add(body)
 }}
 const blocked=new Set(hazards),walkableShapes=groups(cells.filter(i=>!blocked.has(i)),n).map(part=>{let contours=loops(part,n,pitch),shape=rounded(contours[0],10);for(let hole of contours.slice(1))shape.holes.push(rounded(hole,10));return shape});group.userData={style,pitch,walkable:false,spec:{...spec}};return{group,openings,walkableShapes,spec,dispose(){geometries.forEach(g=>g.dispose());top.dispose();side.dispose();texture.dispose()}};
}
