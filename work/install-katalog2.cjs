const fs=require('fs'),assert=require('assert'),rules=require('./katalog2-rules.cjs'),D={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
const specs=[{"key":"mediumA","id":"katalog2-mediumA","title":"Ein Ziel muss warten","difficulty":"mittel","desc":"Drei Steine teilen sich die Zugänge zu ihren Zielplätzen. Nicht jeder früh erreichbare Platz sollte schon belegt bleiben.","hint":"Ein fertiger Zielplatz kann später noch als Arbeitsfläche gebraucht werden.","tags":["Mittel","Schieberätsel"],"rule":"createRescueRules"},{"key":"mediumB","id":"katalog2-mediumB","title":"Die andere Seite","difficulty":"mittel","desc":"Drei Steine stehen zwischen Nurbi und den nötigen Standflächen. Plane den nächsten Seitenwechsel, bevor du den Durchgang zustellst.","hint":"Überlege bei jedem Schieben, wie du danach hinter den nächsten Stein gelangst.","tags":["Mittel","Schieberätsel"],"rule":"createRescueRules"},{"key":"hard1","id":"katalog2-hard1","title":"Vier Wege, wenig Platz","difficulty":"anspruchsvoll","desc":"Vier Steine teilen sich einen engen Arbeitsraum. Finde Zwischenplätze, die den weiteren Transport nicht behindern.","hint":"Plane zunächst die Standflächen, nicht nur die Zielplätze.","tags":["Anspruchsvoll","Schieberätsel"],"rule":"createRescueRules"},{"key":"hard2","id":"katalog2-hard2","title":"Noch nicht am Ziel","difficulty":"anspruchsvoll","desc":"Vier Steine müssen aneinander vorbei. Ein belegtes Ziel ist nicht automatisch ein endgültiger Parkplatz.","hint":"Prüfe, welche Wege durch einen früh abgestellten Stein verschwinden.","tags":["Anspruchsvoll","Schieberätsel"],"rule":"createRescueRules"},{"key":"switch","id":"katalog2-switch","title":"Erst hin, dann zurück","difficulty":"anspruchsvoll","desc":"Die Wippe wechselt zwei Durchgänge. Steintransport und die erreichbare Eintrittsseite müssen zusammenpassen.","hint":"Nach dem Umschalten brauchst du auch wieder Zugang zum tiefen Ende.","tags":["Anspruchsvoll","Wechselgitter"],"rule":"createSwitchRescueRules"},{"key":"boards","id":"katalog2-boards","title":"Bevor der Boden fehlt","difficulty":"anspruchsvoll","desc":"Eine Standfläche trägt Nurbi nur einmal. Bereite die Steinwege vor, die nach dem Einsturz nicht mehr erreichbar wären.","hint":"Welche Arbeit muss auf der anderen Seite erledigt sein, bevor die Bretter brechen?","tags":["Anspruchsvoll","Bruchboden"],"rule":"createFractureRescueRules"}];
let source=`import {createRescueRules} from './rescue-rules.js';\nimport {createSwitchRescueRules} from './switch-rescue-rules.js';\nimport {createFractureRescueRules} from './fracture-rescue-rules.js';\nexport const rooms=[];\nexport const solutions=[];\nexport const introductions=[];\n`,report=[];
for(let i=0;i<specs.length;i++){
 const spec=specs[i],d=JSON.parse(fs.readFileSync(`work/katalog2-${spec.key}.json`)),map=d.map.map(r=>r.split(''));
 if(spec.key==='switch')for(const c of ['A','G','E'])map[d[c][1]][d[c][0]]=c;
 if(spec.key==='boards')map[d.T[1]][d.T[0]]='T';
 const edgeX=Math.max(...map.flatMap(row=>row.flatMap((c,x)=>c==='#'?[]:[x])));
 const base={difficulty:spec.difficulty,title:spec.title,desc:spec.desc,tags:spec.tags,hint:spec.hint,wall:2,floor:1,seed:310010+i*197,collection:true,sunken:true,rescue:true};
 if(spec.key==='switch'){base.switchRescue=true;base.combined=true;base.lever=true;base.connections=[d.G,d.E].map(to=>[d.A,[to[0],d.A[1]],to].filter((p,i,a)=>i===0||String(p)!==String(a[i-1])));}
 if(spec.key==='boards'){base.weight=true;base.fragileWalk=true;}
 const make=rules[spec.rule];let chosen;
 for(const [edge,sign,y] of [1,-1].flatMap(sign=>[7,6,5,4,3,2].map(y=>[sign===1?edgeX:Math.min(...map.flatMap(row=>row.flatMap((c,x)=>c==='#'?[]:[x]))),sign,y]))){
  if(map[y][edge]!=='.')continue;
  const m=map.map(r=>r.slice());m[y][edge+sign]=spec.key==='switch'?'D':'G';m[y][edge+2*sign]='O';if(edge+3*sign>=0&&edge+3*sign<11)m[y][edge+3*sign]=' ';
  const level={...base,friend:[-1,-1],exit:[edge+2*sign,y],outside:[edge+3*sign,y],map:m.map(r=>r.join(''))};
  let room=make(level,d.start),s=room.initial(),occupied=new Set(s.boxes.map(String));for(const l of d.solution){const n=room.act(s,D[l]).state;assert(n,`Invalid source route in ${spec.key}`);s=n;for(const b of s.boxes)occupied.add(String(b));}assert(room.ready(s));
  const candidates=[];m.forEach((row,yy)=>row.forEach((c,x)=>{if(c==='.'&&!occupied.has(String([x,yy]))&&String([x,yy])!==String(d.start.p)&&x<9)candidates.push([x,yy]);}));
  candidates.sort((a,b)=>(Math.abs(a[0]-4)+Math.abs(a[1]-5))-(Math.abs(b[0]-4)+Math.abs(b[1]-5)));
  for(const friend of candidates){if(!room.path(s,s.p,friend)||!room.path(s,friend,level.exit))continue;chosen={level:{...level,friend},map:m,friend};break;}
  if(chosen)break;
 }
 assert(chosen,`No honest rescue route in ${spec.key}`);
 chosen.map[chosen.friend[1]][chosen.friend[0]]='F';
 chosen.level.map=chosen.map.map((row,y)=>row.map((c,x)=>(y===0||y===9||x===0||x===10)&&c!=='O'?' ':c).join(''));
 const level=chosen.level,room={id:spec.id,level,...make(level,d.start)};let s=room.initial(),solution='',vacates=0,collapseStep=null,changes=0;
 function step(l){const n=room.act(s,D[l]).state;assert(n,`Invalid rescue route ${spec.key} at ${s.moves}`);for(const b of s.boxes)if(level.map[b[1]][b[0]]==='S'&&!n.boxes.some(p=>String(p)===String(b)))vacates++;if(!s.opened&&n.opened)collapseStep=n.moves;if(s.off!==n.off)changes++;s=n;solution+=l;}
 function follow(route){assert(route);for(let j=1;j<route.length;j++){const dx=route[j][0]-route[j-1][0],dy=route[j][1]-route[j-1][1];step(Object.keys(D).find(l=>D[l][0]===dx&&D[l][1]===dy));}}
 for(const l of d.solution)step(l);follow(room.path(s,s.p,level.friend));follow(room.path(s,s.p,level.exit));assert(s.won);assert.equal(s.pushes,d.pushes);
 for(const route of [s.escapeRoute,s.nurbiRoute])for(let j=0;j<route.length-1;j++){assert(!s.boxes.some(b=>String(b)===String(route[j])));assert(!['#',' '].includes(level.map[route[j][1]]?.[route[j][0]]));if(level.fragileWalk)assert.notEqual(level.map[route[j][1]][route[j][0]],'T');}
 source+=`{const level=${JSON.stringify(level)};rooms.push({id:${JSON.stringify(spec.id)},level,...${spec.rule}(level,${JSON.stringify(d.start)})});solutions.push(${JSON.stringify(solution)});introductions.push(${JSON.stringify(spec.tags[0]+': '+spec.desc)});}\n`;
 report.push({id:spec.id,title:spec.title,moves:s.moves,pushes:s.pushes,toggles:changes,goalVacates:vacates,collapseStep,friend:level.friend,exit:level.exit,solution});
}
fs.writeFileSync('outputs/nurbis-dungeons/src/katalog2-collection.js',source);fs.writeFileSync('work/katalog2-solutions.json',JSON.stringify(report,null,2));console.log(report.map(({solution,...r})=>r));

