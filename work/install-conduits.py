from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/steam-rig.js');s=p.read_text(encoding='utf-8-sig');s="import {conduitRoute} from './conduit-route.js';\n"+s
s=s.replace('leverMode=false})','leverMode=false,levelMap=[]})')
a=s.index(' // Short embedded supply pipe');b=s.index(' const wheel=',a)
s=s[:a]+''' // Recessed rigid conduits: centered on cells, shortest route beneath walls.
 const pipeMat=mat('#887a5c');
 function conduit(start,end){
  const cells=conduitRoute(start,end,levelMap),corners=[cells[0]];
  for(let i=1;i<cells.length-1;i++){const a=cells[i-1],b=cells[i],c=cells[i+1];if(b[0]-a[0]!==c[0]-b[0]||b[1]-a[1]!==c[1]-b[1])corners.push(b);}
  if(cells.length<2)return;corners.push(cells.at(-1));
  const points=corners.map(c=>new THREE.Vector3(...xy(c),10.2)),path=new THREE.CurvePath();let previous=points[0];
  for(let i=1;i<points.length-1;i++){
   const center=points[i],r=Math.min(8,center.distanceTo(previous)/3,center.distanceTo(points[i+1])/3);
   const before=center.clone().add(previous.clone().sub(center).normalize().multiplyScalar(r));
   const after=center.clone().add(points[i+1].clone().sub(center).normalize().multiplyScalar(r));
   path.add(new THREE.LineCurve3(previous,before));path.add(new THREE.QuadraticBezierCurve3(before,center,after));previous=after;
  }
  path.add(new THREE.LineCurve3(previous,points.at(-1)));
  const pipe=new THREE.Mesh(new THREE.TubeGeometry(path,Math.max(24,cells.length*10),1.35,8,false),pipeMat);pipe.receiveShadow=true;world.add(pipe);
 }
 conduit([5,4],[7,3]);conduit([7,3],[8,6]);
''' +s[b:];p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig').replace('leverMode:level.lever===true})','leverMode:level.lever===true,levelMap:level.map})');p.write_text(s,encoding='utf-8')
