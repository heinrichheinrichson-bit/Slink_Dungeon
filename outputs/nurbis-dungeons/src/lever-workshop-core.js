export const workshop={title:'Die eingelassene Wippe',desc:'Verschließe die Dampföffnung. Überquere die Bodenwippe von ihrer abgesenkten Seite und hole den Stein für das Siegel zurück.',hint:'Der Dampfstrahl trifft den Durchgang. Auf dem Stein kannst du nicht stehen: Er verschließt die Öffnung, damit du daneben vorbeikommst.',theme:'BODENWIPPE · RICHTUNG & ÜBERQUEREN',wall:2,floor:1,seed:719,workshop:true,lever:true,recess:[9,6],map:['###########','###########','#....#....#','#....#.A..#','#....V....#','#....H....#','#.....##M##','#.P.B.#...#','#.....#.S##','#######.GF#','###########']};
const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
export function initial(){return {p:[2,7],boxes:[[4,7]],off:false,moves:0,won:false,flowers:[]};}
export function covered(s){return s.boxes.some(b=>eq(b,[5,4]));}
export function hot(s){return !s.off&&!covered(s);}
export function plate(s){return s.boxes.some(b=>eq(b,[8,8]));}
export function canUse(s){return eq(s.p,s.off?[8,3]:[6,3])&&!s.won;}
export function act(s,action){
 if(s.won)return {state:null,reason:'Die Anlage ist entlastet und der Käfer ist frei.'};
 if(action==='valve')return {state:null,reason:'Betritt die Wippe von ihrer abgesenkten Seite.'};
 const [dx,dy]=action;if(Math.abs(dx)+Math.abs(dy)!==1)return {state:null,reason:'Nur benachbarte Felder sind erreichbar.'};
 const p=[s.p[0]+dx,s.p[1]+dy],at=p=>workshop.map[p[1]]?.[p[0]]??' ',blocked=p=>{const c=at(p);return c==='#'||c===' '||(c==='M'&&!s.off)||(c==='G'&&!plate(s));};
 // While on the rocker, finish the crossing over its newly lowered end.
 // A lateral exit would bypass the directional puzzle rule.
 if(at(s.p)==='A'&&(dy!==0||dx!==(s.off?1:-1)))return {state:null,reason:'Gehe über das jetzt abgesenkte Ende weiter. Die Wippe wird entlang ihrer Kippachse überquert.'};
 if(at(p)==='A'){
   const enter=s.off?-1:1;
   if(dy!==0||dx!==enter)return {state:null,reason:dy!==0?'Die Seitenfassung ist geschlossen. Betritt die Wippe an ihrem abgesenkten Ende.':'Dieses Ende steht hoch. Suche den Weg zur abgesenkten Seite.'};
   if(s.off&&s.boxes.some(b=>at(b)==='M'))return {state:null,reason:'Ein Stein blockiert das Schiebewerk. Die Wippe lässt sich gerade nicht zurückschalten.'};
   const exit=[p[0]+dx,p[1]],exitTile=at(exit),closing=!s.off;
   if(exitTile==='#'||exitTile===' '||exitTile==='A'||(exitTile==='G'&&!plate(s))||(exitTile==='M'&&!closing)||s.boxes.some(b=>eq(b,exit)))return {state:null,reason:'Das andere Ende ist versperrt. Nurbi kann die Wippe nicht überqueren.'};
   const n=structuredClone(s);n.p=p;n.off=!s.off;n.moves++;
   return {state:n,reason:n.off?'Nurbi betritt das tiefe Ende. Die Wippe kippt: Druck abgebaut, Schiebewerk offen. Gehe gerade darüber.':'Nurbi betritt das tiefe Ende. Die Wippe kippt zurück: Die Anlage steht wieder unter Druck. Gehe gerade darüber.'};
 }

 if(blocked(p))return {state:null,reason:at(p)==='M'?'Das Schiebewerk steht unter Druck. Überquere die Bodenwippe von ihrer abgesenkten Seite.':'Hier ist der Weg versperrt.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));
 if(bi>=0){const dest=[p[0]+dx,p[1]+dy];if(blocked(dest)||at(dest)==='A'||at(dest)==='F'||n.boxes.some(b=>eq(b,dest)))return {state:null,reason:'Der Stein lässt sich nicht weiter schieben.'};n.boxes[bi]=dest;}
 // Evaluate steam after the push: covering the opening may make the adjacent jet tile safe.
 if((at(p)==='H'&&hot(n))||(at(p)==='V'&&!n.off))return {state:null,hazard:true,reason:'Heißer Dampf! Nurbi weicht zurück. Der Zug wurde nicht ausgeführt.'};
 n.p=p;n.moves++;n.won=at(p)==='F';
 return {state:n,reason:n.won?'Der Käfer ist in Sicherheit.':n.off?'Die Anlage ist drucklos. Nutze den Stein für das Siegel.':covered(n)?'Öffnung abgedeckt. Der Dampfstrahl ist gestoppt.':'Die Öffnung ist heiß. Ein Stein kann sie verschließen.'};
}
