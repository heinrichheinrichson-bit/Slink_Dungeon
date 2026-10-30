export function createRescueRules(level,start){
 const dirs=[[0,-1],[1,0],[0,1],[-1,0]],eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],tile=p=>level.map[p[1]]?.[p[0]]??'#';
 const seals=[];level.map.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='S')seals.push([x,y]);}));
 const ready=s=>seals.every(p=>s.boxes.some(b=>eq(b,p)));
 function path(s,from,to){const q=[from],prev=new Map([[String(from),null]]);for(let i=0;i<q.length;i++){const p=q[i];if(eq(p,to)){const route=[];let at=p;while(at){route.unshift(at);at=prev.get(String(at));}return route;}for(const d of dirs){const n=[p[0]+d[0],p[1]+d[1]],c=tile(n);if(!c||c==='#'||c===' '||c==='G'&&!ready(s)||s.boxes.some(b=>eq(b,n))||prev.has(String(n)))continue;prev.set(String(n),p);q.push(n);}}return null;}
 return {ready,path,initial:()=>({...structuredClone(start),rescued:false,moves:0,pushes:0,won:false,flowers:[]}),act(s,d){
 if(s.won)return {reason:'Ihr seid beide draußen.'};if(Math.abs(d[0])+Math.abs(d[1])!==1)return {reason:'Ein Schritt pro Richtung.'};
 const p=[s.p[0]+d[0],s.p[1]+d[1]],c=tile(p);if(c==='#'||c===' '||!c)return {reason:'Hier ist der Raum begrenzt.'};if(c==='G'&&!ready(s))return {reason:'Alle Druckplatten müssen belegt sein, damit das Ausgangsgitter offen bleibt.'};
 if(c==='O'){
 if(!s.rescued)return {reason:'Hole den Freund dazu, bevor du hinausgehst.'};if(!ready(s))return {reason:'Das Ausgangsgitter ist noch geschlossen.'};const friendPath=path(s,level.friend,p),nurbiPath=path(s,s.p,p);if(!friendPath||!nurbiPath)return {reason:'Der Weg ist noch nicht für euch beide frei.'};
 const n=structuredClone(s);n.escapeRoute=[...friendPath,level.outside];n.nurbiRoute=[...nurbiPath,level.outside];n.escapeDuration=Math.max(n.escapeRoute.length,n.nurbiRoute.length)*.22+.35;n.p=level.outside;n.moves++;n.won=true;return {state:n,reason:'Der Weg ist frei. Nurbi und der Freund gehen durch den Ausgang.'};
 }
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));if(bi>=0){const to=[p[0]+d[0],p[1]+d[1]],t=tile(to);if(['#',' ','F','G','O'].includes(t)||!t||n.boxes.some(b=>eq(b,to)))return {reason:'Der Stein kann hier nicht weiter.'};n.boxes[bi]=to;n.pushes++;}
 n.p=p;n.moves++;if(c==='F')n.rescued=true;
 return {state:n,reason:c==='F'?'Du hast den Freund gefunden. Er wartet hier, bis sein Weg nach draußen frei ist.':ready(n)?'Der Durchgang ist offen. Besuche den Freund und gehe zum Ausgang; er folgt auf dem freien Weg.':'Plane die Steinplätze so, dass auch der Weg nach draußen frei bleibt.'};
 }};
}
