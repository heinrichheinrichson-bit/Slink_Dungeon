const esbuild=require('esbuild'),assert=require('node:assert/strict');
esbuild.buildSync({entryPoints:['outputs/nurbis-dungeons/src/round-state.js'],bundle:true,platform:'node',format:'cjs',outfile:'work/round-redo-test-bundle.cjs'});
esbuild.buildSync({entryPoints:['outputs/nurbis-dungeons/src/round-data.js'],bundle:true,platform:'node',format:'cjs',outfile:'work/round-data-test-bundle.cjs'});
const {createRound,directions}=require('./round-redo-test-bundle.cjs'),{solutions}=require('./round-data-test-bundle.cjs');
const round=createRound();let count=0;
for(let i=0;i<solutions.length;i++){
 round.select(i);const states=[structuredClone(round.slot.state)];
 for(const letter of solutions[i]){assert(round.act(directions[letter]).state);states.push(structuredClone(round.slot.state));count++;}
 assert(round.slot.state.won);
 for(let j=states.length-2;j>=0;j--){assert(round.undo());assert.deepEqual(round.slot.state,states[j]);}
 for(let j=1;j<states.length;j++){assert(round.canRedo);assert(round.redo());assert.deepEqual(round.slot.state,states[j]);}
 assert(!round.canRedo);assert(!round.redo());
 round.undo();round.reset();assert(!round.canRedo);
 round.act(directions[solutions[i][0]]);round.undo();assert(round.canRedo);round.act(directions[solutions[i][0]]);assert(!round.canRedo);
}
const restored=createRound(round.export());assert.deepEqual(restored.export(),round.export());
console.log(`PASS ${solutions.length} rooms / ${count} moves: exact undo/redo, reset, branch invalidation, save roundtrip`);
require('node:fs').unlinkSync('work/round-data-test-bundle.cjs');require('node:fs').unlinkSync('work/round-redo-test-bundle.cjs');
