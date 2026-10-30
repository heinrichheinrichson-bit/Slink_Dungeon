import * as THREE from 'three';
export function createDungeonFoundation(){
 const footprint=new THREE.Shape(),r=11,lo=-112,hi=112;
 footprint.moveTo(lo+r,lo);footprint.lineTo(hi-r,lo);footprint.quadraticCurveTo(hi,lo,hi,lo+r);footprint.lineTo(hi,hi-r);footprint.quadraticCurveTo(hi,hi,hi-r,hi);footprint.lineTo(lo+r,hi);footprint.quadraticCurveTo(lo,hi,lo,hi-r);footprint.lineTo(lo,lo+r);footprint.quadraticCurveTo(lo,lo,lo+r,lo);
 const shaft=new THREE.Path(),x=33,y=31,c=7;
 shaft.moveTo(-x,-y+c);shaft.lineTo(-x,y-c);shaft.quadraticCurveTo(-x,y,-x+c,y);shaft.lineTo(x-c,y);shaft.quadraticCurveTo(x,y,x,y-c);shaft.lineTo(x,-y+c);shaft.quadraticCurveTo(x,-y,x-c,-y);shaft.lineTo(-x+c,-y);shaft.quadraticCurveTo(-x,-y,-x,-y+c);shaft.closePath();footprint.holes.push(shaft);
 // Garden-like carrier thickness; the shaft depth is rendered independently.
 const geometry=new THREE.ExtrudeGeometry(footprint,{depth:22,bevelEnabled:true,bevelSize:2,bevelThickness:2,bevelSegments:5,curveSegments:24});geometry.translate(0,0,-20);
 const material=color=>new THREE.MeshStandardMaterial({color,roughness:.94});
 const body=new THREE.Mesh(geometry,[material('#515340'),material('#343c30')]);body.receiveShadow=body.castShadow=true;body.userData.shaftOpening=new THREE.Shape(shaft.getPoints(24));return body;
}
