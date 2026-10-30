import assert from 'node:assert/strict';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {positionWoodFragment,woodStoneHeight,fragmentOverlapTop} from '../outputs/nurbis-dungeons/src/break-motion.js';
for(const side of [-1,1])for(const x of [-24,-8,8,24]){const g=new RoundedBoxGeometry(15,34,6,3,.5);g.translate(x,side*15,3);g.computeBoundingBox();const mesh=new THREE.Mesh(g),piece={mesh,z:5.5,side};for(let i=0;i<=1100;i++){const fall=i/1000,stoneZ=woodStoneHeight(fall);positionWoodFragment(piece,fall,stoneZ-.6);mesh.updateMatrix();const bounds=g.boundingBox.clone().applyMatrix4(mesh.matrix);assert(fragmentOverlapTop(mesh)<=stoneZ-.6+1e-8,'Intersecting plank surface must remain below the load');assert(Number.isFinite(bounds.min.z));}}console.log('PASS 8 beveled plank halves across 1101 fall poses: no overlap with stone underside.');
