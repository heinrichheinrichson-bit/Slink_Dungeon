const fs=require('fs'),{flood,solve,assignment,D,N}=require('./interlock-search-core.cjs');let seed=3012303,best=0;const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296),began=Date.now();
for(let trial=0;trial<4000;trial++){
const f=new Set();for(let y=1;y<=6;y++)for(let x=1;x<=7;x++)if(rnd()>.25)f.add(y*N+x);
const cells=[...f];if(cells.length<25||cells.length>35||flood(f,[],cells[0]).seen.size!==cells.length)continue;
const possible=cells.filter(c=>D.some(d=>f.has(c+d)&&f.has(c+2*d))),g=[...new Set(Array.from({length:4},()=>possible[Math.floor(rnd()*possible.length)]))];if(g.length!==4)continue;
let q=[],seen=new Set();for(const p of cells){if(g.includes(p))continue;const anchor=flood(f,g,p).anchor,key=g.slice().sort((a,b)=>a-b)+':'+anchor;if(seen.has(key))continue;seen.add(key);q.push({b:g,p,depth:0});}
for(let i=0;i<q.length&&q.length<60000;i++){const s=q[i],r=flood(f,s.b,s.p);for(let j=0;j<4;j++)for(const d of D){const at=s.b[j],to=at+d,stand=at+2*d;if(!r.seen.has(to)||!f.has(stand)||s.b.includes(stand))continue;const b=s.b.slice();b[j]=to;const key=b.slice().sort((a,b)=>a-b)+':'+flood(f,b,stand).anchor;if(seen.has(key))continue;seen.add(key);q.push({b,p:stand,depth:s.depth+1});}}
const candidates=q.filter(s=>s.depth>=32&&!s.b.some(b=>g.includes(b))).map(s=>({...s,lower:assignment(s.b,g)})).sort((a,b)=>(b.depth-b.lower)-(a.depth-a.lower));
if(!candidates.length)continue;const s=candidates[0],score=s.depth-s.lower;if(score<best||score<22)continue;
const solution=solve(f,g,s,350000);if(!solution||solution.capped||solution.pushes<32)continue;
const coord=c=>[c%N+1,(c/N|0)+1],map=Array.from({length:10},()=>Array(11).fill('#'));for(const c of f)map[(c/N|0)+1][c%N+1]=g.includes(c)?'S':'.';
const locked=solve(f,g,s,350000,true);const out={map:map.map(r=>r.join('')),start:{p:coord(s.p),boxes:s.b.map(coord)},solution:solution.path,pushes:solution.pushes,lowerBound:s.lower,states:solution.states,goalVacateRequired:locked===null};
best=score;fs.writeFileSync('work/lernpfad-boardsHard2-base.json',JSON.stringify(out,null,2));console.log(JSON.stringify({trial,best,pushes:solution.pushes,lower:s.lower,states:solution.states,locked:out.goalVacateRequired}),out.map.join('\n'));
break;
if(Date.now()-began>160000)break;
}
if(!best)throw Error('No candidate');
