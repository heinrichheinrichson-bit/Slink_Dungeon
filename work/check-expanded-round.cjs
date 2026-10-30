const assert=require('assert'),deps='C:/Users/heinr/Documents/Codex/2026-10-12/k/outputs/Slink/node_modules';require(deps+'/esbuild').buildSync({entryPoints:['outputs/nurbis-dungeons/src/round-state.js'],bundle:true,platform:'node',format:'cjs',outfile:'work/expanded-round-state.cjs'});
const {createRound,solutionStates,directions}=require('./expanded-round-state.cjs'),r=createRound(),N=solutionStates.length;assert.equal(N,30);
const original=createRound();for(let i=0;i<3;i++)assert(original.act(directions.U).state);const old=original.export();old.ids=old.ids.slice(0,4);old.slots=old.slots.slice(0,4);old.slots[2].solved=true;old.index=0;
const migrated=createRound(JSON.parse(JSON.stringify(old)));assert.equal(migrated.slot.state.moves,3);assert.equal(migrated.guidePosition(),3);assert.equal(migrated.completed,1);assert.equal(migrated.slots.length,30);assert(migrated.slots[2].solved);assert(migrated.slots.slice(4).every(s=>s.state.moves===0&&!s.solved));migrated.undo();assert.equal(migrated.guidePosition(),2);
const reordered=structuredClone(old);reordered.ids.reverse();reordered.slots.reverse();reordered.index=3;const byID=createRound(reordered);assert.equal(byID.index,0);assert.equal(byID.guidePosition(),3);assert(byID.slots[2].solved);
const seven=createRound().export();seven.ids=seven.ids.slice(0,7);seven.slots=seven.slots.slice(0,7);seven.slots[6].solved=true;seven.index=6;const fromSeven=createRound(seven);assert.equal(fromSeven.index,6);assert(fromSeven.slots[6].solved);assert.equal(fromSeven.slots.length,30);assert(fromSeven.slots.slice(7).every(s=>s.state.moves===0&&!s.solved));
let total=0,metrics=[];
for(let room=0;room<N;room++){
 assert.equal(r.index,room);const states=solutionStates[room];let toggles=0,collapseAt=null,vacates=0;const history=[];
 for(let i=1;i<states.length;i++){
  const a=states[i-1],b=states[i],d=b.won?[r.room.level.exit[0]-a.p[0],r.room.level.exit[1]-a.p[1]]:[b.p[0]-a.p[0],b.p[1]-a.p[1]];history.push(structuredClone(r.slot.state));assert(r.act(d).state,`Room ${room} step ${i}`);assert.equal(r.guidePosition(),i);
  if(a.off!==b.off)toggles++;if(!a.opened&&b.opened)collapseAt=i;for(const p of a.boxes)if(r.room.level.map[p[1]][p[0]]==='S'&&!b.boxes.some(q=>String(q)===String(p)))vacates++;total++;
 }
 assert(r.slot.state.won);assert.equal(r.completed,room+1);
 const restored=createRound(JSON.parse(JSON.stringify(r.export())));assert(restored.slot.state.won);assert.equal(restored.completed,room+1);
 if(room>=4){for(let i=history.length-1;i>=0;i--){assert(restored.undo());assert.deepEqual(restored.slot.state,history[i]);}assert.equal(restored.guidePosition(),0);assert.equal(restored.completed,room+1);}
 metrics.push({room:room+1,title:r.room.level.title,moves:r.slot.state.moves,pushes:r.slot.state.pushes,toggles,collapseAt,vacates});
 assert.equal(r.next(),room<N-1);
}
assert.equal(r.completed,N);assert.equal(createRound({version:1,ids:'bad'}).completed,0);
console.log('Passed all',total,'moves across',N,'rooms. Old four-room saves, stable IDs, undo histories, progress, all endings and navigation passed.');console.log(metrics.slice(4));


const ten=createRound().export();ten.ids=ten.ids.slice(0,10);ten.slots=ten.slots.slice(0,10);ten.slots[9].solved=true;ten.index=9;const m10=createRound(ten);assert.equal(m10.index,9);assert(m10.slots[9].solved);assert(m10.slots.slice(10).every(s=>!s.solved&&s.state.moves===0));


const old24=createRound().export();old24.ids=old24.ids.slice(0,24);old24.slots=old24.slots.slice(0,24);old24.index=23;old24.slots[23].solved=true;const from24=createRound(old24);assert.equal(from24.index,23);assert(from24.slots[23].solved);assert.equal(from24.slots.length,30);assert(from24.slots.slice(24).every(s=>s.state.moves===0&&!s.solved));console.log('24 -> 30 migration passed.');
