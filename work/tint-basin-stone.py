from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/garden-basins.js');s=p.read_text(encoding='utf-8-sig');needle=' const group=new THREE.Group();'
s=s.replace(needle,""" // Keep Garden's sculpted geometry, but give the underground casting the
 // same quiet grey-green stone family as the dungeon modules.
 const tinted=new Set();frame.group.traverse(mesh=>{for(const material of [].concat(mesh.material||[])){if(tinted.has(material))continue;tinted.add(material);const compile=material.onBeforeCompile,cache=material.customProgramCacheKey.bind(material);material.onBeforeCompile=function(shader,...args){compile.call(this,shader,...args);shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb*=casting;','diffuseColor.rgb*=mix(vec3(.16,.19,.18),vec3(.32,.36,.32),shoulderTone)*(0.92+clouds*.12);');};material.customProgramCacheKey=()=>cache()+'-dungeon-stone-v1';material.needsUpdate=true;}});
"""+needle);p.write_text(s,encoding='utf-8')
