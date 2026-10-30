const fs=require('fs'),{flood,solve,assignment,D,N}=require('./interlock-search-core.cjs');let seed=3010997,best=0,accepted=[],layouts=new Set();const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296),began=Date.now();
for(let trial=0;trial<12000;trial++){
const f=new Set();for(let y=1;y<=5;y++)for(let x=1;x<=5;x++)if(rnd()>.25)f.add(y*N+x);
const cells=[...f];if(cells.length<14||cells.length>25||flood(f,[],cells[0]).seen.size!==cells.length)continue;
const possible=cells.filter(c=>D.some(d=>f.has(c+d)&&f.has(c+2*d))),g=[...new Set(Array.from({length:2},()=>possible[Math.floor(rnd()*possible.length)]))];if(g.length!==2)continue;
let q=[],seen=new Set();for(const p of cells){if(g.includes(p))continue;const anchor=flood(f,g,p).anchor,key=g.slice().sort((a,b)=>a-b)+':'+anchor;if(seen.has(key))continue;seen.add(key);q.push({b:g,p,depth:0});}
for(let i=0;i<q.length&&q.length<60000;i++){const s=q[i],r=flood(f,s.b,s.p);for(let j=0;j<2;j++)for(const d of D){const at=s.b[j],to=at+d,stand=at+2*d;if(!r.seen.has(to)||!f.has(stand)||s.b.includes(stand))continue;const b=s.b.slice();b[j]=to;const key=b.slice().sort((a,b)=>a-b)+':'+flood(f,b,stand).anchor;if(seen.has(key))continue;seen.add(key);q.push({b,p:stand,depth:s.depth+1});}}
const band=[4,5,6,7,8,9,10,11][accepted.length%8];
const layout=[...f].sort((a,b)=>a-b).join(',');if(layouts.has(layout))continue;
const candidates=q.filter(s=>s.depth>=band&&s.depth<=Math.min(12,band+1)&&!s.b.some(b=>g.includes(b))).map(s=>({...s,lower:assignment(s.b,g)})).sort((a,b)=>(b.depth-b.lower)-(a.depth-a.lower));
if(!candidates.length)continue;const s=candidates[0],score=s.depth-s.lower;if(score<1)continue;
const solution=solve(f,g,s,350000);if(!solution||solution.capped||solution.pushes<4)continue;
const coord=c=>[c%N+1,(c/N|0)+1],map=Array.from({length:10},()=>Array(11).fill('#'));for(const c of f)map[(c/N|0)+1][c%N+1]=g.includes(c)?'S':'.';
const locked=solve(f,g,s,350000,true);const out={map:map.map(r=>r.join('')),start:{p:coord(s.p),boxes:s.b.map(coord)},solution:solution.path,pushes:solution.pushes,lowerBound:s.lower,states:solution.states,goalVacateRequired:locked===null};
best=score;accepted.push(out);layouts.add(layout);fs.writeFileSync('work/lernpfad-mechanic-easy-pool.json',JSON.stringify(accepted,null,2));console.log(JSON.stringify({trial,accepted:accepted.length,pushes:solution.pushes,lower:s.lower,locked:out.goalVacateRequired}));
if(accepted.length>=8)break;
if(Date.now()-began>160000)break;
}
if(accepted.length<8)throw Error('Insufficient candidates '+accepted.length);
