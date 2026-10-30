import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createDungeonFoundation} from '../outputs/nurbis-dungeons/src/dungeon-foundation.js';
const base=createDungeonFoundation();base.updateMatrixWorld(true);const ray=new THREE.Raycaster();
for(const [x,y]of [[36,0],[-36,0],[0,36],[0,-36],[36,36],[-36,-36]]){ray.set(new THREE.Vector3(x,y,50),new THREE.Vector3(0,0,-1));assert(ray.intersectObject(base).length>0,'Module seam must have solid ground below it');}
for(const [x,y]of [[0,0],[20,10],[-20,-10]]){ray.set(new THREE.Vector3(x,y,50),new THREE.Vector3(0,0,-1));assert.equal(ray.intersectObject(base).length,0,'Shaft must be a real opening');}
console.log('PASS closed terrain beneath module seams and open shaft without covering faces.');
