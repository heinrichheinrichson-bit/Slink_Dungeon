export const difficulties={leicht:'Leicht',mittel:'Mittel',anspruchsvoll:'Anspruchsvoll'};
export const difficultyOf=room=>room.level.difficulty||'anspruchsvoll';
export function filterRooms(rooms,slots,difficulty='all',onlyOpen=false,chapter='all'){return rooms.flatMap((r,i)=>(difficulty==='all'||difficultyOf(r)===difficulty)&&(!onlyOpen||!slots[i].solved)&&(chapter==='all'||r.level.chapter===Number(chapter))?[i]:[]);}
export const nextFilteredRoom=(indices,current)=>indices.find(i=>i>current)??-1;
