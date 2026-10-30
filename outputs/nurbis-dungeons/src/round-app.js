import {difficulties,difficultyOf,filterRooms,nextFilteredRoom} from './collection-catalog.js';
import {rooms,solutions,introductions} from './round-data.js';
import {createRound,directions} from './round-state.js';
const $=id=>document.getElementById(id),qa=new URLSearchParams(location.search).has('qa'),storage='nurbi-spielrunde-v1';
let saved=null;try{if(!qa)saved=JSON.parse(localStorage.getItem(storage));}catch{}
const round=createRound(saved);let difficulty='all',onlyOpen=false;
const eligible=()=>filterRooms(rooms,round.slots,difficulty,onlyOpen);
let screen='overview',busy=0,winTimer,message='';
function save(){if(qa)return;try{localStorage.setItem(storage,JSON.stringify(round.export()));}catch{}}
function overview(){screen='overview';clearTimeout(winTimer);$('overview').hidden=false;$('play').hidden=true;$('home').hidden=true;renderOverview();save();window.scrollTo({top:0,behavior:'auto'});}
function renderOverview(){
 const indices=eligible();$('continue').disabled=!indices.length;
 $('filter-result').textContent=`${indices.length} von ${rooms.length} Rätseln · ${Object.keys(difficulties).map(d=>filterRooms(rooms,round.slots,d).length+' '+d).join(' · ')}`;
 $('empty').hidden=indices.length>0;
 document.querySelectorAll('[data-difficulty]').forEach(b=>{const key=b.dataset.difficulty;b.setAttribute('aria-pressed',String(key===difficulty));const n=filterRooms(rooms,round.slots,key,onlyOpen).length;b.textContent=(key==='all'?'Alle':difficulties[key])+' · '+n;});
 $('overall-progress').textContent=`${round.completed} / ${rooms.length} Freunde gerettet`;
 $('overview-text').textContent=round.completed===rooms.length?`Alle ${rooms.length} Freunde sind wieder draußen. Du kannst jeden Raum erneut besuchen und andere Lösungen ausprobieren.`:`Unter den Gärten haben sich ${rooms.length} Freunde verirrt. Öffne ihre Wege nach draußen – mit Köpfchen und ohne Zeitdruck.`;
 $('continue').textContent=round.completed===rooms.length?'Räume erneut besuchen':round.slots.some(s=>s.state.moves)?'Spielrunde fortsetzen':'Spielrunde beginnen';
 document.querySelectorAll('#room-cards button').forEach((b,i)=>{const slot=round.slots[i];b.hidden=!indices.includes(i);b.querySelector('.card-state').textContent=slot.solved?'Gerettet ✓':slot.state.moves?`${slot.state.moves} Schritte · fortsetzen`:'Noch nicht begonnen';});
}
function select(i){round.select(i);screen='play';busy=0;clearTimeout(winTimer);$('overview').hidden=true;$('play').hidden=false;$('home').hidden=false;$('guide').open=false;message=introductions[i];draw();save();window.scrollTo({top:0,behavior:'auto'});}
function draw(){
 const room=round.room,s=round.slot.state,i=round.index;
 $('overall-progress').textContent=`${round.completed} / ${rooms.length} Freunde gerettet`;
 $('room-select').value=String(i);$('room-label').textContent=`RAUM ${i+1} / ${rooms.length}`;
 $('title').textContent=room.level.title;$('description').textContent=introductions[i];$('hint').textContent=room.level.hint;$('tags').textContent=room.level.tags.join(' · ');
 let count=0,total=0;room.level.map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='S'){total++;if(s.boxes.some(p=>p[0]===x&&p[1]===y))count++;}}));
 $('objective').textContent=`Druckplatten ${count}/${total} · ${s.rescued?'Freund gefunden':'Freund finden'}`;
 $('moves').textContent=`${s.moves} Schritte`;$('status').textContent=message;$('undo').disabled=!round.slot.history.length;
 const at=round.guidePosition(),length=solutions[i].length;$('solution-step').disabled=at<0||at===length;
 $('solution-progress').textContent=at<0?'Abweichung von der Testlösung. Gehe mit Rückgängig zurück oder starte den Lösungslauf neu.':`Lösungsschritt ${at} / ${length}`;
 $('board').dataset.room=room.id;$('board').dataset.position=s.p.join(',');$('board').dataset.won=String(s.won);$('board').dataset.off=String(!!s.off);$('board').dataset.opened=String(!!s.opened);$('board').dataset.moves=String(s.moves);
 if(screen==='play')window.drawDungeon?.(s,room.level,2000+i);
 clearTimeout(winTimer);$('win').hidden=true;
 if(s.won){
  const allDone=round.completed===rooms.length;$('win-title').textContent=allDone?`${rooms.length} Freunde. Wieder draußen.`:'Gemeinsam draußen.';
  $('wintext').textContent=allDone?`Du hast alle ${rooms.length} Räume gelöst und sichere Wege für die Freunde gefunden.`:'Nurbi und der Gartenfreund haben den freien Ausgang erreicht.';
  const next=nextFilteredRoom(eligible(),i);$('next').textContent=next<0?'Zur Raumübersicht':`Weiter zu Raum ${next+1}`;
  const completed=s,index=i;winTimer=setTimeout(()=>{if(screen==='play'&&round.index===index&&round.slot.state===completed)$('win').hidden=false;},(s.escapeDuration||1)*1000);
 }
 save();
}
function run(d){if(screen!=='play'||performance.now()<busy)return;const result=round.act(d);message=result.reason;if(result.state)busy=performance.now()+(result.state.won?(result.state.escapeDuration||1)*1000:190);else window.dungeonBump?.(...d);draw();}
rooms.forEach((room,i)=>{
 const b=document.createElement('button');b.className='room-card';const number=document.createElement('span');number.className='card-number';number.textContent=String(i+1).padStart(2,'0');const title=document.createElement('strong');title.textContent=room.level.title;const text=document.createElement('span');text.textContent=introductions[i];const state=document.createElement('small');state.className='card-state';const badge=document.createElement('small');badge.className='difficulty-badge';badge.textContent=difficulties[difficultyOf(room)];b.append(number,title,badge,text,state);b.onclick=()=>select(i);$('room-cards').append(b);
 const option=document.createElement('option');option.value=String(i);option.textContent=`${i+1} · ${room.level.title}`;$('room-select').append(option);
});
document.querySelectorAll('[data-difficulty]').forEach(b=>b.onclick=()=>{difficulty=b.dataset.difficulty;renderOverview();});
$('only-open').onchange=e=>{onlyOpen=e.target.checked;renderOverview();};
$('continue').onclick=()=>{const ids=eligible();if(!ids.length)return;select(ids.includes(round.index)&&!round.slot.state.won?round.index:ids.find(i=>!round.slots[i].solved)??ids[0]);};
$('home').onclick=overview;$('room-select').onchange=e=>select(Number(e.target.value));
$('undo').onclick=()=>{if(round.undo()){busy=0;message='Ein Schritt zurück. Auch Wasserstände, Wippe und Bruchboden sind wiederhergestellt.';draw();}};
$('reset').onclick=()=>{round.reset();busy=0;message='Dieser Raum steht wieder am Anfang. Dein bisheriger Abschluss bleibt gespeichert.';draw();};
$('next').onclick=()=>{const next=nextFilteredRoom(eligible(),round.index);if(next<0)overview();else select(next);};
$('win-overview').onclick=overview;
$('solution-step').onclick=()=>{const at=round.guidePosition();if(at>=0&&at<solutions[round.index].length)run(directions[solutions[round.index][at]]);};
$('solution-restart').onclick=()=>{round.reset();busy=0;message='Testlösung am Anfang. Jeder Klick führt einen gewöhnlichen Bewegungsschritt aus.';draw();};
document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>run(b.dataset.dir.split(',').map(Number)));
document.addEventListener('keydown',e=>{if(screen!=='play'||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;const d={ArrowUp:directions.U,ArrowRight:directions.R,ArrowDown:directions.D,ArrowLeft:directions.L,w:directions.U,d:directions.R,s:directions.D,a:directions.L}[e.key];if(d){e.preventDefault();run(d);}if(e.key.toLowerCase()==='z')$('undo').click();if(e.key.toLowerCase()==='r')$('reset').click();});
const board=$('board');let pointer;
board.addEventListener('pointerdown',e=>{if(e.isPrimary===false||screen!=='play')return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};board.setPointerCapture(e.pointerId);});
board.addEventListener('pointerup',e=>{if(!pointer||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.max(Math.abs(dx),Math.abs(dy))>15){run(Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)]);return;}const p=window.pickDungeonCell?.(e.clientX,e.clientY);if(!p)return;const s=round.slot.state,d=[p[0]-s.p[0],p[1]-s.p[1]];if(Math.abs(d[0])+Math.abs(d[1])===1)run(d);else{message='Wische in eine Richtung oder tippe ein Nachbarfeld an.';draw();}});
board.addEventListener('pointercancel',()=>pointer=null);
window.addEventListener('dungeon-ready',()=>{if(screen==='play')draw();});overview();
