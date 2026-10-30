// Maximum fragment height only where it overlaps the upright stone footprint.
// Outer broken ends may remain visible beside the load rather than being
// pushed down merely because their bounding box rises next to the stone.
export function fragmentOverlapTop(mesh,bounds={minX:-29.5,maxX:29.5,minY:-28.2,maxY:28.2}){
 const geometry=mesh.geometry,p=geometry.attributes.position,idx=geometry.index,m=mesh.matrix.elements;
 const point=i=>{const x=p.getX(i),y=p.getY(i),z=p.getZ(i);return [m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]];};
 const clip=(poly,axis,bound,greater)=>{const out=[];if(!poly.length)return out;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],insideA=greater?a[axis]>=bound:a[axis]<=bound,insideB=greater?b[axis]>=bound:b[axis]<=bound;if(insideA)out.push(a);if(insideA!==insideB){const t=(bound-a[axis])/(b[axis]-a[axis]);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}return out;};
 let top=-Infinity;const count=idx?idx.count:p.count;
 for(let i=0;i<count;i+=3){let poly=[0,1,2].map(j=>point(idx?idx.getX(i+j):i+j));for(const [axis,bound,greater]of [[0,bounds.minX,true],[0,bounds.maxX,false],[1,bounds.minY,true],[1,bounds.maxY,false]])poly=clip(poly,axis,bound,greater);for(const v of poly)top=Math.max(top,v[2]);}
 return top;
}
export function positionWoodFragment(piece,fall,ceiling){
 const f=Math.max(0,fall),index=piece.index??0,spin=piece.spin??piece.side*.8,drift=piece.drift??0;
 piece.mesh.position.set(drift*f,Math.sin(index*2)*f*9,piece.z-2-320*f*f);
 piece.mesh.rotation.set(f*spin,f*(index%2?.3:-.4),f*.2*(index%3-1));piece.mesh.updateMatrix();
 const bounds=piece.mesh.geometry.boundingBox.clone().applyMatrix4(piece.mesh.matrix);
 if(bounds.max.z>ceiling){const top=fragmentOverlapTop(piece.mesh);if(top>ceiling)piece.mesh.position.z-=top-ceiling;}
}
export function woodStoneHeight(fall,stress=1){return 11-stress*2-220*Math.max(0,fall)**2;}
