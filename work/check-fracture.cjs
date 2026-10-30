const fs=require('fs'),path=require('path'),assert=require('assert'),deps='C:/Users/heinr/Documents/Codex/2026-10-12/k/outputs/Slink/node_modules';
require(path.join(deps,'esbuild')).buildSync({entryPoints:['outputs/nurbis-dungeons/src/fracture-collection.js'],bundle:true,platform:'node',format:'cjs',outfile:'work/fracture-collection.cjs'});
const room=require('./fracture-collection.cjs').rooms[0],design=JSON.parse(fs.readFileSync('work/fracture-room-design.json')),D={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};let s=room.initial(),history=[],solution='',pushesByStone=[0,0,0,0],goalVacates=0;
function step(l){const prev=s,result=room.act(s,D[l]);assert(result.state,`Invalid ${l} at ${s.p}: ${result.reason}`);history.push(prev);s=result.state;for(let i=0;i<4;i++)if(String(prev.boxes[i])!==String(s.boxes[i])){pushesByStone[i]++;if(room.level.map[prev.boxes[i][1]][prev.boxes[i][0]]==='S')goalVacates++;}solution+=l;}
function follow(route){assert(route,'Missing walking path');for(let i=1;i<route.length;i++){const dx=route[i][0]-route[i-1][0],dy=route[i][1]-route[i-1][1];step(Object.keys(D).find(k=>D[k][0]===dx&&D[k][1]===dy));}}
for(const l of design.solution)step(l);assert(room.ready(s));assert.equal(s.pushes,design.pushes);follow(room.path(s,s.p,room.level.friend));assert(s.rescued&&!s.won);follow(room.path(s,s.p,room.level.exit));assert(s.won);
for(const route of [s.escapeRoute,s.nurbiRoute])for(let i=0;i<route.length-1;i++){assert(!s.boxes.some(b=>String(b)===String(route[i])));assert.notEqual(room.level.map[route[i][1]]?.[route[i][0]],'#');assert.equal(Math.abs(route[i][0]-route[i+1][0])+Math.abs(route[i][1]-route[i+1][1]),1);}
const final=structuredClone(s);while(history.length)s=history.pop();assert.deepEqual(s,room.initial());assert(!room.act(s,[0,-1]).state,'Bottom wall must block movement');
fs.writeFileSync('work/fracture-solution.json',JSON.stringify({solution,moves:final.moves,pushes:final.pushes,pushesByStone,goalVacates,opened:final.opened,escapeRoute:final.escapeRoute,nurbiRoute:final.nurbiRoute},null,2));
console.log('Rescue replay and full undo passed',JSON.stringify({moves:final.moves,pushes:final.pushes,pushesByStone,goalVacates}));

