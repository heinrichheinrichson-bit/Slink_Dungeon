const fs=require('fs'),base=require('./expansion-boards-base.json'),W=11,D=[-W,1,W,-1],L='URDL',enc=p=>p[1]*W+p[0],coord=c=>[c%W,c/W|0],original=base.map.join(''),floor=new Set([...original].flatMap((c,i)=>c==='#'?[]:[i])),goals=[...floor].filter(i=>original[i]==='S'),start={p:enc(base.start.p),b:base.start.boxes.map(enc),opened:false};
function solve(T,neverCross=false,cap=180000){
const pass=p=>floor.has(p)&&p!==T;
function reach(s,paths=false){const q=[s.p],seen=new Set(q),routes=paths?new Map([[s.p,'']]):null;for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){const n=q[i]+D[d];if(!seen.has(n)&&pass(n)&&!s.b.includes(n)){seen.add(n);q.push(n);if(paths)routes.set(n,routes.get(q[i])+L[d]);}}return {seen,anchor:Math.min(...q),routes};}
const key=s=>s.b.slice().sort((a,b)=>a-b)+':'+Number(s.opened)+':'+reach(s).anchor,q=[{...start,parent:-1,edge:'',pushes:0,collapseAfter:0}],seen=new Set([key(start)]);
for(let i=0;i<q.length;i++){const s=q[i];if(goals.every(g=>s.b.includes(g))){let path='',j=i;while(q[j].parent>=0){path=q[j].edge+path;j=q[j].parent;}return {solution:path,pushes:s.pushes,opened:s.opened,collapseAfter:s.collapseAfter,states:q.length,end:{p:coord(s.p),boxes:s.b.map(coord)}};}
const r=reach(s,true),next=[];
for(let j=0;j<4;j++)for(let d=0;d<4;d++){const b=s.b[j],to=b+D[d],behind=b-D[d];if(!r.seen.has(behind)||!pass(to)||s.b.includes(to))continue;if(!goals.includes(to)&&((!floor.has(to-1)||!floor.has(to+1))&&(!floor.has(to-W)||!floor.has(to+W))))continue;const boxes=s.b.slice();boxes[j]=to;next.push({...s,b:boxes,p:b,pushes:s.pushes+1,edge:r.routes.get(behind)+L[d]});}
if(!s.opened&&!neverCross)for(let enter=0;enter<4;enter++){const at=T-D[enter];if(!r.seen.has(at))continue;for(let exit=0;exit<4;exit++){const dest=T+D[exit];if(!pass(dest))continue;const j=s.b.indexOf(dest),b=s.b.slice();if(j>=0){const to=dest+D[exit];if(!pass(to)||b.includes(to))continue;b[j]=to;}
next.push({...s,b,p:dest,opened:true,pushes:s.pushes+(j>=0?1:0),collapseAfter:s.pushes,edge:r.routes.get(at)+L[enter]+L[exit]});}}
for(const n of next){const k=key(n);if(seen.has(k))continue;seen.add(k);q.push({...n,parent:i});if(q.length>cap)return {capped:true};}
}return null;}
const candidates=[...floor].filter(c=>!goals.includes(c)&&!start.b.includes(c)&&c!==start.p);let best=null;
for(const T of candidates){const r=solve(T);if(!r||r.capped||!r.opened||r.pushes<30||r.collapseAfter<8||r.collapseAfter>r.pushes-6)continue;const no=solve(T,true);if(no?.capped||no)continue;const out={...r,T:coord(T),map:base.map,start:base.start};if(!best||r.pushes>best.pushes){best=out;fs.writeFileSync('work/expansion-boards-design.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out));}}
if(!best)throw Error('No suitable irreversible route');
