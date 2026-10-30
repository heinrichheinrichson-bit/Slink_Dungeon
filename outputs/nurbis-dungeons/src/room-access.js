import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
export function createRoomAccess(parent,library,{type='passage',x=0,y=0,rotation=0,compact=false,posts=true}={}){
 const group=new THREE.Group();group.position.set(x,y,0);group.rotation.z=rotation;parent.add(group);
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.94});const stone=mat('#717765'),trim=mat('#aa9870');
 const block=(w,d,h,xx,yy,z,m=stone,r=4)=>{const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,d,h,4,r),m);mesh.position.set(xx,yy,z);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);return mesh;};
 for(let i=0;i<3;i++){const tile=library.stone(1,83+i*31,group,0,i*40,false,0);tile.scale.set(1.03,.64,.24);tile.position.z=-1;}
 if(type==='stairs'){
 for(let i=0;i<4;i++){const top=11+(i+1)*7;block(64,22,top-5,0,12+i*22,5+(top-5)/2,stone,2.5);}
 block(64,46,34,0,112,22,stone,3);
 for(const side of [-1,1]){block(14,100,18,side*42,45,20,stone,5);block(24,28,26,side*45,0,23,stone,5);}
 }else if(posts){
 const small=compact&&type==='passage',height=type==='tunnel'?74:small?14:26;
 for(const side of [-1,1]){block(small?6:22,small?16:34,height,side*(small?33:46),0,11+height/2,stone,small?2:6);block(small?6:27,small?18:39,small?4:8,side*(small?33:46),0,13,stone,small?1.5:4);if(type==='passage')block(small?5:12,small?12:18,small?2:3,side*(small?33:46),0,small?26:39,trim,1.2);}
 if(type==='tunnel'){
 const shape=new THREE.Shape();shape.moveTo(-58,0);shape.lineTo(-58,47);shape.bezierCurveTo(-58,111,58,111,58,47);shape.lineTo(58,0);shape.lineTo(35,0);shape.lineTo(35,47);shape.bezierCurveTo(35,82,-35,82,-35,47);shape.lineTo(-35,0);shape.closePath();
 const geo=new THREE.ExtrudeGeometry(shape,{depth:25,bevelEnabled:true,bevelThickness:2,bevelSize:2,bevelSegments:4,curveSegments:32});geo.rotateX(Math.PI/2);geo.translate(0,12.5,11);const arch=new THREE.Mesh(geo,stone);arch.castShadow=arch.receiveShadow=true;group.add(arch);
 }
 }
 return {group,heightAt(distance){if(type!=='stairs')return 11;let height=11;for(const edge of [1,23,45,67])height+=7*THREE.MathUtils.smoothstep(distance+20-edge+4,0,6);return height;}};
}
