export function createFractureRescueRules(level,start){
 const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],tile=p=>level.map[p[1]]?.[p[0]]??'#',dirs=[[0,-1],[1,0],[0,1],[-1,0]],seals=[];
 level.map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='S')seals.push([x,y]);}));
 const ready=s=>seals.every(p=>s.boxes.some(b=>eq(b,p)));
 const blocked=(s,p)=>['#',' '].includes(tile(p))||tile(p)==='T'&&s.opened||tile(p)==='G'&&!ready(s);
 function path(s,from,to){const q=[from],prev=new Map([[String(from),null]]);for(let i=0;i<q.length;i++){const p=q[i];if(eq(p,to)){const route=[];let at=p;while(at){route.unshift(at);at=prev.get(String(at));}return route;}for(const d of dirs){const n=[p[0]+d[0],p[1]+d[1]];if(blocked(s,n)||tile(n)==='T'||s.boxes.some(b=>eq(b,n))||prev.has(String(n)))continue;prev.set(String(n),p);q.push(n);}}return null;}
 return {ready,path,initial:()=>({...structuredClone(start),opened:false,collapseStone:false,rescued:false,moves:0,pushes:0,won:false,flowers:[]}),act(s,d){
 if(s.won)return {reason:'Ihr seid beide draußen.'};if(Math.abs(d[0])+Math.abs(d[1])!==1)return {reason:'Ein Feld pro Schritt.'};
 const p=[s.p[0]+d[0],s.p[1]+d[1]],c=tile(p);
 if(blocked(s,p))return {reason:c==='T'?'Die Bretter sind eingebrochen. Hier führt kein Weg mehr hinüber.':c==='G'?'Alle vier Druckplatten müssen den Ausgang offenhalten.':'Hier ist eine Wand.'};
 if(c==='O'){
 if(!s.rescued||!ready(s))return {reason:'Hole den Freund dazu und belege alle Druckplatten.'};
 const friendPath=path(s,level.friend,p),nurbiPath=path(s,s.p,p);if(!friendPath||!nurbiPath)return {reason:'Der Weg ist noch nicht für euch beide frei. Der offene Schacht bleibt unpassierbar.'};
 const n=structuredClone(s);n.escapeRoute=[...friendPath,level.outside];n.nurbiRoute=[...nurbiPath,level.outside];n.escapeDuration=Math.max(n.escapeRoute.length,n.nurbiRoute.length)*.22+.35;n.p=level.outside;n.moves++;n.won=true;return {state:n,reason:'Der sichere Weg ist frei. Nurbi und der Freund gehen gemeinsam hinaus.'};
 }
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));let stoneFell=false;
 if(bi>=0){const to=[p[0]+d[0],p[1]+d[1]];if(blocked(s,to)||['F','G','O'].includes(tile(to))||s.boxes.some(b=>eq(b,to)))return {reason:'Der Stein kann hier nicht weitergeschoben werden.'};if(tile(to)==='T'){n.boxes.splice(bi,1);n.opened=true;n.collapseStone=true;stoneFell=true;}else n.boxes[bi]=to;n.pushes++;}
 const walkedOff=tile(s.p)==='T'&&!s.opened;
 if(walkedOff){n.opened=true;n.collapseStone=false;}
 n.p=p;n.moves++;if(c==='F')n.rescued=true;
 return {state:n,reason:stoneFell?'Unter dem schweren Stein brechen die Bretter sofort. Der Stein ist verloren. Rückgängig stellt ihn wieder her.':walkedOff?'Die Bretter brechen hinter Nurbi ein. Diese Standfläche ist jetzt verloren.':c==='T'?'Die morschen Bretter tragen Nurbi noch. Beim Verlassen brechen sie ein.':c==='F'?'Der Freund ist gefunden. Bereite den sicheren gemeinsamen Weg zum Ausgang vor.':ready(n)?'Der Ausgang ist offen. Erreicht ihn beide über festen Boden.':'Plane auch, welche Standflächen du später noch zum Schieben brauchst.'};
 }};
}
