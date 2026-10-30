import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createIvoryFrame} from '../outputs/nurbis-dungeons/src/garden/ivory-frame.js';
const f=createIvoryFrame({n:5,cells:[11,12,13],water:[11,12,13],pitch:72,style:'soft',specOverride:{outer:-3,bevel:2,inset:7,corner:16}});const b=new THREE.Box3().setFromObject(f.group);assert(b.min.x>=72&&b.max.x<=288);assert(b.min.y>=-216&&b.max.y<=-144);console.log('PASS flush basin geometry stays inside its three reserved module cells.');
