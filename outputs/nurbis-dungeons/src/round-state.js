import {rooms,solutions} from './round-data.js';
export const directions={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
const signature=s=>JSON.stringify([s.p,s.boxes,s.off??false,s.opened??false,s.rescued,s.won,s.rockerEntry??null]);
export const solutionStates=rooms.map((room,i)=>{
 const states=[room.initial()];
 for(const letter of solutions[i]){const next=room.act(states.at(-1),directions[letter]).state;if(!next)throw Error('Ungültige Testlösung in '+room.id);states.push(next);}
 if(!states.at(-1).won)throw Error('Unvollständige Testlösung in '+room.id);
 return states;
});
export function createRound(saved){
 let index=0,slots=rooms.map(r=>({state:r.initial(),history:[],solved:false}));
 if(saved?.version===1&&Array.isArray(saved.ids)&&Array.isArray(saved.slots)&&saved.ids.length===saved.slots.length){
  // Keep stable room identities when the collection grows or is reordered.
  rooms.forEach((room,i)=>{const old=saved.ids.indexOf(room.id),slot=saved.slots[old];
   if(slot&&Array.isArray(slot.history)&&Number.isInteger(slot.state?.moves)&&Array.isArray(slot.state?.p)&&Array.isArray(slot.state?.boxes)){slots[i]=structuredClone(slot);if(!saved.rockerRuleVersion&&(room.level.switchRescue||room.level.waterRescue)){for(const state of [slots[i].state,...slots[i].history]){if(room.level.map[state.p[1]]?.[state.p[0]]==='A'){state.rockerEntry=state.off?1:-1;state.off=!state.off;state.toggles=Math.max(0,(state.toggles||0)-1);}}}}
  });
  const selected=rooms.findIndex(room=>room.id===saved.ids[saved.index]);if(selected>=0)index=selected;
 }
 return {
  get index(){return index;},get slots(){return slots;},get slot(){return slots[index];},get room(){return rooms[index];},
  get completed(){return slots.filter(s=>s.solved).length;},
  select(i){if(Number.isInteger(i)&&i>=0&&i<rooms.length)index=i;},
  act(d){const slot=slots[index],result=rooms[index].act(slot.state,d);if(result.state){slot.history.push(slot.state);slot.state=result.state;slot.solved ||= slot.state.won;}return result;},
  undo(){const slot=slots[index];if(!slot.history.length)return false;slot.state=slot.history.pop();return true;},
  reset(){slots[index]={state:rooms[index].initial(),history:[],solved:slots[index].solved};},
  next(){if(!slots[index].state.won||index===rooms.length-1)return false;index++;return true;},
  guidePosition(){const state=slots[index].state,at=state.moves;return solutionStates[index][at]&&signature(solutionStates[index][at])===signature(state)?at:-1;},
  export(){return {version:1,rockerRuleVersion:2,ids:rooms.map(r=>r.id),index,slots:structuredClone(slots)};}
 };
}
