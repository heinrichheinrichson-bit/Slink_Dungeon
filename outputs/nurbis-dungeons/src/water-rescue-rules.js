export function createWaterRescueRules(level,start){
 const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],tile=p=>level.map[p[1]]?.[p[0]]??'#',dirs=[[0,-1],[1,0],[0,1],[-1,0]],seals=[];
 level.map.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='S')seals.push([x,y]);}));
 const ready=s=>seals.every(p=>s.boxes.some(b=>eq(b,p)));
 const wet=(s,p)=>tile(p)==='U'?!s.off:tile(p)==='W'?s.off:false;
 const water=p=>['U','W'].includes(tile(p));
 const edge=(a,b)=>!(water(a)||water(b))||a[1]===b[1];
 const gateOpen=(s,c)=>c==='G'?ready(s):true;
 const blocked=(s,p)=>['#',' '].includes(tile(p))||wet(s,p)||!gateOpen(s,tile(p));
 function path(s,from,to){const q=[from],prev=new Map([[String(from),null]]);for(let i=0;i<q.length;i++){const p=q[i];if(eq(p,to)){const route=[];let at=p;while(at){route.unshift(at);at=prev.get(String(at));}return route;}for(const d of dirs){const n=[p[0]+d[0],p[1]+d[1]];if(!edge(p,n)||blocked(s,n)||tile(n)==='A'||s.boxes.some(b=>eq(b,n))||prev.has(String(n)))continue;prev.set(String(n),p);q.push(n);}}return null;}
 return {ready,path,initial:()=>({...structuredClone(start),off:false,toggles:0,rescued:false,moves:0,pushes:0,won:false,flowers:[]}),act(s,d){
 if(s.won)return {reason:'Ihr seid beide draußen.'};if(Math.abs(d[0])+Math.abs(d[1])!==1)return {reason:'Ein Feld pro Schritt.'};
 const p=[s.p[0]+d[0],s.p[1]+d[1]],c=tile(p);
 let crossed=false;
 if(tile(s.p)==='A'){
  const entry=s.rockerEntry??(s.off?-1:1);
  if(d[1]!==0)return {reason:'Die Seitenfassung der Wippe ist geschlossen. Gehe vor oder zurück.'};
  if(d[0]===entry){
   const n=structuredClone(s);n.off=!n.off;
   if(blocked(n,p)||tile(p)==='A'||s.boxes.some(b=>eq(b,p)))return {reason:'Das andere Ende ist versperrt. Du kannst auf der Wippe zurückgehen, ohne umzuschalten.'};
   
   n.toggles++;delete n.rockerEntry;s=n;crossed=true;
  }else if(d[0]===-entry){
   if(blocked(s,p)||s.boxes.some(b=>eq(b,p)))return {reason:'Der Rückweg ist versperrt.'};
   const n=structuredClone(s);delete n.rockerEntry;n.p=p;n.moves++;return {state:n,reason:'Zurück vom tiefen Ende. Die Wippe bleibt unverändert.'};
  }
 }
 if(c==='A'){
  if(d[1]!==0||d[0]!==(s.off?-1:1))return {reason:'Die Wippe ist nur vom abgesenkten Ende betretbar. Die Seitenfassung bleibt geschlossen.'};
  const n=structuredClone(s);n.rockerEntry=d[0];n.p=p;n.moves++;return {state:n,reason:'Nurbi steht auf dem tiefen Ende. Weitergehen kippt die Wippe; zurückgehen schaltet nichts.'};
 }
 if(!edge(s.p,p))return {reason:'Der Beckenrand ist geschlossen. Benutze die Treppen an den beiden Enden.'};
 if(blocked(s,p))return {reason:wet(s,p)?'Das Becken ist geflutet. Lege es mit der Wippe trocken.':c==='G'?'Alle vier Druckplatten müssen den Ausgang offenhalten.':'Hier ist eine Wand.'};
 if(c==='O'){
 if(!s.rescued||!ready(s))return {reason:'Hole den Freund dazu und belege alle Druckplatten.'};
 const friendPath=path(s,level.friend,p),nurbiPath=path(s,s.p,p);if(!friendPath||!nurbiPath)return {reason:'Der gemeinsame Rückweg ist noch versperrt. Beide brauchen ein trockenes Becken oder einen Weg über festen Boden.'};
 const n=structuredClone(s);n.escapeRoute=[...friendPath,level.outside];n.nurbiRoute=[...nurbiPath,level.outside];n.escapeDuration=Math.max(n.escapeRoute.length,n.nurbiRoute.length)*.22+.35;n.p=level.outside;n.moves++;n.won=true;return {state:n,reason:'Beide Wege sind frei. Nurbi und der Freund gehen gemeinsam hinaus.'};
 }
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));if(bi>=0){const to=[p[0]+d[0],p[1]+d[1]];if(!edge(p,to)||blocked(s,to)||['A','F','O','G'].includes(tile(to))||s.boxes.some(b=>eq(b,to)))return {reason:'Der Stein kann hier nicht weitergeschoben werden.'};n.boxes[bi]=to;n.pushes++;}
 n.p=p;n.moves++;if(c==='F')n.rescued=true;
 return {state:n,reason:crossed?'Vollständig überquert: Die Wippe kippt und schaltet um.':c==='F'?'Der Freund ist gefunden. Bereite den freien Weg zum Ausgang vor.':ready(n)?'Das Ausgangsgitter ist offen. Prüfe auch den trockenen Weg durch die Becken.':'Plane die Steinplätze, das trockene Becken und die erreichbare Seite der Wippe.'};
 }};
}
