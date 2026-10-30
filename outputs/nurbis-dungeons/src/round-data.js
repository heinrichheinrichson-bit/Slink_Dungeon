import {rooms as allRooms,solutions as allSolutions,introductions as allIntroductions} from './catalogue-data.js';
import {chapters,progression} from './progression-plan.js';
export {chapters};
export const legacyRoomIds=allRooms.slice(0,30).map(r=>r.id);
const indices=new Map(allRooms.map((r,i)=>[r.id,i]));
if(indices.size!==allRooms.length||progression.length!==allRooms.length||new Set(progression.map(p=>p.id)).size!==allRooms.length)throw Error('Ungültiger Lernpfad');
export const rooms=progression.map(p=>{const at=indices.get(p.id);if(at===undefined)throw Error('Raum fehlt: '+p.id);const room=allRooms[at];return {...room,level:{...room.level,chapter:p.chapter,chapterTitle:chapters[p.chapter-1].title,phase:p.phase}};});
export const solutions=progression.map(p=>allSolutions[indices.get(p.id)]);
export const introductions=progression.map(p=>allIntroductions[indices.get(p.id)]);
