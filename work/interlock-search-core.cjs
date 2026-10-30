const fs=require('fs');
let seed=282610;const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
const N=9,D=[-N,1,N,-1],L='URDL';
function flood(f,b,p,paths=false){const blocked=new Set(b),q=[p],seen=new Set(q),route=paths?new Map([[p,'']]):null;for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){let n=q[i]+D[d];if(f.has(n)&&!blocked.has(n)&&!seen.has(n)){seen.add(n);q.push(n);if(paths)route.set(n,route.get(q[i])+L[d]);}}return {seen,anchor:Math.min(...q),route};}
function viable(f,g){let seen=new Set(g),q=[...g];for(let i=0;i<q.length;i++)for(const d of D){const n=q[i]+d;if(f.has(n)&&f.has(n+d)&&!seen.has(n)){seen.add(n);q.push(n);}}return seen;}
function solve(f,g,s,cap=150000,lockGoals=false,forbidden=[]){const live=viable(f,g);for(const c of forbidden)live.delete(c);const r=flood(f,s.b,s.p),q=[{...s,parent:-1,edge:'',depth:0}],seen=new Set([s.b.slice().sort((a,b)=>a-b)+':'+r.anchor]);for(let i=0;i<q.length;i++){const a=q[i];if(a.b.every(b=>g.includes(b))){let path='',at=i;while(q[at].parent>=0){path=q[at].edge+path;at=q[at].parent;}return {path,pushes:a.depth,states:q.length};}const reach=flood(f,a.b,a.p,true);for(let j=0;j<a.b.length;j++){let p=a.b[j];if(lockGoals&&g.includes(p))continue;for(let d=0;d<4;d++){let to=p+D[d],behind=p-D[d];if(!live.has(to)||a.b.includes(to)||!reach.seen.has(behind))continue;const b=a.b.slice();b[j]=to;const next=flood(f,b,p),key=b.slice().sort((a,b)=>a-b)+':'+next.anchor;if(seen.has(key))continue;seen.add(key);q.push({b,p,parent:i,edge:reach.route.get(behind)+L[d],depth:a.depth+1});if(q.length>cap)return {capped:true};}}}return null;}
function assignment(b,g){if(!b.length)return 0;return Math.min(...g.map((p,i)=>Math.abs(p%N-b[0]%N)+Math.abs((p/N|0)-(b[0]/N|0))+assignment(b.slice(1),g.filter((_,j)=>i!==j))));}

module.exports={flood,solve,assignment,viable,D,L,N};

