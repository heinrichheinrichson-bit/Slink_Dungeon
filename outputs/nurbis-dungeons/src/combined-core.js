export const level={title:'Der Umweg zum Freund',desc:'Bringe den Stein durch das versenkbare Gitter auf das Siegel. Die Wippe öffnet den Transportweg – aber der Stein muss auf der anderen Seite erst um die Mauer herum.',hint:'Plane die Stellen ein, an denen Nurbi hinter den Stein gelangen muss. Ein Stein an einer Wand lässt sich nicht von dort wegziehen.',theme:'TESTRÄTSEL · WIPPE, STEIN & GITTER',wall:2,floor:1,seed:719,combined:true,map:[
'###########',
'#....#....#',
'#....#....#',
'#..A.#....#',
'#....G..#.#',
'#....##...#',
'#....#....#',
'#....#..S.#',
'#....####D#',
'#....#...F#',
'###########']};
export const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
export const tile=p=>level.map[p[1]]?.[p[0]]??'#';
export const plate=s=>s.boxes.some(b=>tile(b)==='S');
export function initial(){return {p:[2,8],boxes:[[3,7]],off:false,moves:0,pushes:0,won:false,flowers:[]};}
export function gateOpen(s,c){return c==='G'?s.off:plate(s);}
export function act(s,[dx,dy]){
 if(s.won)return {reason:'Der Freund ist in Sicherheit.'};
 if(Math.abs(dx)+Math.abs(dy)!==1)return {reason:'Ein Schritt pro Richtung.'};
 const dest=[s.p[0]+dx,s.p[1]+dy],c=tile(dest),blocked=(p,state=s)=>tile(p)==='#'||(['G','D'].includes(tile(p))&&!gateOpen(state,tile(p)));
 if(tile(s.p)==='A'&&(dy!==0||dx!==(s.off?1:-1)))return {reason:'Überquere die Wippe gerade bis zum anderen Ende.'};
 if(c==='A'){
  if(dy!==0||dx!==(s.off?-1:1))return {reason:'Betritt die Wippe am tiefen Ende. Die Seiten und das hohe Ende sind gesperrt.'};
  const n=structuredClone(s);n.off=!s.off;
  const exit=[dest[0]+dx,dest[1]],occupied=s.boxes.some(b=>tile(b)==='G');
  if(occupied&&!n.off)return {reason:'Der Stein steht im Gitter. Es bleibt versenkt; die Wippe lässt sich so nicht umschalten.'};
  if(blocked(exit,n)||s.boxes.some(b=>eq(b,exit)))return {reason:'Das andere Ende der Wippe ist versperrt.'};
  n.p=dest;n.moves++;return {state:n,reason:n.off?'Die Wippe kippt. Das Transportgitter versinkt. Gehe gerade weiter.':'Die Wippe kippt zurück. Das Transportgitter schließt. Gehe gerade weiter.'};
 }
 if(blocked(dest))return {reason:c==='G'?'Das Transportgitter ist geschlossen. Suche das tiefe Ende der Wippe.':c==='D'?'Das zweite Gitter öffnet sich, solange der Stein auf dem Siegel steht.':'Hier ist eine Wand.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,dest));
 if(bi>=0){const next=[dest[0]+dx,dest[1]+dy];if(blocked(next)||['A','F'].includes(tile(next))||n.boxes.some(b=>eq(b,next)))return {reason:'Der Stein kann hier nicht weiter. Er lässt sich nur schieben.'};n.boxes[bi]=next;n.pushes++;}
 n.p=dest;n.moves++;n.won=c==='F';return {state:n,reason:n.won?'Der kleine Käfer ist frei!':plate(n)?'Das Siegel ist belegt. Der letzte Durchgang ist offen.':bi>=0?'Stein verschoben. Achte auf Platz zum Umrunden.':'Finde den Schiebeweg zum Siegel.'};
}
