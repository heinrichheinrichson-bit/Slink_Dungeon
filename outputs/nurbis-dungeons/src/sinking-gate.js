import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const materials={stone:new THREE.MeshStandardMaterial({color:'#777966',roughness:.94}),metal:new THREE.MeshStandardMaterial({color:'#5b685d',metalness:.42,roughness:.67}),edge:new THREE.MeshStandardMaterial({color:'#a19b79',metalness:.3,roughness:.7}),dark:new THREE.MeshStandardMaterial({color:'#303d32',roughness:.95})};
function block(parent,w,d,h,x,y,z,material,r=3){const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
export function createSinkingGate(parent,{compact=true}={}){const group=new THREE.Group();parent.add(group);
 // A 60-unit clear passage still fits the 58.96-unit movable stone.
 // The bearings occupy the remaining six units on each side of one cell.
 const w=compact?33:47;
 for(const side of [-1,1]){
  block(group,compact?6:23,compact?16:29,compact?16:25,side*w,0,compact?22:25,materials.stone,compact?2:6);
  block(group,compact?6:27,compact?18:33,compact?4:9,side*w,0,compact?15:16,materials.stone,compact?1.5:4);
  if(!compact)block(group,5,12,15,side*35,0,23,materials.metal,2);
  block(group,compact?5:12,compact?12:16,compact?2:4,side*w,0,compact?31:38,materials.edge,compact?1:2);
 }
 block(group,compact?60:68,compact?6:9,1,0,0,12.5,materials.dark,.4);
 for(const side of [-1,1])block(group,compact?60:69,compact?2:3,2,0,side*(compact?4:6),12.5,materials.stone,.8);
 const moving=new THREE.Group();group.add(moving);
 for(const x of (compact?[-24,-12,0,12,24]:[-27,-13.5,0,13.5,27]))block(moving,compact?4:6,compact?5:8,compact?32:62,x,0,compact?30:47,materials.metal,compact?1.8:2.8);
 for(const z of (compact?[16,32,48]:[17,46,79]))block(moving,compact?60:65,compact?6:11,compact?4:7,0,0,z,materials.edge,compact?1.8:3);
 // Only the physical portion above the ground is rendered, including shadows.
 moving.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,0,1),-13)];o.material.clipShadows=true;}});
 group.userData.openingWidth=compact?60:70;return {group,moving,set(value){moving.position.z=-value*(compact?40:76);}};
}
