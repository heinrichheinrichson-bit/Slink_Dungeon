$path='outputs/nurbis-dungeons/src/rocker-study.js'
$s=Get-Content $path -Raw
$start=$s.IndexOf('const designs=');$end=$s.IndexOf('const $=')
$s=$s.Substring(0,$start)+@"
const designs=[
{name:'Kompakte Wippe',sub:'Geschlossene Fassung',style:'compact',text:'Eine dicke, zusammenhängende Taste sitzt dicht im geschlossenen Gehäuse. Ein schmaler umlaufender Spalt zeigt die bewegliche Wippe; darunter liegt ein fester Unterbau.'},
{name:'Gewölbte Taste',sub:'Runder Rücken',style:'curved',text:'Ein gewölbter Rücken und volle Seitenflächen machen aus der Platte einen Schalterkörper. Das abgesenkte Ende taucht in die eng anliegende Fassung ein.'},
{name:'Gelagerte Wippe',sub:'Sichtbare Mittelachse',style:'axis',text:'Zwei kleine Lager an der Mitte erklären die Kippachse. Die breite Taste bleibt ein einziger geschlossener Körper; das Gehäuse schließt dicht an.'},
{name:'Zwei Druckenden',sub:'Sanfte Mulde in der Mitte',style:'saddle',text:'Eine durchgehende Taste mit zwei breiten Druckenden und einer flachen Mulde über der Achse. Die leicht erhöhten Enden betonen die Bedienrichtung.'}
];
"@ +$s.Substring($end)
$start=$s.IndexOf(' box(base,65,57');$end=$s.IndexOf(' const camera=', $start)
$s=$s.Substring(0,$start)+@"
 // A solid filled housing, rather than an open well. The moving body extends
 // below the floor; only its exposed upper surface and narrow joint are visible.
 box(base,67,64,6,6,'#414940',0,0,-1);
 box(base,56,46,5,6,'#777d70',0,0,1);
 box(base,49,39,4,5,'#51594f',0,0,3);
 const rocker=new THREE.Group();rocker.position.z=2;scene.add(rocker);
 const width=d.style==='compact'?44:45,depth=34;
 if(d.style==='compact'||d.style==='axis'){
   box(rocker,width,depth,20,4,'#b0b29f',0,0,0);
 }else{
   const shape=new THREE.Shape();shape.moveTo(-22.5,-12);shape.lineTo(22.5,-12);shape.lineTo(22.5,8);
   if(d.style==='curved')shape.bezierCurveTo(15,16,-15,16,-22.5,8);
   else {shape.bezierCurveTo(15,14,10,7,0,7);shape.bezierCurveTo(-10,7,-15,14,-22.5,8);}
   shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:30,steps:1,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:1.3,bevelThickness:1.3,curveSegments:24});
   // Extrusion depth becomes Y, profile height becomes Z.
   geo.rotateX(Math.PI/2);geo.translate(0,15,0);
   const body=new THREE.Mesh(geo,material('#b0b29f'));body.castShadow=body.receiveShadow=true;rocker.add(body);
 }
 // The same subtle grip marks on every form keep material comparisons neutral.
 const top=d.style==='curved'?12.1:d.style==='saddle'?10.6:10.3;
 for(const x of [-14,14])for(const y of [-5,0,5])box(rocker,6,.8,.45,.2,'#7d8575',x,y,top);
 if(d.style==='axis')for(const side of [-1,1]){
   box(base,9,6,9,2,'#777d70',0,side*20,4);
   const cap=new THREE.Mesh(new THREE.CylinderGeometry(3,3,1.5,24),material('#aaa995'));cap.position.set(0,side*23.3,5);base.add(cap);
 }
"@ +$s.Substring($end)
$s=$s.Replace('i<6','i<designs.length').Replace("on?.24:-.24","on?.20:-.20")
Set-Content $path $s -Encoding utf8
$p='outputs/nurbis-dungeons/wippenstudie.html';$h=Get-Content $p -Raw
$h=$h.Replace('MATERIALSTUDIE 02','FORMSTUDIE 02').Replace('Eine Wippe. Sechs Charaktere.','Ein Schalter. Kein Loch im Boden.').Replace('Gleiche eingelassene Form, unterschiedliche Materialien und Details. Welche gehört in Nurbis Welt?','Vier Bauformen im gleichen neutralen Material. Geschlossenes Gehäuse, schmale Fugen und ein klar erkennbarer Kippkörper.').Replace('Designvarianten','Bauformen').Replace('Farben und Griffdetails markieren die Enden; Schatten und Vertiefung zeigen die Schaltstellung.','Vergleiche den Körper, die Fassung und die erkennbare Kippachse. Material und Griffmarken bleiben bei allen vier Formen gleich.').Replace('Ein Bodenfeld · gleiche Größe wie im Dungeon','Im Boden eingebaut · kein offener Hohlraum')
Set-Content $p $h -Encoding utf8
Add-Content outputs/nurbis-dungeons/rocker-study.css '#choices{grid-template-columns:repeat(4,1fr)}.choice canvas{height:170px}@media(max-width:800px){#choices{grid-template-columns:repeat(2,1fr)}.choice canvas{height:135px}}'
