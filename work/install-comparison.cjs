const fs=require('fs'),assert=require('assert'),rules=require('./expansion-rules.cjs'),D={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
const specs=[
 {key:'leicht',id:'vergleich-ein-platz-auf-zeit',title:'Ein Platz auf Zeit',desc:'Zwei Steine teilen sich einen kleinen Raum. Finde den Freund und halte beide Druckplatten für den Ausgang belegt.',tags:['Leicht · Vergleichsreihe','Zwei Steine'],hint:'Ein Stein am Ziel kann noch im Weg sein. Behalte die Standfläche für den anderen im Blick.',rule:'createRescueRules',difficulty:'leicht'},
 {key:'mittel',id:'vergleich-die-schmale-runde',title:'Die schmale Runde',desc:'Drei Steine müssen durch schmale Verbindungen. Bereite ihre Reihenfolge vor und öffne den gemeinsamen Ausgang.',tags:['Mittel · Vergleichsreihe','Drei Steine'],hint:'Plane, von welcher Seite du jeden Stein als Nächstes schieben musst.',rule:'createRescueRules',difficulty:'mittel'},
 {key:'knifflig',id:'vergleich-erst-platz-schaffen',title:'Erst Platz schaffen',desc:'Vier Steine teilen sich wenige Arbeitsflächen. Plane Zwischenplätze und Seitenwechsel, bevor du die Ziele endgültig belegst.',tags:['Anspruchsvoll · Vergleichsreihe','Vier Steine'],hint:'Der kürzeste Weg zum Ziel lässt nicht unbedingt genug Platz für die anderen Steine.',rule:'createRescueRules',difficulty:'anspruchsvoll'}
];
let source=`import {createRescueRules} from './rescue-rules.js';\nimport {createSwitchRescueRules} from './switch-rescue-rules.js';\nimport {createFractureRescueRules} from './fracture-rescue-rules.js';\nexport const rooms=[];\nexport const solutions=[];\nexport const introductions=[];\n`,report=[];
for(let i=0;i<specs.length;i++){
 const spec=specs[i],d=JSON.parse(fs.readFileSync(`work/vergleich-${spec.key}.json`)),map=d.map.map(r=>r.split(''));
 if(spec.key==='switch')for(const c of ['A','G','E'])map[d[c][1]][d[c][0]]=c;
 if(spec.key==='boards')map[d.T[1]][d.T[0]]='T';
 const edgeX=Math.max(...map.flatMap(row=>row.flatMap((c,x)=>c==='#'?[]:[x])));
 const base={difficulty:spec.difficulty,title:spec.title,desc:spec.desc,tags:spec.tags,hint:spec.hint,wall:2,floor:1,seed:298800+i*173,collection:true,sunken:true,rescue:true};
 if(spec.key==='switch'){base.switchRescue=true;base.combined=true;base.lever=true;base.connections=[d.G,d.E].map(to=>[d.A,[to[0],d.A[1]],to].filter((p,i,a)=>i===0||String(p)!==String(a[i-1])));}
 if(spec.key==='boards'){base.weight=true;base.fragileWalk=true;}
 const make=rules[spec.rule];let chosen;
 for(const y of [7,6,5,4,3,2]){
  if(map[y][edgeX]!=='.')continue;
  const m=map.map(r=>r.slice());m[y][edgeX+1]='G';m[y][edgeX+2]='O';if(edgeX+3<11)m[y][edgeX+3]=' ';
  const level={...base,friend:[-1,-1],exit:[edgeX+2,y],outside:[edgeX+3,y],map:m.map(r=>r.join(''))};
  let room=make(level,d.start),s=room.initial(),occupied=new Set(s.boxes.map(String));for(const l of d.solution){const n=room.act(s,D[l]).state;assert(n,`Invalid source route in ${spec.key}`);s=n;for(const b of s.boxes)occupied.add(String(b));}assert(room.ready(s));
  const candidates=[];m.forEach((row,yy)=>row.forEach((c,x)=>{if(c==='.'&&!occupied.has(String([x,yy]))&&String([x,yy])!==String(d.start.p)&&x<9)candidates.push([x,yy]);}));
  candidates.sort((a,b)=>(Math.abs(a[0]-4)+Math.abs(a[1]-5))-(Math.abs(b[0]-4)+Math.abs(b[1]-5)));
  for(const friend of candidates){if(!room.path(s,s.p,friend)||!room.path(s,friend,level.exit))continue;chosen={level:{...level,friend},map:m,friend};break;}
  if(chosen)break;
 }
 assert(chosen,`No honest rescue route in ${spec.key}`);
 chosen.map[chosen.friend[1]][chosen.friend[0]]='F';
 chosen.level.map=chosen.map.map((row,y)=>row.map((c,x)=>y===0||y===9||x===0||x===10&&c!=='O'?' ':c).join(''));
 const level=chosen.level,room={id:spec.id,level,...make(level,d.start)};let s=room.initial(),solution='',vacates=0,collapseStep=null,changes=0;
 function step(l){const n=room.act(s,D[l]).state;assert(n,`Invalid rescue route ${spec.key} at ${s.moves}`);for(const b of s.boxes)if(level.map[b[1]][b[0]]==='S'&&!n.boxes.some(p=>String(p)===String(b)))vacates++;if(!s.opened&&n.opened)collapseStep=n.moves;if(s.off!==n.off)changes++;s=n;solution+=l;}
 function follow(route){assert(route);for(let j=1;j<route.length;j++){const dx=route[j][0]-route[j-1][0],dy=route[j][1]-route[j-1][1];step(Object.keys(D).find(l=>D[l][0]===dx&&D[l][1]===dy));}}
 for(const l of d.solution)step(l);follow(room.path(s,s.p,level.friend));follow(room.path(s,s.p,level.exit));assert(s.won);assert.equal(s.pushes,d.pushes);
 for(const route of [s.escapeRoute,s.nurbiRoute])for(let j=0;j<route.length-1;j++){assert(!s.boxes.some(b=>String(b)===String(route[j])));assert(!['#',' '].includes(level.map[route[j][1]]?.[route[j][0]]));if(level.fragileWalk)assert.notEqual(level.map[route[j][1]][route[j][0]],'T');}
 source+=`{const level=${JSON.stringify(level)};rooms.push({id:${JSON.stringify(spec.id)},level,...${spec.rule}(level,${JSON.stringify(d.start)})});solutions.push(${JSON.stringify(solution)});introductions.push(${JSON.stringify(spec.tags[0]+': '+spec.desc)});}\n`;
 report.push({id:spec.id,title:spec.title,moves:s.moves,pushes:s.pushes,toggles:changes,goalVacates:vacates,collapseStep,friend:level.friend,exit:level.exit,solution});
}
fs.writeFileSync('outputs/nurbis-dungeons/src/comparison-collection.js',source);fs.writeFileSync('work/comparison-solutions.json',JSON.stringify(report,null,2));console.log(report.map(({solution,...r})=>r));

