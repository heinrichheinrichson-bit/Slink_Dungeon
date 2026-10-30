const fs=require('fs');
let seed=282610;const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
const N=9,D=[-N,1,N,-1],L='URDL';
function flood(f,b,p,paths=false){const blocked=new Set(b),q=[p],seen=new Set(q),route=paths?new Map([[p,'']]):null;for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){let n=q[i]+D[d];if(f.has(n)&&!blocked.has(n)&&!seen.has(n)){seen.add(n);q.push(n);if(paths)route.set(n,route.get(q[i])+L[d]);}}return {seen,anchor:Math.min(...q),route};}
function viable(f,g){let seen=new Set(g),q=[...g];for(let i=0;i<q.length;i++)for(const d of D){const n=q[i]+d;if(f.has(n)&&f.has(n+d)&&!seen.has(n)){seen.add(n);q.push(n);}}return seen;}
function solve(f,g,s,cap=150000,lockGoals=false){const live=viable(f,g),r=flood(f,s.b,s.p),q=[{...s,parent:-1,edge:'',depth:0}],seen=new Set([s.b.slice().sort((a,b)=>a-b)+':'+r.anchor]);for(let i=0;i<q.length;i++){const a=q[i];if(a.b.every(b=>g.includes(b))){let path='',at=i;while(q[at].parent>=0){path=q[at].edge+path;at=q[at].parent;}return {path,pushes:a.depth,states:q.length};}const reach=flood(f,a.b,a.p,true);for(let j=0;j<a.b.length;j++){let p=a.b[j];if(lockGoals&&g.includes(p))continue;for(let d=0;d<4;d++){let to=p+D[d],behind=p-D[d];if(!live.has(to)||a.b.includes(to)||!reach.seen.has(behind))continue;const b=a.b.slice();b[j]=to;const next=flood(f,b,p),key=b.slice().sort((a,b)=>a-b)+':'+next.anchor;if(seen.has(key))continue;seen.add(key);q.push({b,p,parent:i,edge:reach.route.get(behind)+L[d],depth:a.depth+1});if(q.length>cap)return {capped:true};}}}return null;}
function assignment(b,g){if(!b.length)return 0;return Math.min(...g.map((p,i)=>Math.abs(p%N-b[0]%N)+Math.abs((p/N|0)-(b[0]/N|0))+assignment(b.slice(1),g.filter((_,j)=>i!==j))));}
let best=0,tries=0;const began=Date.now();
for(let trial=0;trial<180000;trial++){
 const f=new Set();for(let y=1;y<=6;y++)for(let x=1;x<=7;x++)if(rnd()>.18)f.add(y*N+x);
 const cells=[...f];if(cells.length<25||cells.length>37||flood(f,[],cells[0]).seen.size!==cells.length)continue;
 const usable=cells.filter(c=>D.filter(d=>f.has(c+d)&&f.has(c+2*d)).length>=2);
 const g=[...new Set(Array.from({length:4},()=>usable[Math.floor(rnd()*usable.length)]))];if(g.length!==4)continue;
 let s={b:g.slice(),p:cells.find(c=>!g.includes(c))},prev='',visit=new Map();
 for(let walk=0;walk<700;walk++){
  const r=flood(f,s.b,s.p),choices=[];
  for(let j=0;j<4;j++)for(let d=0;d<4;d++){let pos=s.b[j],to=pos+D[d],stand=pos+2*D[d];if(r.seen.has(to)&&f.has(stand)&&!s.b.includes(stand)){const b=s.b.slice();b[j]=to;const next={b,p:stand},key=b.slice().sort((a,b)=>a-b)+':'+flood(f,b,stand).anchor;choices.push({s:next,key,score:(visit.get(key)||0)*4+rnd()*3+(key===prev?8:0)});}}
  if(!choices.length)break;choices.sort((a,b)=>a.score-b.score);prev=s.b.slice().sort((a,b)=>a-b)+':'+r.anchor;s=choices[0].s;visit.set(choices[0].key,(visit.get(choices[0].key)||0)+1);
  if(walk<100||walk%100)continue;
  const lower=assignment(s.b,g);if(lower>24||lower<4)continue;
  tries++;const result=solve(f,g,s);if(!result||result.capped||result.pushes<24||result.pushes-lower<14)continue;
  const locked=solve(f,g,s,150000,true);if(locked?.capped||locked)continue;
  const score=result.pushes-lower;if(score<=best)continue;best=score;
  const map=Array.from({length:10},()=>Array(11).fill('#'));for(const c of f)map[(c/N|0)+1][c%N+1]=g.includes(c)?'S':'.';
  const coord=c=>[c%N+1,(c/N|0)+1];const out={map:map.map(r=>r.join('')),start:{p:coord(s.p),boxes:s.b.map(coord)},solution:result.path,pushes:result.pushes,lowerBound:lower,states:result.states,goalVacateRequired:true};
  fs.writeFileSync('work/interlock-design.json',JSON.stringify(out,null,2));console.log('BEST',JSON.stringify({trial,tries,pushes:result.pushes,lower,states:result.states,moves:result.path.length}),out.map.join('\n'));
  if(score>=36&&result.pushes>=48)process.exit(0);
 }
 if(Date.now()-began>220000&&best)break;
}
console.log({tries});if(!best)throw Error('No acceptable design');



