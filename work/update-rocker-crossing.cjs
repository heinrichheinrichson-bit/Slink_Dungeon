const fs=require('fs'),root='outputs/nurbis-dungeons/src/';
for(const file of ['switch-rescue-rules.js','water-rescue-rules.js']){let s=fs.readFileSync(root+file,'utf8');const a=s.indexOf(" if(tile(s.p)==='A'"),b=s.indexOf(file.startsWith('water')?" if(!edge(s.p,p))":" if(blocked(s,p))",a);s=s.slice(0,a)+` let crossed=false;
 if(tile(s.p)==='A'){
  const entry=s.rockerEntry??(s.off?-1:1);
  if(d[1]!==0)return {reason:'Die Seitenfassung der Wippe ist geschlossen. Gehe vor oder zurück.'};
  if(d[0]===entry){
   const n=structuredClone(s);n.off=!n.off;
   if(blocked(n,p)||tile(p)==='A'||s.boxes.some(b=>eq(b,p)))return {reason:'Das andere Ende ist versperrt. Du kannst auf der Wippe zurückgehen, ohne umzuschalten.'};
   ${file.startsWith('switch')?"if(s.boxes.some(b=>!gateOpen(n,tile(b))))return {reason:'Ein Stein steht im schließenden Durchgang. Die Wippe kann nicht kippen; gehe zurück.'};":''}
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
`+s.slice(b);s=s.replace("return {state:n,reason:c==='F'?","return {state:n,reason:crossed?'Vollständig überquert: Die Wippe kippt und schaltet um.':c==='F'?");fs.writeFileSync(root+file,s);}
let p=root+'round-state.js',s=fs.readFileSync(p,'utf8').replace('s.rescued,s.won]','s.rescued,s.won,s.rockerEntry??null]');s=s.replace('slots[i]=structuredClone(slot);',`{slots[i]=structuredClone(slot);if(!saved.rockerRuleVersion&&(room.level.switchRescue||room.level.waterRescue)){for(const state of [slots[i].state,...slots[i].history]){if(room.level.map[state.p[1]]?.[state.p[0]]==='A'){state.rockerEntry=state.off?1:-1;state.off=!state.off;state.toggles=Math.max(0,(state.toggles||0)-1);}}}}`);s=s.replace('return {version:1,ids:', 'return {version:1,rockerRuleVersion:2,ids:');fs.writeFileSync(p,s);
p=root+'dungeon-rooms.js';s=fs.readFileSync(p,'utf8').replace('window.drawDungeon=(s,l,idx)=>','function actorCell(s){const p=xy(s.p);if(s.rockerEntry)p[0]-=s.rockerEntry*18;return p;}\nwindow.drawDungeon=(s,l,idx)=>').replaceAll('const [x,y]=xy(s.p);','const [x,y]=actorCell(s);');fs.writeFileSync(p,s);
