import {createRules as steamRules} from './lever-rules.js';
import {createRules as waterRules} from './water-rules.js';
import {createRules as pressRules} from './press-rules.js';
import {createRules as trapRules} from './trap-rules.js';
import * as combo from './combined-core.js';
const base={wall:2,floor:1,seed:1821,collection:true,sunken:true};
export function simpleRules(level,start){
 const tile=p=>level.map[p[1]]?.[p[0]]??'#',eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
 const seals=[];level.map.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='S')seals.push([x,y]);}));
 const ready=s=>seals.every(p=>s.boxes.some(b=>eq(b,p)));
 return {initial:()=>({...structuredClone(start),off:false,opened:false,filled:false,key:false,moves:0,won:false,flowers:[]}),act(s,[dx,dy]){
 if(s.won)return {reason:'Dieser Raum ist geschafft.'};
 if(Math.abs(dx)+Math.abs(dy)!==1)return {reason:'Ein Schritt pro Richtung.'};
 const p=[s.p[0]+dx,s.p[1]+dy],c=tile(p),blocked=p=>tile(p)==='#'||tile(p)==='T'&&s.opened;
 if(blocked(p))return {reason:c==='T'?'Der Boden ist eingebrochen. Hier geht es nicht mehr weiter.':'Hier ist eine Wand.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));
 if(bi>=0){const d=[p[0]+dx,p[1]+dy];if(blocked(d)||tile(d)==='F'||n.boxes.some(b=>eq(b,d)))return {reason:'Der Stein lässt sich hier nicht weiterschieben.'};if(tile(d)==='T'){n.boxes.splice(bi,1);n.opened=true;n.p=p;n.moves++;return {state:n,reason:'Der Stein bricht durch die Bretter und ist verloren. Mit Rückgängig kannst du einen sicheren Weg suchen.'};}n.boxes[bi]=d;}
 n.p=p;n.moves++;n.won=level.sealGoal?ready(n):c==='F'&&ready(n);
 return {state:n,reason:n.won?'Geschafft! Alle nötigen Wege sind gesichert.':c==='F'&&!ready(n)?'Der Freund wartet. Bringe zuerst die Steine auf ihre markierten Ruheplätze.':ready(n)?'Alle Ruheplätze sind belegt. Der Freund wartet auf dich.':c==='T'?'Die alten Bretter tragen Nurbi, aber keinen schweren Stein.':'Plane den nächsten Schub und den Platz zum Umrunden.'};
 }};
}
export const rooms=[];
function add(id,title,desc,tags,extra,start,rules=simpleRules){const level={...base,...extra,title,desc,tags,theme:'RÄTSELREIHE · '+tags.join(' / '),hint:extra.hint||'Du kannst jeden Schritt rückgängig machen. Plane auch, wo Nurbi für den nächsten Schub stehen muss.'};rooms.push({id,level,...rules(level,start)});}
add('ruheplaetze','Zwei freie Wege','Bringe beide Steine auf ihre markierten Ruheplätze. Hier gibt es keine Schalter, Tore oder Gefahren.',['Schieben','Zwei Steine'],{sealGoal:true,map:['###########','###########','#..S......#','#..#.#....#','#..BB.....#','#..#..S...#','#..P......#','#.........#','###########','###########','###########']},{p:[3,6],boxes:[[3,4],[4,4]]});
add('bretter','Der leichte und der schwere Weg','Nurbi darf die Bretter betreten. Bringe den schweren Stein über festen Boden auf seinen Ruheplatz.',['Bruchboden','Sicherer Umweg'],{weight:true,sealGoal:true,map:['###########','###########','#.........#','#...#..S..#','#.........#','#...BT....#','#.P.......#','#.........#','###########','###########','###########']},{p:[2,6],boxes:[[4,5]]});
add('rueckweg','Die Platte hinter dir','Hole den Gartensamen. Die Platte öffnet sich hinter Nurbi; ein Stein muss den Rückweg wiederherstellen.',['Kippboden','Loch füllen'],{trap:true,floor:5,map:['###########','###########','##F###..K.#','#....#.#..#','#....C....#','#.P..#..B.#','#....#....#','#....#.#..#','###########','###########','###########']},{p:[2,5],boxes:[[8,5]]},trapRules);
rooms.push({id:'durchgang',level:{...combo.level,...base,tags:['Wippe','Versenkbare Gitter'],hint:combo.level.hint},initial:combo.initial,act:combo.act});
add('druckwerk','Das vergessene Druckwerk','Verschließe die heiße Öffnung mit dem Stein. Entlaste das Werk über die Wippe und hole den Stein für das Siegel zurück.',['Dampf','Schienen','Wippe'],{workshop:true,lever:true,recess:[9,6],map:['###########','###########','#....#....#','#....#.A..#','#....V....#','#....H....#','#.....##M##','#.P.B.#...#','#.....#.S##','#######.GF#','###########']},{p:[2,8],boxes:[[3,7]]},steamRules);
const channelMap=['###########','###########','#....#..K.#','#....UUU..#','#....######','#..A.######','#....######','#....WWW..#','#.P..#..F.#','###########','###########'];
add('wasser','Die wandernden Wasser','Lege den oberen Kanal trocken und hole den Samen. Für die Rettung musst du anschließend den unteren Weg freigeben.',['Wasser','Becken','Rückschalten'],{water:true,lever:true,basinMount:'flush',floor:0,map:channelMap},{p:[1,8],boxes:[]},waterRules);
add('lava','Unter dem warmen Gestein','Dieselben alten Schleusen führen hier Lava. Hole den Samen und leite sie für den Rückweg wieder in das andere Becken.',['Lava','Becken','Wippe'],{water:true,lever:true,basinMount:'flush',liquidType:'lava',floor:4,seed:1953,map:['###########','###########','#....#K...#','#....UUU..#','#....######','#..A.######','#....######','#....WWW..#','#.P..#...F#','###########','###########']},{p:[2,8],boxes:[]},waterRules);
add('riegel','Zwei Wege, ein Schiebewerk','Die gekoppelten Steinriegel geben abwechselnd einen Weg frei. Hole den Samen und finde zurück zum unteren Durchgang.',['Steinriegel','Schienen','Parknischen'],{press:true,lever:true,recesses:[[5,4],[5,6]],floor:0,map:['###########','###########','#....#..K.#','#....U....#','#....######','#..A.######','#....######','#....W....#','#.P..#..F.#','###########','###########']},{p:[1,7],boxes:[]},pressRules);
