const fs=require('fs'),base=require('./rocker-base.json');const W=11,D=[-W,1,W,-1],L='URDL',enc=p=>p[1]*W+p[0],coord=c=>[c%W,c/W|0];
const original=base.map.join(''),floor=new Set([...original].flatMap((c,i)=>c==='#'?[]:[i])),goals=[...floor].filter(i=>original[i]==='S'),start={p:enc(base.start.p),b:base.start.boxes.map(enc),off:false};
function solve(A,G,E,maxT=99,cap=100000){const tile=p=>p===A?'A':p===G?'G':p===E?'E':original[p]??'#',pass=(p,off)=>floor.has(p)&&p!==A&&!(p===G&&!off)&&!(p===E&&off);
function reach(s,paths=false){const q=[s.p],seen=new Set(q),routes=paths?new Map([[s.p,'']]):null;for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){const n=q[i]+D[d];if(!seen.has(n)&&pass(n,s.off)&&!s.b.includes(n)){seen.add(n);q.push(n);if(paths)routes.set(n,routes.get(q[i])+L[d]);}}return {seen,anchor:Math.min(...q),routes};}
const key=s=>s.b.slice().sort((a,b)=>a-b)+':'+Number(s.off)+':'+reach(s).anchor+(maxT<99?':'+s.t:'');
const q=[{...start,t:0,parent:-1,edge:'',pushes:0,depth:0}],seen=new Set([key(q[0])]);let examined=0;
for(let i=0;i<q.length;i++){const s=q[i];if(s.b.every(b=>goals.includes(b))){let path='',j=i;while(q[j].parent>=0){path=q[j].edge+path;j=q[j].parent;}return {solution:path,pushes:s.pushes,toggles:s.t,states:q.length};}const r=reach(s,true),next=[];
for(let j=0;j<4;j++)for(let d=0;d<4;d++){const b=s.b[j],to=b+D[d],behind=b-D[d];if(!r.seen.has(behind)||!pass(to,s.off)||s.b.includes(to))continue; // A reverse dead-square test is independent of gate state.
if(!goals.includes(to)&&((!floor.has(to-1)||!floor.has(to+1))&&(!floor.has(to-W)||!floor.has(to+W))))continue;
const boxes=s.b.slice();boxes[j]=to;next.push({...s,b:boxes,p:b,pushes:s.pushes+1,edge:r.routes.get(behind)+L[d]});}
if(s.t<maxT){const dx=s.off?-1:1,at=A-dx,exit=A+dx,off=!s.off;if(r.seen.has(at)&&pass(exit,off)&&!s.b.includes(exit)&&!s.b.some(b=>(b===G&&!off)||(b===E&&off)))next.push({...s,p:exit,off,t:s.t+1,edge:r.routes.get(at)+(dx===1?'RR':'LL')});}
for(const n of next){const k=key(n);if(seen.has(k))continue;seen.add(k);q.push({...n,parent:i,depth:s.depth+1});if(q.length>cap)return {capped:true};}
}return null;}
let seed=817;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const choices=[...floor].filter(c=>!goals.includes(c)&&!start.b.includes(c)&&c!==start.p&&Math.floor(c/W)>2);const switches=[...floor].filter(c=>floor.has(c-1)&&floor.has(c+1)&&!goals.includes(c)&&!start.b.includes(c)&&c!==start.p);let best=null,stats={solved:0,maxToggle:0,maxPush:0};
for(let i=0;i<5000;i++){const A=switches[Math.floor(rnd()*switches.length)],G=choices[Math.floor(rnd()*choices.length)],E=choices[Math.floor(rnd()*choices.length)];if(G===E||G===A||E===A||G===A-1||G===A+1||E===A-1||E===A+1)continue;const r=solve(A,G,E);if(r&&!r.capped){stats.solved++;stats.maxToggle=Math.max(stats.maxToggle,r.toggles);stats.maxPush=Math.max(stats.maxPush,r.pushes);}if(!r||r.capped||r.toggles<3||r.pushes<30)continue;const simple=solve(A,G,E,2);if(simple?.capped||simple)continue;best={...r,A:coord(A),G:coord(G),E:coord(E),map:base.map,start:base.start};fs.writeFileSync('work/rocker-room-design.json',JSON.stringify(best,null,2));console.log(JSON.stringify(best));break;}
console.log(stats);if(!best)throw Error('No suitable switch dependency');



