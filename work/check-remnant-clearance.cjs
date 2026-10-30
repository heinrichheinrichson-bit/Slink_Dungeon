const fs=require('fs'),vm=require('vm');
const THREE=require('C:/Users/heinr/Documents/Codex/2026-10-12/k/outputs/Slink/node_modules/three');
const source=fs.readFileSync('outputs/nurbis-dungeons/src/break-study.js','utf8');
const fragment=source.slice(source.indexOf('function fragment('),source.indexOf('// Soft, irregular dust'));
const block=source.slice(source.indexOf(' const stubs=new'),source.indexOf(' const dust=[]'));
for(const type of ['wood','stone']){
 const root=new THREE.Group(),intact=new THREE.Group();intact.add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial()));
 vm.runInNewContext(fragment+block,{THREE,type,root,intact,woodMaterial:()=>new THREE.MeshStandardMaterial(),mat:()=>new THREE.MeshStandardMaterial()});
 root.updateMatrixWorld(true);let gap=Infinity,count=0;
 root.traverse(o=>{if(!o.isMesh)return;count++;const b=new THREE.Box3().setFromObject(o);const dx=Math.max(b.min.x-29.48,-29.48-b.max.x),dy=Math.max(b.min.y-28.16,-28.16-b.max.y);const clearance=Math.max(dx,dy);if(clearance<.5)throw Error(type+' obstructs fall path: '+clearance);gap=Math.min(gap,clearance);});
 console.log(type+': '+count+' remnants, minimum clearance '+gap.toFixed(2)+' units (including bevel).');
}
