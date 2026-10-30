export const workshop={title:'Die schlafende Wurzel',desc:'Verschließe die heiße Öffnung und bringe die ruhende Wurzel zum Leben. Hole danach den Stein für das Siegel zurück.',hint:'Der Dampfstrahl trifft den Durchgang. Auf dem Stein kannst du nicht stehen: Er verschließt die Öffnung, damit du daneben vorbeikommst.',theme:'WURZELWERKSTATT · BERÜHREN & BELEBEN',wall:2,floor:1,seed:719,workshop:true,root:true,recess:[9,6],map:['###########','###########','#....#....#','#....#.A..#','#....V....#','#....H....#','#.....##M##','#.P.B.#...#','#.....#.S##','#######.GF#','###########']};
const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
export function initial(){return {p:[2,7],boxes:[[4,7]],off:false,moves:0,won:false,flowers:[]};}
export function covered(s){return s.boxes.some(b=>eq(b,[5,4]));}
export function hot(s){return !s.off&&!covered(s);}
export function plate(s){return s.boxes.some(b=>eq(b,[8,8]));}
export function canUse(s){return Math.abs(s.p[0]-7)+Math.abs(s.p[1]-3)<=1&&!s.off&&!s.won;}
export function act(s,action){
 if(s.won)return {state:null,reason:'Die Anlage ist entlastet und der Käfer ist frei.'};
 if(action==='valve')return {state:null,reason:'Die Wurzel erwacht, wenn Nurbi ihr Feld betritt.'};
 const [dx,dy]=action;if(Math.abs(dx)+Math.abs(dy)!==1)return {state:null,reason:'Nur benachbarte Felder sind erreichbar.'};
 const p=[s.p[0]+dx,s.p[1]+dy],at=p=>workshop.map[p[1]]?.[p[0]]??' ',blocked=p=>{const c=at(p);return c==='#'||c===' '||(c==='M'&&!s.off)||(c==='G'&&!plate(s));};
 if(blocked(p))return {state:null,reason:at(p)==='M'?'Das Schiebewerk steht unter Druck. Erreiche die ruhende Wurzel.':'Hier ist der Weg versperrt.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));
 if(bi>=0){const dest=[p[0]+dx,p[1]+dy];if(blocked(dest)||at(dest)==='F'||n.boxes.some(b=>eq(b,dest)))return {state:null,reason:'Der Stein lässt sich nicht weiter schieben.'};n.boxes[bi]=dest;}
 // Evaluate steam after the push: covering the opening may make the adjacent jet tile safe.
 if((at(p)==='H'&&hot(n))||(at(p)==='V'&&!n.off))return {state:null,hazard:true,reason:'Heißer Dampf! Nurbi weicht zurück. Der Zug wurde nicht ausgeführt.'};
 n.p=p;n.moves++;if(at(p)==='A')n.off=true;n.won=at(p)==='F';
 return {state:n,reason:!s.off&&n.off?'Die Wurzel erwacht. Ihr Wachstum bewegt den alten Schieber; der Druck fällt ab.':n.won?'Der Käfer ist in Sicherheit.':n.off?'Die Anlage ist drucklos. Nutze den Stein für das Siegel.':covered(n)?'Öffnung abgedeckt. Der Dampfstrahl ist gestoppt.':'Die Öffnung ist heiß. Ein Stein kann sie verschließen.'};
}
