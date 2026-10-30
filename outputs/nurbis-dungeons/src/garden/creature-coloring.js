import * as THREE from 'three';
// Fixed staggered rosettes with individual proportions, rotations and broken arcs.
const LEOPARD_ROSETTES=[];
for(let row=0;row<4;row++)for(let col=0;col<5;col++){
 const n=row*5+col,noise=Math.sin(n*13.13+2.1);
 LEOPARD_ROSETTES.push({u:(col-2)*5.5+(row%2)*1.8+noise*.75,v:4+row*7+Math.cos(n*7.7)*1.1,rx:1.85+(Math.sin(n*5.1)+1)*.38,ry:1.65+(Math.cos(n*4.3)+1)*.5,angle:noise*.8,phase:n*2.37,gap:.3+(Math.sin(n*3.7)+1)*.18});
}
// Head spots are anchored to directions on the head ellipsoid, not floating 3D points.
const LEOPARD_HEAD=[];
for(let row=0;row<4;row++)for(let col=0;col<8;col++){
 const n=row*8+col,a=col*Math.PI/4+(row%2)*.24+.07*Math.sin(n*4.7),e=.12+row*.36+.04*Math.cos(n*3.1);
 LEOPARD_HEAD.push({x:Math.cos(a)*Math.cos(e),y:Math.sin(a)*Math.cos(e),z:Math.sin(e),radius:.105+.045*(1+Math.sin(n*7.3))*.5});
}
// Three designed dorsal-to-flank marks, placed in body-relative angular coordinates.
const TIGER_BANDS=[[5.8,2.7,1.95,1.25],[15.8,2.25,-2.1,1.6],[25.1,1.9,1.15,1.38]];
export const FUR_PATTERNS=['solid','belly','saddle','stripes','tiger','leopard','spots','speckles','mask','tail'];
export function furPatternMask(p,x,y,z){
 const size=p.patternSize??1,strength=p.patternStrength??1,smooth=THREE.MathUtils.smoothstep;
 let amount=0;
 if(p.pattern==='belly'){const head=smooth(-y,11/size,19/size)*(1-smooth(z,18*size,23*size)),belly=(1-smooth(z,7*size,13*size))*smooth(y,-4,4);amount=Math.max(head,belly)*.82}
 if(p.pattern==='saddle')amount=(1-smooth(Math.abs(x),3*size,8*size))*smooth(y,-1,9)*smooth(z,9,17)*.85;
 if(p.pattern==='stripes')amount=(1-smooth(Math.abs(Math.sin((y-3)/ (3.3*size)+x*.025)),.3,.6))*smooth(y,-4,5)*smooth(z,5,12);
 if(p.pattern==='tiger'){
  const side=x<0?-1:1;
  // Follow the rounded body's upper surface; theta advances from spine to flank.
  const centerZ=9-4*smooth(y,12,29);
  const theta=Math.atan2(Math.abs(x),(z-centerZ)*1.12);
  for(let i=0;i<TIGER_BANDS.length;i++){
   const [center,width,bend,reach]=TIGER_BANDS[i];
   const end=reach+(side<0?[.15,-.12,.18][i]:0),u=theta/end;
   if(u>=1)continue;
   const drift=side<0?[-.15,.25,-.1][i]:0;
   const curve=center+drift*Math.sin(theta)+bend*(.2*u+.8*u*u);
   const half=width*size*Math.pow(1-u*u,.7);
   const edge=1-smooth(Math.abs(y-curve),half*.67,half);
   amount=Math.max(amount,edge*(1-smooth(u,.8,1)));
  }
  amount*=smooth(y,2,4)*smooth(z,5,9);
  // Short cheek sweeps and a compact forehead chevron, kept outside expression patches.
  const ax=Math.abs(x),front=1-smooth(y,-2,1);
  const cheekSide=smooth(ax,8.7,11)*(1-smooth(ax,14,16));
  const along=(y+15)/12,ends=smooth(along,0,.2)*(1-smooth(along,.78,1));
  let cheek=0;
  for(const height of [18.8,23.8]){
   const curve=height+.9*Math.sin(along*2.4)+(x<0?.2:0);
   const half=.8*size*(.5+.5*Math.sin(Math.max(0,Math.min(1,along))*Math.PI));
   cheek=Math.max(cheek,(1-smooth(Math.abs(z-curve),half*.5,half))*ends*cheekSide);
  }
  const browZ=30.2+ax*.4,forehead=(1-smooth(ax,3.2,4.6))*(1-smooth(Math.abs(z-browZ),.5*size,1.15*size))*(1-smooth(y,-9,-5));
  const muzzle=smooth((x/6.5)**2+((z-16.5)/3.8)**2,1,1.25);
  const eyeDistance=Math.min(((x-5.6)/5)**2+((z-23.4)/5.6)**2,((x+5.6)/5)**2+((z-23.4)/5.6)**2);
  const clearEyes=y<-10?smooth(eyeDistance,1,1.2):1;
  amount=Math.max(amount,Math.max(cheek,forehead)*front*muzzle*clearEyes*.9);

 }
 if(p.pattern==='leopard'){
  const centerZ=9-4*smooth(y,12,29),u=Math.atan2(x,(z-centerZ)*1.12)*9;
  if(y>0&&z>5){
   const scale=size*(1-.25*smooth(y,21,29));
   for(const spot of LEOPARD_ROSETTES){
    const dx=u-spot.u,dy=y-spot.v;
    if(Math.abs(dx)>spot.rx*scale*1.7||Math.abs(dy)>spot.ry*scale*1.7)continue;
    const c=Math.cos(spot.angle),s=Math.sin(spot.angle),a=(dx*c-dy*s)/(spot.rx*scale),b=(dx*s+dy*c)/(spot.ry*scale),theta=Math.atan2(b,a);
    const r=Math.hypot(a,b)/(1+.12*Math.sin(theta*3+spot.phase)+.065*Math.cos(theta*5-spot.phase));
    const ring=smooth(r,.51,.69)*(1-smooth(r,1,1.17));
    const opening=Math.abs(Math.atan2(Math.sin(theta-spot.phase),Math.cos(theta-spot.phase)));
    const broken=smooth(opening,spot.gap,spot.gap+.24);
    amount=Math.max(amount,Math.max(ring*broken,(1-smooth(r,.3,.62))*.12));
   }
   amount*=smooth(y,0,3)*smooth(z,5,9);
  }
  if(y<3&&z>12){
   let dots=0;const hx=x/13.1,hy=(y+8)/11.5,hz=(z-20)/12.2,length=Math.hypot(hx,hy,hz);
   if(length>.1)for(const spot of LEOPARD_HEAD){
    const distance=1-(hx*spot.x+hy*spot.y+hz*spot.z)/length,r=spot.radius*size;
    dots=Math.max(dots,1-smooth(distance,r*r*.2,r*r*.58));
   }
   const eyeDistance=Math.min(((x-5.6)/5)**2+((z-23.4)/5.6)**2,((x+5.6)/5)**2+((z-23.4)/5.6)**2);
   const eyes=y<-10?smooth(eyeDistance,1,1.2):1;
   const muzzle=smooth((x/6.5)**2+((z-16.5)/3.8)**2,1,1.25);
   amount=Math.max(amount,dots*eyes*muzzle*(1-smooth(y,1,3)));
  }
 }
 if(p.pattern==='spots'||p.pattern==='speckles'){
  const fine=p.pattern==='speckles',spacing=fine?5.2:11,radius=(fine?1.25:3.8)*size;
  // Stable staggered patches projected onto the coat; no random redraw or moving markings.
  const row=Math.round(y/spacing),cx=Math.round((x-(row%2)*spacing*.5)/spacing)*spacing+(row%2)*spacing*.5;
  const cy=row*spacing+Math.sin(row*2.7+cx)*spacing*.12;
  const distance=Math.hypot(x-cx,y-cy);
  amount=(1-smooth(distance,radius*.5,radius))*smooth(y,-5,3)*smooth(z,6,13);
 }
 if(p.pattern==='mask')amount=smooth(-y,11,16)*(1-smooth(Math.abs(x),8*size,13*size))*smooth(z,15,21);
 if(p.pattern==='tail')amount=smooth(y,31-7*size,34-3*size);
 return Math.max(0,Math.min(1,amount*strength));
}
export function createCreatureColoring(model,weights){
 const fur=model.group.getObjectByName('curved-soft-fur'),geometry=fur.geometry,original=geometry.attributes.color.array,base=new THREE.Color('#d5a078'),tip=new THREE.Color('#ffe2b9'),blends=weights||new Float32Array(original.length/3),bodies=[],paws=[],materials={};
 if(!weights)for(let i=0;i<blends.length;i++)blends[i]=(original[i*3]-base.r)/(tip.r-base.r);
 model.group.traverse(o=>{if(!o.isMesh)return;const hex='#'+o.material.color.getHexString();if(hex==='#dfa578')materials.coat=o.material;if(hex==='#428f8d')materials.iris=o.material;if(hex==='#ffe5bd')materials.face=o.material;if(hex==='#e69b88')materials.cheeks=o.material;if(o.parent.name==='soft-curved-antenna'&&hex==='#ffe5bd'){o.material=o.material.clone();materials.antenna=o.material}if(o.name==='original-body-part'){o.material=o.material.clone();o.material.color.set('#ffffff');o.material.vertexColors=true;o.geometry.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(o.geometry.attributes.position.count*3),3));bodies.push(o)}});
 // Each antenna has its own tip material; collect both without touching shared game palettes.
 model.group.traverse(o=>{if(o.isMesh&&o.parent.name==='soft-paw'){o.material=o.material.clone();paws.push(o.material)}});
 const antennaTips=[];model.group.traverse(o=>{if(o.isMesh&&o.parent.name==='soft-curved-antenna'&&o.material!==materials.coat)antennaTips.push(o.material)});
 function apply(p){paws.forEach(m=>m.color.set(p.paws||p.coat));for(const k of ['coat','iris','face','cheeks'])materials[k].color.set(p[k]);antennaTips.forEach(m=>m.color.set(p.antenna));const hasPattern=p.pattern!=='solid',root=new THREE.Color(p.root),tip=new THREE.Color(p.tip),accent=new THREE.Color(p.accent),coat=new THREE.Color(p.coat),color=new THREE.Color(),position=geometry.attributes.position,attribute=geometry.attributes.color;for(let i=0;i<position.count;i++){color.copy(root).lerp(tip,blends[i]);if(hasPattern)color.lerp(accent,furPatternMask(p,position.getX(i),position.getY(i),position.getZ(i)));attribute.setXYZ(i,color.r,color.g,color.b)}attribute.needsUpdate=true;for(const body of bodies){const pos=body.geometry.attributes.position,col=body.geometry.attributes.color;for(let i=0;i<pos.count;i++){color.copy(coat);if(hasPattern)color.lerp(accent,furPatternMask(p,pos.getX(i)*body.scale.x+body.position.x,pos.getY(i)*body.scale.y+body.position.y,pos.getZ(i)*body.scale.z+body.position.z));col.setXYZ(i,color.r,color.g,color.b)}col.needsUpdate=true}}
 return {...model,apply};
}
