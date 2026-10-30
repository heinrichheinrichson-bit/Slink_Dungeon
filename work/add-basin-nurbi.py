from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/basin-mount-study.js');s=p.read_text(encoding='utf-8-sig');s="import {createFuzzyCreature} from './garden/fuzzy-creature.js';\n"+s
s=s.replace('let empty=false,showGrid=false;', 'let empty=true,showGrid=false,progress=.5,playing=false,direction=1,travel=0;')
s=s.replace('items.push({mount,canvas,renderer,scene,camera,root,model:null,grid:null});', "const nurbi=createFuzzyCreature();nurbi.setPalette('apricot');nurbi.setSize(135);scene.add(nurbi.group);items.push({mount,canvas,renderer,scene,camera,root,nurbi,model:null,grid:null});")
s=s.replace("$('fill').onclick=()=>{empty=!empty;$('fill').textContent=empty?'Becken füllen':'Becken leeren'};", "$('fill').onclick=()=>{empty=!empty;playing=false;progress=0;sync();$('fill').textContent=empty?'Becken füllen':'Becken leeren';$('walk').disabled=$('back').disabled=$('position').disabled=!empty;};")
s=s.replace("};rebuild();\nlet last=", "};rebuild();\nfunction sync(){$('position').value=Math.round(progress*100);$('walk-status').textContent=!empty?'Becken gefüllt · Nurbi wartet sicher am Rand.':playing?'Nurbi durchquert die leeren Becken.':progress===0?'Am linken Ufer':progress===1?'Am rechten Ufer':'Position im Übergang: '+Math.round(progress*100)+' %';}\n$('walk').onclick=()=>{empty=true;direction=1;progress=0;playing=true;sync()};$('back').onclick=()=>{empty=true;direction=-1;progress=1;playing=true;sync()};$('position').oninput=()=>{playing=false;progress=Number($('position').value)/100;sync()};$('shore').onclick=()=>{playing=false;progress=0;sync()};sync();\nlet last=")
s=s.replace('last=t;for(const item', "last=t;if(playing){progress=Math.max(0,Math.min(1,progress+direction*dt/5));travel+=dt*200;if(progress===0||progress===1)playing=false;sync();}for(const item")
s=s.replace('item.model.update(empty,t,dt);item.renderer.render', """item.model.update(empty,t,dt);
 const gap=item.mount==='original'?20:0,x=(progress*2-1)*(144+gap),edge=item.mount==='original'?108:103,bed=item.mount==='flush'?-16:-19;
 // A short step down/up at the rim, then feet remain on the real basin bed.
 const blend=THREE.MathUtils.smoothstep(Math.abs(x),edge-20,edge+4),z=THREE.MathUtils.lerp(bed,11,blend);
 item.nurbi.group.position.set(x,0,empty?z:11);item.nurbi.group.rotation.z=direction>0?Math.PI/2:-Math.PI/2;
 item.nurbi.update(t,0,{active:playing,travel,celebrationAge:-1,celebrationStyle:'gentle'});
 item.canvas.setAttribute('aria-description',(empty?'Leeres Becken':'Gefülltes Becken')+' · Nurbi bei '+Math.round(progress*100)+' Prozent');
 item.renderer.render""")
p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/becken-einbaustudie.html');s=p.read_text(encoding='utf-8-sig');s=s.replace('Drei Einbauarten unter denselben Bedingungen. Form, Flüssigkeit und Nachbarmodule direkt miteinander vergleichen.','Drei Einbauarten mit dem Original-Nurbi. Lass ihn durch die leeren Becken laufen oder verschiebe seine Position, um Einstieg, Tiefe und Ausstieg zu vergleichen.')
s=s.replace('id="fill">Becken leeren','id="fill">Becken füllen')
s=s.replace('<div class="grid">','<section class="walk-controls" aria-label="Nurbi im Becken"><button id="walk">Durchlaufen lassen →</button><button id="back">← Zurücklaufen</button><button id="shore">Am Rand aufstellen</button><label for="position">Nurbis Position<input id="position" type="range" min="0" max="100" value="50" step="1"></label><span id="walk-status" role="status"></span></section><div class="grid">')
s=s.replace('</style>','.walk-controls{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:0 0 20px;padding:16px;background:#17231c;border:1px solid #ffffff20;border-radius:12px}.walk-controls label{min-width:180px;flex:1}.walk-controls input{min-height:32px;width:100%;accent-color:#c8bd91}.walk-controls span{flex-basis:100%;font-size:12px;color:#afbaa6}button:disabled,input:disabled{opacity:.4}button{cursor:pointer}</style>')
p.write_text(s,encoding='utf-8')
