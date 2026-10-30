from pathlib import Path
r=Path('outputs/nurbis-dungeons/src');p=r/'lever-workshop-core.js';s=p.read_text(encoding='utf-8-sig')
s=s.replace("Kippe die eingelassene Bodenwippe um", "Überquere die Bodenwippe von ihrer abgesenkten Seite")
s=s.replace('BODENWIPPE · ANSTOSSEN & UMKIPPEN','BODENWIPPE · RICHTUNG & ÜBERQUEREN')
s=s.replace("return Math.abs(s.p[0]-7)+Math.abs(s.p[1]-3)<=1&&!s.off&&!s.won;", "return eq(s.p,s.off?[8,3]:[6,3])&&!s.won;")
s=s.replace("Stoße den Hebel seitlich an.","Betritt die Wippe von ihrer abgesenkten Seite.")
a=s.index(" if(at(p)==='A')");b=s.index('\n if(blocked(p))',a)
s=s[:a]+''' // While on the rocker, finish the crossing over its newly lowered end.
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
''' +s[b:]
s=s.replace('Stoße den Kipphebel um.','Überquere die Bodenwippe von ihrer abgesenkten Seite.')
s=s.replace("!s.off&&n.off?'Die Wurzel erwacht. Ihr Wachstum bewegt den alten Schieber; der Druck fällt ab.':",'')
p.write_text(s,encoding='utf-8')
p=r/'lever-workshop-app.js';s=p.read_text(encoding='utf-8-sig').replace("'Wippe eingerastet · Schiebewerk frei':'Wippe bereit · Anlage unter Druck'","'Tiefes Ende rechts · Schiebewerk frei':'Tiefes Ende links · Anlage unter Druck'").replace('Auch Hebel und Schiebewerk','Auch Wippe und Schiebewerk');p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/hebelwerkstatt.html');s=p.read_text(encoding='utf-8-sig').replace('Schiebe gegen das Ende der Bodenwippe, um sie umzukippen.','Betritt die Wippe am tiefen Ende und gehe gerade darüber. Vom hohen Ende und von der Seite ist sie gesperrt. Jeder erneute Durchgang schaltet die Anlage zurück.').replace('Bodenwippe · ein Ende hoch, eines tief','Bodenwippe · nur vom tiefen Ende begehbar');p.write_text(s,encoding='utf-8')
