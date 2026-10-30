const fs=require('fs'),path=require('path'),deps='C:/Users/heinr/Documents/Codex/2026-10-12/k/outputs/Slink/node_modules';require(path.join(deps,'esbuild')).buildSync({entryPoints:['outputs/nurbis-dungeons/src/combined-core.js'],outfile:'work/combined-core.cjs',platform:'node',format:'cjs'});
const {initial,act,level}=require('./combined-core.cjs');
const dirs=[[0,-1],[1,0],[0,1],[-1,0]],names=['U','R','D','L'],key=s=>JSON.stringify([s.p,s.boxes,s.off]);let q=[{s:initial(),path:''}],seen=new Set([key(q[0].s)]),win;
for(let i=0;i<q.length;i++){const n=q[i];if(n.s.won){win=n;break;}for(let d=0;d<4;d++){const next=act(n.s,dirs[d]).state;if(next&&!seen.has(key(next))){seen.add(key(next));q.push({s:next,path:n.path+names[d]});}}}
if(!win)throw Error('Unsolvable');fs.writeFileSync('work/combined-solution.json',JSON.stringify({path:win.path,moves:win.s.moves,pushes:win.s.pushes,visited:seen.size},null,2));console.log('Solution',win.path,'moves',win.s.moves,'pushes',win.s.pushes,'states',seen.size);
const assert=require('assert');const c=require('./combined-core.cjs');
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let s=c.initial(),history=[];const original=JSON.stringify(s);for(const ch of win.path){history.push(s);const n=c.act(s,dirs[names.indexOf(ch)]).state;assert(n,'solution step failed');s=n;}assert(s.won);while(history.length)s=history.pop();assert.equal(JSON.stringify(s),original,'undo must restore full state');
let off=c.initial();off.p=[3,2];assert(!c.act(off,[0,1]).state,'side entry blocked');off.p=[4,3];assert(!c.act(off,[-1,0]).state,'high end blocked');off.p=[2,3];let on=c.act(off,[1,0]).state;assert(on.off);assert(!c.act(on,[0,1]).state,'lateral exit blocked');on=c.act(on,[1,0]).state;let back=c.act(on,[-1,0]).state;assert(!back.off,'reverse crossing resets switch');
on.off=true;on.p=[4,3];on.boxes=[[5,4]];assert(!c.act(on,[-1,0]).state,'gate cannot close onto stone');
let dead=c.initial();dead.boxes=[[1,1]];dead.p=[2,1];assert(!c.act(dead,[-1,0]).state);dead.p=[1,2];assert(!c.act(dead,[0,-1]).state);console.log('Passed: full solution, full-state undo, rocker entry/exit, reverse toggle, occupied gate, corner deadlock.');
