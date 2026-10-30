from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig')
s=s.replace('piece.geometry.translate(0,-side*30,0);piece.geometry.computeBoundingBox();piece.position.y=side*30;', 'piece.geometry.computeBoundingBox();')
a=s.index(' const splinters=[];');b=s.index(' const dust=[];',a);s=s[:a]+s[b:]
s=s.replace('dust,splinters,fissures,foundation', 'dust,fissures,foundation')
a=s.index('  // Wood breaks open');b=s.index('  item.pieces.forEach',a)
s=s[:a]+'''  // Restore the first study's direct slide and free fall. Large broken
  // boards, rather than added splinter particles, carry the visible effect.
  item.stone.position.set(-72*(1-move),0,wood?woodStoneHeight(fall,stress):11-stress*2-220*fall*fall);
  item.stone.visible=fall<.85;item.stone.rotation.y=wood?0:fall*.4;
  item.stone.traverse(o=>{if(o.isMesh){o.material.stencilWrite=item.stone.position.z+36<5;o.material.stencilWriteMask=0;o.material.stencilRef=1;o.material.stencilFunc=THREE.EqualStencilFunc;}});
  item.foundation.visible=$('base').checked;item.fissures.visible=false;
  item.intact.visible=time<1.65;item.boards.forEach(b=>b.group.visible=true);item.intact.position.z=-stress*(wood?2.5:1);
  item.debris.visible=time>=1.65&&fall<1;item.stubs.visible=time>=1.65;
''' +s[b:]
s=s.replace('p.mesh.visible=time>=1.65+p.delay;positionWoodFragment(p,Math.max(0,fall-p.delay),item.stone.position.z-.6);','p.mesh.visible=true;p.index=i;positionWoodFragment(p,fall,item.stone.position.z-.6);')
a=s.index('  item.splinters.forEach');b=s.index('  item.dust.forEach',a);s=s[:a]+s[b:]
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/bruchbodenstudie.html');s=p.read_text(encoding='utf-8-sig').replace('<option value="near">Nahansicht</option><option value="all">Gesamte Szene</option>', '<option value="all">Gesamte Szene</option><option value="near">Nahansicht</option>').replace('<option value="0.5">Zeitlupe · ½</option><option value="1">Normal</option>', '<option value="1">Normal</option><option value="0.5">Zeitlupe · ½</option>');p.write_text(s,encoding='utf-8')
p=Path('work/check-break-motion.mjs');s=p.read_text(encoding='utf-8-sig').replace('g.translate(x,-side*16,3)','g.translate(x,side*15,3)');p.write_text(s,encoding='utf-8')
