const assert=require('assert'),fs=require('fs'),room=require('./counterflow-collection.cjs').rooms[0],d=require('./rocker-room-design.json'),data=require('./counterflow-solution.json');
const at=(p,off=false)=>({...room.initial(),p,off});
assert(!room.act(at([d.A[0]+1,d.A[1]]),[-1,0]).state,'Raised end must block entry');
assert(!room.act(at([d.A[0],d.A[1]+1]),[0,-1]).state,'Side entry must be blocked');
const entered=room.act(at([d.A[0]-1,d.A[1]]),[1,0]).state;
// The initial crate is at the right end of this rocker: crossing must be rejected.
assert(!entered,'Occupied opposite end must block crossing');
const free=at([d.A[0]-1,d.A[1]]);free.boxes[1]=[3,7];const crossing=room.act(free,[1,0]).state;assert(crossing?.off);
assert(!room.act(crossing,[0,1]).state,'No side exit');assert(!room.act(crossing,[-1,0]).state,'No turning back on rocker');assert(room.act(crossing,[1,0]).state,'Crossing continues straight');
const jammed=at([d.A[0]+1,d.A[1]],true);jammed.boxes[1]=d.G;assert(!room.act(jammed,[-1,0]).state,'A stone in the closing gate must block switching');
let s=room.initial(),toggles=[],history=[];const dirs={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};for(let i=0;i<data.solution.length;i++){history.push(s);const n=room.act(s,dirs[data.solution[i]]).state;assert(n);if(n.off!==s.off){toggles.push(i+1);assert.equal(n.toggles,s.toggles+1);const before=history.at(-1);assert.equal(before.off,!n.off);}s=n;}assert(s.won);assert.equal(toggles.length,3);while(history.length)s=history.pop();assert.deepEqual(s,room.initial());console.log('Directional entry/exit, occupied landing, gate jam, three toggles, victory and full undo passed.');
