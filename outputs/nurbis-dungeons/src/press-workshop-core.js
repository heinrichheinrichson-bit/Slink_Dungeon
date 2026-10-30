export const workshop={title:'Die gekoppelten Steinriegel',desc:'Öffne den oberen Durchgang, hole den Gartensamen und schalte die Riegel für den unteren Rückweg um.',hint:'Beide Steinriegel reagieren auf dieselbe Wippe. Einer fährt in seine Parknische, der andere in den Durchgang. Plane, auf welcher Seite du danach stehen musst.',theme:'SCHIEBERWERKSTATT · GEKOPPELTE RIEGEL',wall:2,floor:0,seed:927,press:true,lever:true,recesses:[[5,4],[5,6]],map:['###########','###########','#....#..K.#','#....U....#','#....######','#..A.######','#....######','#....W....#','#.P..#..F.#','###########','###########']};
const tile=p=>workshop.map[p[1]]?.[p[0]]??'#';
export function initial(){return {p:[2,8],boxes:[],off:false,key:false,moves:0,won:false,flowers:[]};}
export function blockedRiegel(s,c){return c==='U'?!s.off:c==='W'?s.off:false;}
export function act(s,action){
 if(s.won)return {state:null,reason:'Der Freund ist in Sicherheit.'};
 if(!Array.isArray(action)||Math.abs(action[0])+Math.abs(action[1])!==1)return {state:null,reason:'Gehe auf ein Nachbarfeld.'};
 const [dx,dy]=action,p=[s.p[0]+dx,s.p[1]+dy],c=tile(p);
 if(tile(s.p)==='A'&&(dy!==0||dx!==(s.off?1:-1)))return {state:null,reason:'Überquere die Wippe gerade über das neu abgesenkte Ende.'};
 if(c==='#')return {state:null,reason:'Hier ist eine Wand.'};
 if(blockedRiegel(s,c))return {state:null,hazard:true,reason:'Der Steinriegel sperrt diesen Durchgang. Schalte die Wippe von der passenden Seite um.'};
 if(c==='F'&&!s.key)return {state:null,reason:'Hole zuerst den Gartensamen aus dem oberen Bereich.'};
 const n=structuredClone(s);
 if(c==='A'){
  if(dy!==0||dx!==(s.off?-1:1))return {state:null,reason:'Betritt die Wippe nur vom abgesenkten Ende: '+(s.off?'rechts.':'links.')};
  const next={...s,off:!s.off},exit=tile([p[0]+dx,p[1]+dy]);if(exit==='#'||blockedRiegel(next,exit))return {state:null,reason:'Der Ausgang der Wippe wäre versperrt.'};n.off=!s.off;
 }
 n.p=p;n.moves++;if(c==='K')n.key=true;n.won=c==='F'&&n.key;
 return {state:n,reason:n.won?'Gartensamen und Freund sind wieder zusammen.':c==='A'?(n.off?'Oberer Riegel fährt in die Nische, unterer sperrt den Durchgang. Gehe gerade über die Wippe.':'Unterer Riegel fährt in die Nische, oberer sperrt den Durchgang. Gehe gerade über die Wippe.'):!s.key&&n.key?'Gartensamen gefunden. Kehre zurück zur Wippe: Der Freund wartet unten.':'Beachte die Riegelstellung und die Parknischen.'};
}
