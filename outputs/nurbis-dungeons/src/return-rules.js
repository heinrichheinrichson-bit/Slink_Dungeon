export function createReturnRules(level,start){
 const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],tile=p=>level.map[p[1]]?.[p[0]]??'#',plate=s=>s.boxes.some(b=>tile(b)==='S');
 const open=(s,c)=>c==='G'?s.off:c==='E'?!s.off:plate(s);
 return {initial:()=>({...structuredClone(start),off:false,opened:true,filled:false,key:false,moves:0,won:false,flowers:[]}),act(s,[dx,dy]){
 if(s.won)return {reason:'Der Freund ist in Sicherheit.'};
 if(Math.abs(dx)+Math.abs(dy)!==1)return {reason:'Gehe auf ein Nachbarfeld.'};
 const p=[s.p[0]+dx,s.p[1]+dy],c=tile(p),blocked=(p,n=s)=>tile(p)==='#'||['G','D','E'].includes(tile(p))&&!open(n,tile(p));
 if(tile(s.p)==='A'&&(dy!==0||dx!==(s.off?1:-1)))return {reason:'Überquere die Wippe gerade bis zum anderen Ende.'};
 if(c==='A'){
 if(dy!==0||dx!==(s.off?-1:1))return {reason:'Betritt das abgesenkte Ende der Wippe.'};
 const n=structuredClone(s);n.off=!n.off;const exit=[p[0]+dx,p[1]+dy];
 if(blocked(exit,n)||s.boxes.some(b=>eq(b,exit)))return {reason:'Der Ausgang der Wippe ist versperrt.'};
 if(s.boxes.some(b=>['G','E'].includes(tile(b))&&!open(n,tile(b))))return {reason:'Der Stein blockiert ein schließendes Gitter. Die Wippe bleibt in ihrer Stellung.'};
 n.p=p;n.moves++;return {state:n,reason:n.off?'Transportgitter offen, Zielgitter geschlossen. Gehe gerade weiter.':'Transportgitter geschlossen, Zielgitter offen. Gehe gerade weiter.'};
 }
 if(blocked(p))return {reason:c==='D'?'Dieser Durchgang wird vom Steinsiegel bedient.':['G','E'].includes(c)?'Dieses Gitter wird von der Wippe bedient.':'Hier ist eine Wand.'};
 if(c==='C'&&!s.filled)return {reason:'Der Schacht ist offen. Ein Stein kann einen dauerhaften Tritt bilden.'};
 if(c==='F'&&!s.key)return {reason:'Hole erst den Gartensamen aus der Nische.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));let consumed=false;
 if(bi>=0){const d=[p[0]+dx,p[1]+dy];if(blocked(d)||['A','K','F'].includes(tile(d))||n.boxes.some(b=>eq(b,d)))return {reason:'Der Stein kann hier nicht weitergeschoben werden.'};if(tile(d)==='C'&&!n.filled){n.boxes.splice(bi,1);n.filled=true;consumed=true;}else n.boxes[bi]=d;}
 n.p=p;n.moves++;if(c==='K')n.key=true;n.won=c==='F'&&n.key;
 return {state:n,reason:n.won?'Du hast den Rückweg vorbereitet und den Freund erreicht.':consumed?'Der Stein sitzt fest im Schacht. Er kann das Siegel jetzt nicht mehr bedienen.':!s.key&&n.key?'Samen gefunden. Plane die endgültige Verwendung des Steins.':plate(n)?'Der Stein hält die Samennische offen.':'Achte darauf, welche Wege nach dem nächsten Umschalten erreichbar bleiben.'};
 }};
}
