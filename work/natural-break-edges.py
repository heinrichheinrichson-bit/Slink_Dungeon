from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig');a=s.index(' // Broken stubs remain');b=s.index(' const dust=[];',a)
s=s[:a]+''' // Remnants grow out of the original deck edges, not a repeated row of pegs.
 const stubs=new THREE.Group();root.add(stubs);
 if(type==='wood'){
  const lengths=[[4.2,8.6,5.1,7.3],[7.4,3.8,9.2,4.7]];
  for(const [si,side]of [-1,1].entries())for(let b=0;b<4;b++){
   const x=-24+b*16,length=lengths[si][b],outer=30;
   const edge=[[-7,outer],[-7,outer-length+.6],[-4.8,outer-length-1.3],[-2.1,outer-length+.9],[.2,outer-length-2.1],[2.4,outer-length+.5],[4.7,outer-length-.7],[7,outer-length+1.4],[7,outer]];
   const points=edge.map(([dx,y])=>[x+dx,side*y]);
   const stub=fragment(stubs,points,[woodMaterial(441+b*137),mat('#937a56')],4.8);
   stub.position.z=5.4;stub.rotation.x=side*[.012,-.025,.018,-.01][(b+si)%4];
  }
 }else{
  let rock;intact.traverse(o=>{if(o.isMesh&&!rock)rock=o.material;});
  const patches=[
   [[-35,18],[-29,19],[-27,24],[-30,26],[-27,30],[-35,33]],
   [[3,33],[4,28],[9,26],[12,28],[15,27],[18,33]],
   [[-25,-33],[-23,-28],[-19,-29],[-16,-25],[-12,-28],[-10,-33]],
   [[35,-13],[29,-12],[28,-8],[31,-5],[28,-1],[35,2]]
  ];
  patches.forEach((points,i)=>{const chip=fragment(stubs,points,rock.clone(),3.4+(i%2)*1.1);chip.position.z=4.1+(i%3)*.25;chip.rotation.x=(i%2?1:-1)*.035;});
 }
''' +s[b:];p.write_text(s,encoding='utf-8')
