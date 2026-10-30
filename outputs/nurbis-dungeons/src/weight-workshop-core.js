export const workshop={title:'Zu schwer für den Boden',desc:'Bringe den Stein auf das Siegel. Nurbi kann die rissige Stelle betreten — der schwere Stein nicht.',hint:'Der direkte Schiebeweg führt über brüchigen Boden. Suche einen Umweg und achte darauf, wo Nurbi stehen muss, um den Stein weiterzuschieben.',theme:'BODENWERKSTATT · TRAGFÄHIGKEIT',wall:2,floor:1,seed:1039,weight:true,map:['###########','###########','#......GF##','#...#..S#.#','#.........#','#...BT....#','#.P.......#','#.........#','###########','###########','###########']};
const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1],tile=p=>workshop.map[p[1]]?.[p[0]]??'#';
export function initial(){return {p:[2,6],boxes:[[4,5]],opened:false,filled:false,moves:0,won:false,flowers:[]};}
export function plate(s){return s.boxes.some(b=>eq(b,[7,3]));}
export function act(s,action){
 if(s.won)return {state:null,reason:'Der Freund ist schon frei.'};
 if(!Array.isArray(action)||Math.abs(action[0])+Math.abs(action[1])!==1)return {state:null,reason:'Gehe auf ein Nachbarfeld.'};
 const [dx,dy]=action,p=[s.p[0]+dx,s.p[1]+dy],blocked=p=>tile(p)==='#'||tile(p)==='G'&&!plate(s);
 if(blocked(p))return {state:null,reason:tile(p)==='G'?'Das Tor öffnet sich, wenn der Stein auf dem Siegel steht.':'Hier ist eine Wand.'};
 if(tile(p)==='T'&&s.opened)return {state:null,hazard:true,reason:'Der Boden ist eingebrochen. Nurbi bleibt vor der Öffnung stehen.'};
 const n=structuredClone(s),bi=n.boxes.findIndex(b=>eq(b,p));let collapsed=false;
 if(bi>=0){const dest=[p[0]+dx,p[1]+dy];if(blocked(dest)||tile(dest)==='F'||tile(dest)==='T'&&s.opened||n.boxes.some(b=>eq(b,dest)))return {state:null,reason:'Der Stein lässt sich hier nicht weiterschieben.'};
 if(tile(dest)==='T'){n.boxes.splice(bi,1);n.opened=true;collapsed=true;}else n.boxes[bi]=dest;}
 n.p=p;n.moves++;n.won=tile(p)==='F'&&plate(n);
 return {state:n,reason:collapsed?'Zu schwer! Der Boden bricht ein, der Stein ist verloren. Nutze Rückgängig und suche einen sicheren Schiebeweg.':n.won?'Der sichere Umweg hat den Freund befreit.':tile(p)==='T'?'Der rissige Boden hält Nurbi. Für einen schweren Stein ist er zu schwach.':plate(n)?'Der Stein hält das Siegel. Das Tor ist offen.':'Plane den Schiebeweg und deine Standposition.'};
}
