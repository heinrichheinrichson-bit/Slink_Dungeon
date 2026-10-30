export function createRules(workshop,start){

const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
function initial(){return {p:[2,5],boxes:[[8,5]],opened:false,filled:false,key:false,moves:0,won:false,flowers:[]};}
function act(s,action){
 if(s.won)return {state:null,reason:'Der Freund ist bereits in Sicherheit.'};
 if(!Array.isArray(action)||Math.abs(action[0])+Math.abs(action[1])!==1)return {state:null,reason:'Gehe auf ein Nachbarfeld.'};
 const [dx,dy]=action,p=[s.p[0]+dx,s.p[1]+dy],tile=p=>workshop.map[p[1]]?.[p[0]]??'#';
 if(tile(p)==='#')return {state:null,reason:'Hier ist eine Wand.'};
 if(tile(p)==='F'&&!s.key)return {state:null,reason:'Der Freund wartet hier. Hole zuerst seinen Gartensamen von der anderen Seite.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));let bridge=false;
 if(bi>=0){const dest=[p[0]+dx,p[1]+dy];if(tile(dest)==='#'||tile(dest)==='F'||n.boxes.some(b=>eq(b,dest)))return {state:null,reason:'Der Stein lässt sich hier nicht weiterschieben.'};if(tile(dest)==='C'&&!n.filled){n.boxes.splice(bi,1);n.opened=true;n.filled=true;bridge=true;}else n.boxes[bi]=dest;}
 if(tile(p)==='C'&&n.opened&&!n.filled)return {state:null,hazard:true,reason:'Die Platte ist offen. Nurbi bleibt sicher am Rand. Ein Stein kann die Öffnung füllen.'};
 let collapsed=false;if(tile(s.p)==='C'&&!n.filled&&!n.opened){n.opened=true;collapsed=true;}
 n.p=p;n.moves++;if(tile(p)==='K')n.key=true;n.won=tile(p)==='F'&&n.key;
 return {state:n,reason:n.won?'Samen und Freund sind wieder zusammen.':bridge?'Der Stein sitzt fest in der Öffnung. Der Rückweg ist wieder begehbar.':collapsed?'Die alte Platte klappt hinter Nurbi weg. Der Rückweg ist jetzt unterbrochen.':tile(p)==='C'&&!n.filled?'Die Platte trägt Nurbi noch. Sobald er sie verlässt, klappt sie auf.':!s.key&&n.key?'Gartensamen gefunden. Bringe ihn zurück zum Freund.':'Plane deinen nächsten Schritt.'};
}

const baseInitial=initial;return {initial:()=>({...baseInitial(),...structuredClone(start),moves:0,won:false}),act};
}
