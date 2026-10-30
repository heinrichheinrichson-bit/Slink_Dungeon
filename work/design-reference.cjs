const fs=require('fs');let seed=710275;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);const D=[-9,1,9,-1],L='URDL';
function reach(free,boxes,p){const seen=new Set([p]),path=new Map([[p,'']]),q=[p],blocked=new Set(boxes);for(let i=0;i<q.length;i++)for(let d=0;d<4;d++){const n=q[i]+D[d];if(free.has(n)&&!blocked.has(n)&&!seen.has(n)){seen.add(n);path.set(n,path.get(q[i])+L[d]);q.push(n);}}return {seen,path,anchor:Math.min(...seen)};}
function solve(free,goals,start,noVacate=false,cap=65000){let r=reach(free,start.boxes,start.p),q=[{...start,path:'',pushes:0}],seen=new Set([start.boxes.slice().sort((a,b)=>a-b)+':'+r.anchor]);for(let i=0;i<q.length;i++){const s=q[i];if(s.boxes.every(b=>goals.includes(b)))return {...s,states:q.length};r=reach(free,s.boxes,s.p);for(let b=0;b<s.boxes.length;b++){if(noVacate&&goals.includes(s.boxes[b]))continue;for(let d=0;d<4;d++){const pos=s.boxes[b],dest=pos+D[d],behind=pos-D[d];if(!r.seen.has(behind)||!free.has(dest)||s.boxes.includes(dest))continue;const boxes=s.boxes.slice();boxes[b]=dest;const next=reach(free,boxes,pos),key=boxes.slice().sort((a,b)=>a-b)+':'+next.anchor;if(seen.has(key))continue;seen.add(key);q.push({boxes,p:pos,path:s.path+r.path.get(behind)+L[d],pushes:s.pushes+1});if(q.length>cap)return {capped:true};}}}return null;}
let best=null;
for(let trial=0;trial<5000;trial++){
 const free=new Set();for(let y=1;y<8;y++)for(let x=1;x<8;x++)if(rand()>.25)free.add(y*9+x);const cells=[...free];if(cells.length<24)continue;
 const goals=[...new Set(Array.from({length:3},()=>cells[Math.floor(rand()*cells.length)]))];if(goals.length!==3)continue;
 let state={boxes:goals.slice(),p:cells.find(c=>!goals.includes(c))};
 for(let step=0;step<450;step++){
 const reachable=reach(free,state.boxes,state.p),choices=[];for(let b=0;b<3;b++)for(let d=0;d<4;d++){const pos=state.boxes[b],at=pos+D[d],to=pos+2*D[d];if(reachable.seen.has(at)&&free.has(to)&&!state.boxes.includes(to)){const boxes=state.boxes.slice();boxes[b]=at;choices.push({boxes,p:to});}}if(!choices.length)break;choices.sort((a,b)=>{const score=s=>s.boxes.reduce((v,p)=>v+Math.min(...goals.map(g=>Math.abs(p%9-g%9)+Math.abs(Math.floor(p/9)-Math.floor(g/9)))),0);return score(b)-score(a);});state=choices[Math.floor(rand()*Math.max(1,Math.ceil(choices.length*(rand()<.65?.35:1))))];
 if(step<100||step%50)continue;
 const solved=solve(free,goals,state);if(!solved||solved.capped||solved.pushes<18||solved.path.length<60)continue;
 const monotone=solve(free,goals,state,true,100000);if(monotone?.capped||monotone&&!monotone.capped)continue;
 const map=Array.from({length:11},()=>Array(11).fill('#'));for(const c of free)map[Math.floor(c/9)+1][c%9+1]='.';for(const c of goals)map[Math.floor(c/9)+1][c%9+1]='S';const coord=c=>[c%9+1,Math.floor(c/9)+1];
 best={map:map.map(r=>r.join('')),start:{p:coord(state.p),boxes:state.boxes.map(coord)},solution:solved.path,pushes:solved.pushes,states:solved.states,goalVacateRequired:true};fs.writeFileSync('work/reference-design.json',JSON.stringify(best,null,2));console.log('Candidate',best.pushes,best.solution.length,best.states);break;
 }
 if(best)break;
}
if(!best)throw Error('No qualifying candidate');console.log(best.map.join('\n'));
