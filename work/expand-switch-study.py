from pathlib import Path
root=Path('outputs/nurbis-dungeons')
p=root/'src/rocker-study.js';s=p.read_text(encoding='utf-8-sig')
pos=s.index('const $=')
s=s[:pos]+'''const palettes=[
 {name:'Kalk & Salbei',body:'#b1b49c',rim:'#78836c',accent:'#697d60',metal:false},
 {name:'Schiefer & Messing',body:'#627479',rim:'#a08b62',accent:'#c6b17d',metal:true},
 {name:'Ton & Kreide',body:'#a77960',rim:'#736c5a',accent:'#d6c5a2',metal:false},
 {name:'Nachtstein & Silber',body:'#596476',rim:'#7f8c90',accent:'#b7c9c5',metal:true},
 {name:'Humus & Bernstein',body:'#78604e',rim:'#8d8061',accent:'#c4a166',metal:false},
 {name:'Jade & Sand',body:'#789787',rim:'#aa9b79',accent:'#d4c5a2',metal:false}
];
let paletteIndex=0,decor='rills',density=.5;
''' +s[pos:]
s=s.replace("const d=designs[index],renderer=", "const d=designs[index],skin=palettes[paletteIndex],renderer=")
s=s.replace("6,'#777d70'","6,skin.rim").replace("4,'#b0b29f'","4,skin.body").replace("material('#b0b29f')","material(skin.body)").replace("2,'#777d70'","2,skin.rim").replace("material('#aaa995')","material(skin.accent)")
a=s.index(' // The same subtle');b=s.index(" if(d.style==='axis')",a)
s=s[:a]+''' // Surface-following relief: decoration stays attached to every accepted profile.
 function surface(x){
   if(d.style==='compact'||d.style==='axis')return 10.3;
   const curves=d.style==='curved'?[[22.5,8,15,16,-15,16,-22.5,8]]:[[22.5,8,15,14,10,7,0,7],[0,7,-10,7,-15,14,-22.5,8]];
   let nearest=Infinity,z=10;
   for(const c of curves)for(let n=0;n<=180;n++){const t=n/180,u=1-t,px=u*u*u*c[0]+3*u*u*t*c[2]+3*u*t*t*c[4]+t*t*t*c[6];if(Math.abs(px-x)<nearest){nearest=Math.abs(px-x);z=u*u*u*c[1]+3*u*u*t*c[3]+3*u*t*t*c[5]+t*t*t*c[7]}}
   return z+.35;
 }
 const mark=(points,width=.35)=>line(rocker,points.map(([x,y])=>[x,y,surface(x)+.12]),skin.accent,width);
 const amt=Math.round(density*4);
 if(decor==='rills'&&amt)for(const x of [-14,14])for(let j=0;j<amt;j++){const y=(j-(amt-1)/2)*4;mark([[x-3,y],[x+3,y]],.32)}
 if(decor==='inlay'&&amt){
   for(const side of [-1,1])mark([[side*19,-10],[side*20,0],[side*19,10]],.35);
   if(amt>1)for(const side of [-1,1])mark([[side*9,-11],[side*17,-11]],.3);
   if(amt>3)for(const side of [-1,1])mark([[side*9,11],[side*17,11]],.3);
 }
 if(decor==='fern'&&amt){
   mark([[-13,-10],[-11,-5],[-8,1],[-5,8]],.28);
   for(let j=0;j<amt+1;j++){const y=-7+j*3.2,x=-12+j*1.45;mark([[x,y],[x-3.5-j*.2,y+1],[x-4,y+3]],.2);if(j%2===0)mark([[x+1,y+1],[x+4,y+2.6]],.18)}
 }
 if(decor==='mineral'&&amt){
   const chips=[[-17,8,1.3],[-13,10,.7],[-18,4,.6],[15,-9,1.1],[18,-6,.5],[12,-10,.6],[16,-3,.45],[9,-11,.4]];
   for(const [x,y,size] of chips.slice(0,amt*2)){const chip=new THREE.Mesh(new THREE.CircleGeometry(size,5),material(skin.accent));chip.position.set(x,y,surface(x)+.15);rocker.add(chip)}
 }
 if(decor==='seal'&&amt){
   for(const x of [-13,13]){const pts=[];for(let n=0;n<=36;n++){let a=n/36*Math.PI*2;pts.push([x+3.8*Math.cos(a),3.8*Math.sin(a)])}mark(pts,.28);if(amt>1)mark([[x-1.5,0],[x+1.5,0]],.38);if(amt>3)mark([[x,-1.5],[x,1.5]],.38)}
 }
 if(decor==='moss'&&amt){
   const spots=[[-23,18,1.2],[-20.5,19,1.5],[-18,19,.8],[-22,16.5,.8],[-24,15.8,.65],[-16.5,19.5,.7],[-20,17,.9],[-25,18,.7]];
   for(const [x,y,r] of spots.slice(0,amt*2)){const o=new THREE.Mesh(new THREE.SphereGeometry(r,10,7),material('#687850'));o.position.set(x,y,3.3);o.scale.z=.35;base.add(o)}
 }
''' +s[b:]
# Share appearance across all four previews; rebuild using the existing canvas contexts.
pos=s.index('function toggle()')
s=s[:pos]+'''function rebuild(){
 for(const o of [...instances]){o.renderer.dispose();o.scene.traverse(m=>{m.geometry?.dispose();if(m.material)m.material.dispose()})}
 instances.length=0;
 document.querySelectorAll('.choice canvas').forEach((c,i)=>build(c,i));
 detail=build($('#detail'),chosen,true);
 $('#finish-status').textContent=palettes[paletteIndex].name+' · '+$('#decor').selectedOptions[0].textContent+' · '+Math.round(density*100)+' %';
}
palettes.forEach((p,i)=>{const b=document.createElement('button');b.className='swatch';b.setAttribute('aria-pressed',i===0);b.innerHTML=`<i style="background:${p.body}"></i><i style="background:${p.rim}"></i><span>${p.name}</span>`;b.onclick=()=>{paletteIndex=i;document.querySelectorAll('.swatch').forEach((n,j)=>n.setAttribute('aria-pressed',i===j));rebuild()};$('#palettes').append(b)});
$('#decor').onchange=()=>{decor=$('#decor').value;rebuild()};
$('#density').oninput=()=>{density=Number($('#density').value)/100;$('#density-value').textContent=Math.round(density*100)+' %';rebuild()};
$('#neutral').onclick=()=>{paletteIndex=0;decor='none';$('#decor').value='none';document.querySelectorAll('.swatch').forEach((n,j)=>n.setAttribute('aria-pressed',j===0));rebuild()};
''' +s[pos:]
s=s.replace("select(0);toggle();", "select(0);rebuild();toggle();")
p.write_text(s,encoding='utf-8')
p=root/'wippenstudie.html';s=p.read_text(encoding='utf-8-sig').replace('FORMSTUDIE 02','FARBE & DEKOR · STUDIE 03').replace('Bodenwippen · Vier Bauformen','Vier Formen. Eine Welt.').replace('Vier Bauformen im gleichen neutralen Material. Geschlossenes Gehäuse, schmale Fugen und ein klar erkennbarer Kippkörper.','Alle vier Bauformen bleiben. Wir suchen ihre Farben, Materialien und Details — ruhig, natürlich und passend zur Welt unter Nurbis Garten.')
s=s.replace('<section id="choices"', '''<section class="finishes" aria-label="Farbe und Dekoration"><div class="eyebrow">1 · Farbwelt — gilt für alle vier Formen</div><div id="palettes"></div><div class="deco-controls"><div><label for="decor">2 · Dekoration</label><select id="decor"><option value="none">Ganz rein</option><option value="rills" selected>Griffrillen</option><option value="inlay">Feine Einfassung</option><option value="fern">Einzelner Farnabdruck</option><option value="mineral">Mineralsplitter</option><option value="seal">Altes Siegel</option><option value="moss">Moos an einer Rahmenecke</option></select></div><div><label for="density">3 · Stärke <output id="density-value">50 %</output></label><input id="density" type="range" min="0" max="100" step="25" value="50"></div><button id="neutral">Reine Grundform</button></div><p id="finish-status" role="status"></p></section><div class="eyebrow form-label">4 · Bauform auswählen</div><section id="choices"''')
s=s.replace('Vergleiche den Körper, die Fassung und die erkennbare Kippachse. Material und Griffmarken bleiben bei allen vier Formen gleich.','Alle vier Vorschauen zeigen dieselbe Gestaltung. Farbe, Dekor und Stärke lassen sich unabhängig kombinieren. Auch ganz reine Varianten sind möglich.').replace('Entwurfsstudie · Noch keine Designentscheidung · Die spielbare Werkstatt bleibt erhalten.','Vier bestätigte Bauformen · Farb- und Dekorstudie · Mögliche unterschiedliche Schalterfunktionen sind noch offen.')
p.write_text(s,encoding='utf-8')
