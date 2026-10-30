from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig')
s=s.replace('pieces.push({mesh:piece,z:5.5,spin:side*(.8+b*.17),drift:(b-1.5)*5});','piece.geometry.translate(0,-side*30,0);piece.geometry.computeBoundingBox();piece.position.y=side*30;pieces.push({mesh:piece,z:5.5,side,spin:side*(.8+b*.17),drift:(b-1.5)*5});')
a=s.index('  const move=smooth');b=s.index('  item.dust.forEach',a)
s=s[:a]+'''  const move=smooth(0,1.25,time),stress=smooth(1.25,1.65,time),fall=Math.max(0,time-1.65),wood=item.type==='wood';
  // Wood breaks open before the load starts its vertical drop. It cannot
  // overtake the faster falling plank halves or rotate through them.
  const stoneFall=wood?Math.max(0,fall-.12):fall;
  item.stone.position.set(-72*(1-move),0,11-stress*2-220*stoneFall*stoneFall);item.stone.visible=fall<(wood?1:.85);item.stone.rotation.y=wood?0:fall*.4;
  item.intact.visible=time<1.65;item.intact.position.z=-stress*(wood?2.5:1);item.debris.visible=time>=1.65&&fall<(wood?1.1:1);item.stubs.visible=time>=1.65;
  item.pieces.forEach((p,i)=>{
   if(wood){
    const f=fall,free=Math.max(0,f-.12);
    p.mesh.position.set(0,p.side*30,p.z-2-14*f-320*free*free);
    p.mesh.rotation.set(p.side*(smooth(0,.18,f)*.95+f*.7),0,0);
    // Enforce separation for the complete transformed fragment, including
    // bevels. No plank vertex may rise into the underside of the stone.
    p.mesh.updateMatrix();const bounds=p.mesh.geometry.boundingBox.clone().applyMatrix4(p.mesh.matrix);
    const ceiling=item.stone.position.z-.6;
    if(bounds.max.z>ceiling)p.mesh.position.z-=bounds.max.z-ceiling;
   }else{const f=Math.max(0,fall-(i%3)*.025);p.mesh.position.set(p.drift*f,Math.sin(i*2)*f*9,p.z-2-170*f*f);p.mesh.rotation.set(f*p.spin,f*(i%2?.3:-.4),f*.2*(i%3-1));}
  });
''' +s[b:];p.write_text(s,encoding='utf-8')
