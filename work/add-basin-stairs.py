from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/basin-mount-study.js');s=p.read_text(encoding='utf-8-sig');s="import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';\n"+s
needle="item.model=model;item.root.add(model.group);"
s=s.replace(needle,needle+"""
 if(item.mount==='flush'&&$('stairs').checked){
   const bed=-17,stone=new THREE.MeshStandardMaterial({color:'#737e72',roughness:.94});
   for(const side of [-1,1])for(let step=0;step<4;step++){
     const top=4-step*7,depth=14,x=side*(101-step*14-depth/2),h=top-bed;
     if(h<=0)continue;
     const tread=new THREE.Mesh(new RoundedBoxGeometry(depth,45,h,3,1),stone);tread.position.set(x,0,bed+h/2);tread.castShadow=tread.receiveShadow=true;item.root.add(tread);
   }
 }
""")
s=s.replace("$('liquid').onchange=rebuild;", "$('stairs').onchange=rebuild;$('liquid').onchange=rebuild;")
s=s.replace('const {x,z}=basinTraversal(progress,item.mount);', 'const {x,z}=basinTraversal(progress,item.mount,item.mount===\'flush\'&&$(\'stairs\').checked);')
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/src/basin-traversal.js');s=p.read_text(encoding='utf-8-sig').replace("mount='flush'){", "mount='flush',stairs=false){")
s=s.replace(' let z;',''' let z;
 if(stairs&&mount==='flush'){
   // Highest support beneath Nurbi's full silhouette; rise before overlapping
   // each riser, descend only once the trailing body has cleared it.
   const support=Math.abs(x)+clearance;
   z=bed;
   for(const [edge,height] of [[45,7],[59,7],[73,7],[87,7],[101,0]])z+=height*smooth((support-(edge-4))/4);
   // Bed -16, last tread -10, middle -3, upper 4, shore 11.
   z=Math.min(11,z);
   return {x,z,bed,innerEdge,clearance};
 }
''')
# Tread tops 4,-3,-10; fourth lands on bed. Four 7-ish rises, precise top matching.
s=s.replace('[[45,7],[59,7],[73,7],[87,7],[101,0]]','[[59,7],[73,7],[87,7],[101,6]]')
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/becken-einbaustudie.html');s=p.read_text(encoding='utf-8-sig').replace('<button id="walk">','<label class="stairs-option"><input id="stairs" type="checkbox" checked> Variante 1 · kleine Steintreppe</label><button id="walk">').replace('A · BEVORZUGTE VARIANTE','A · BEVORZUGT · TREPPE TESTEN');s=s.replace('</style>','.stairs-option{display:flex!important;align-items:center;gap:9px;flex:0 0 100%!important}.stairs-option input{width:20px!important;min-height:20px!important;accent-color:#c8bd91}</style>');p.write_text(s,encoding='utf-8')
