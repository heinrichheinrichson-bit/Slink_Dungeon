const fs=require('fs'),W=11,D=[-W,1,W,-1],L='URDL',A=5*W+2;let seed=286581;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),coord=c=>[c%W,c/W|0];
function engine(map,goals){const tiles=map.join(''),f=new Set([...tiles].flatMap((c,i)=>c==='#'?[]:[i])),water=c=>tiles[c]==='U'||tiles[c]==='W',wet=(p,off)=>tiles[p]==='U'?!off:tiles[p]==='W'?off:false,edge=(a,b)=>f.has(a)&&f.has(b)&&(!(water(a)||water(b))||Math.abs(a-b)===1),pass=(p,off)=>f.has(p)&&p!==A&&!wet(p,off);
function reach(s,paths=false){const q=[s.p],seen=new Set(q),routes=paths?new Map([[s.p,'']]):null;for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){const n=q[i]+D[d];if(!seen.has(n)&&edge(q[i],n)&&pass(n,s.off)&&!s.b.includes(n)){seen.add(n);q.push(n);if(paths)routes.set(n,routes.get(q[i])+L[d]);}}return {seen,anchor:Math.min(...q),routes};}
let live=new Set(goals),pq=[...goals];for(let i=0;i<pq.length;i++)for(const delta of D){const b=pq[i]+delta,behind=b+delta;if(b!==A&&behind!==A&&edge(pq[i],b)&&edge(b,behind)&&!live.has(b)){live.add(b);pq.push(b);}}
const key=s=>s.b.slice().sort((a,b)=>a-b)+':'+Number(s.off)+':'+reach(s).anchor;
function toggle(s,r){const dx=s.off?-1:1,at=A-dx,exit=A+dx;if(r.seen.has(at)&&pass(exit,!s.off)&&!s.b.includes(exit))return {...s,p:exit,off:!s.off};return null;}
function solve(start,maxT=99,cap=140000){const stateKey=s=>key(s)+(maxT<99?':'+s.t:''),q=[{...start,parent:-1,edge:'',pushes:0,t:0}],seen=new Set([stateKey({...start,t:0})]);for(let i=0;i<q.length;i++){const s=q[i];if(goals.every(g=>s.b.includes(g))){let path='',j=i;while(q[j].parent>=0){path=q[j].edge+path;j=q[j].parent;}return {solution:path,pushes:s.pushes,toggles:s.t,states:q.length,end:{p:coord(s.p),boxes:s.b.map(coord),off:s.off}};}
const r=reach(s,true),next=[];for(let j=0;j<4;j++)for(let d=0;d<4;d++){const b=s.b[j],to=b+D[d],at=b-D[d];if(!pass(b,s.off)||!live.has(to)||!pass(to,s.off)||!r.seen.has(at)||s.b.includes(to)||!edge(at,b)||!edge(b,to))continue;const boxes=s.b.slice();boxes[j]=to;next.push({...s,b:boxes,p:b,pushes:s.pushes+1,edge:r.routes.get(at)+L[d]});}
const t=s.t<maxT?toggle(s,r):null;if(t)next.push({...t,t:s.t+1,edge:r.routes.get(A-(s.off?-1:1))+(s.off?'LL':'RR')});for(const n of next){const k=stateKey(n);if(seen.has(k))continue;seen.add(k);q.push({...n,parent:i});if(q.length>cap)return {capped:true};}}
return null;}
function reverse(s){const r=reach(s),next=[];for(let j=0;j<4;j++)for(const delta of D){const b=s.b[j],to=b+delta,stand=b+delta*2;if(!pass(b,s.off)||!r.seen.has(to)||!pass(stand,s.off)||s.b.includes(stand)||!edge(b,to)||!edge(to,stand))continue;const boxes=s.b.slice();boxes[j]=to;next.push({...s,b:boxes,p:stand});}const t=toggle(s,r);if(t)next.push(t);return next;}
return {solve,reverse,key,reach,f,tiles};}

module.exports={engine,coord,W,D,A};
