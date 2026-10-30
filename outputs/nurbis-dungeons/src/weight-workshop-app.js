import {workshop as level,initial,act,plate} from './weight-workshop-core.js';
let state=initial(),history=[],message='Bringe den Stein auf das Siegel. Vermeide die rissige Stelle mit dem Stein.';
const $=s=>document.querySelector(s),canvas=$('#board');
function draw(){window.drawDungeon?.(state,level,100);$('#moves').textContent=state.moves+' Aktionen';$('#status').textContent=message;$('#undo').disabled=!history.length;$('#steamStatus').textContent=state.opened?'BODEN EINGEBROCHEN':'BODEN TRÄGT NURBI';$('#machineStatus').textContent=plate(state)?'Siegel belegt · Tor offen':state.boxes.length?'Stein für das Siegel erhalten':'Stein verloren · Rückgängig möglich';$('.win').hidden=!state.won;$('#wintext').textContent='Du hast einen sicheren Schiebeweg gefunden und den Freund befreit.';canvas.dataset.opened=String(state.opened);canvas.dataset.filled=String(state.filled);canvas.dataset.key=String(state.key);canvas.dataset.moves=String(state.moves);
// Readable 2D fallback while the shared 3D renderer starts.
const c=canvas.getContext('2d'),t=720/11;c.clearRect(0,0,720,720);level.map.forEach((row,y)=>[...row].forEach((ch,x)=>{c.fillStyle=ch==='#'?'#626a63':'#66503c';c.fillRect(x*t+1,y*t+1,t-2,t-2);const icon={T:state.opened?'○':'⌁',S:'◎',G:plate(state)?'·':'▥',F:state.won?'':'🐞'}[ch];if(icon){c.fillStyle='#c5bd91';c.font='30px sans-serif';c.textAlign='center';c.fillText(icon,(x+.5)*t,(y+.65)*t);}}));state.boxes.forEach(([x,y])=>{c.fillStyle='#9aabaf';c.fillRect(x*t+9,y*t+9,t-18,t-18);});c.fillStyle='#e4c48e';c.beginPath();c.arc((state.p[0]+.5)*t,(state.p[1]+.5)*t,16,0,7);c.fill();}
function run(action){const result=act(state,action);if(result.state){history.push(state);state=result.state;if(result.nudge)window.dungeonBump?.(...result.nudge);}else if(result.hazard){window.dungeonBump?.(...action);$('#status').classList.remove('hazard');void $('#status').offsetWidth;$('#status').classList.add('hazard');}message=result.reason;draw();}
$('#title').textContent=level.title;$('#description').textContent=level.desc;$('#hint').textContent=level.hint;$('#theme').textContent=level.theme;
$('#undo').onclick=()=>{if(history.length){state=history.pop();message='Eine Aktion zurück. Auch Boden, Stein und Siegel werden zurückgesetzt.';draw();}};
$('#reset').onclick=()=>{state=initial();history=[];message='Boden und Stein sind wieder im Ausgangszustand.';draw();};$('#next').onclick=()=>$('#reset').click();
document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>run(b.dataset.dir.split(',').map(Number)));
document.addEventListener('keydown',e=>{if(e.target.tagName==='BUTTON'&&[' ','Enter'].includes(e.key))return;const d={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key];if(d){e.preventDefault();run(d);}if(e.key.toLowerCase()==='z')$('#undo').click();if(e.key.toLowerCase()==='r')$('#reset').click();});
let touch;
canvas.addEventListener('pointerdown',e=>{if(e.isPrimary===false)return;touch={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointerup',e=>{if(!touch||e.pointerId!==touch.id)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;
if(Math.max(Math.abs(dx),Math.abs(dy))>15){run(Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)]);return;}
const r=canvas.getBoundingClientRect(),cell=window.pickDungeonCell?.(e.clientX,e.clientY)??[Math.floor((e.clientX-r.left)/r.width*11),Math.floor((e.clientY-r.top)/r.height*11)];if(!cell)return;
const delta=[cell[0]-state.p[0],cell[1]-state.p[1]],distance=Math.abs(delta[0])+Math.abs(delta[1]);if(distance===1)run(delta);else if(distance>1){message='Tippe ein direkt benachbartes Feld an oder wische in eine Richtung.';draw();}});
canvas.addEventListener('pointercancel',()=>touch=null);
window.addEventListener('dungeon-ready',draw);draw();
