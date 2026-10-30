const fs=require('fs');const p='outputs/nurbis-dungeons/src/study.js';let s=fs.readFileSync(p,'utf8');
s=s.replace("mode:'wall'","mode:'single',pattern:0");
// Keep the established base colours. Remove repeated decorative motifs baked into shared maps.
let a=s.indexOf('if(type===3){for(let j=0;j<12;j++)'),b=s.indexOf('if(type===5){for(let j=0;j<75;j++)',a);s=s.slice(0,a)+s.slice(b);
a=s.indexOf('function strand(');b=s.indexOf('function stone(',a);
s=s.slice(0,a)+String.raw`function strand(parent,points,width,color){const c=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),g=new THREE.TubeGeometry(c,Math.max(20,points.length*5),width,7,false),pos=g.attributes.position,rings=Math.max(20,points.length*5);for(let i=0;i<=rings;i++){const t=i/rings,center=c.getPointAt(t),taper=.08+.92*Math.pow(1-t,.72);for(let j=0;j<=7;j++){const k=i*8+j;pos.setXYZ(k,center.x+(pos.getX(k)-center.x)*taper,center.y+(pos.getY(k)-center.y)*taper,center.z+(pos.getZ(k)-center.z)*taper);}}g.computeVertexNormals();return mesh(g,new THREE.MeshStandardMaterial({color,roughness:.95}),parent);}
function network(parent,rng,density,mycelium=false){
 const edge=rng()*Math.PI*2,origin=[Math.cos(edge)*26,Math.sin(edge)*25],heading=edge+Math.PI+(rng()-.5)*.65;
 const color=mycelium?'#c0b79b':'#ad906a';
 function grow(start,angle,length,width,depth){const points=[[...start,43.35]],angles=[];let x=start[0],y=start[1],turn=(rng()-.5)*.3;const count=Math.max(5,Math.round(length/3.2));
 for(let i=1;i<=count;i++){turn=turn*.55+(rng()-.5)*(mycelium?.5:.34);angle+=turn;const step=length/count*(.8+rng()*.4),nx=x+Math.cos(angle)*step,ny=y+Math.sin(angle)*step;if(Math.abs(nx)>26.2||Math.abs(ny)>24.8)break;x=nx;y=ny;points.push([x,y,43.35+Math.sin(i*.8)*.12]);angles.push(angle);}
 if(points.length<3)return;strand(parent,points,width,color);
 if(depth>0){const branches=1+Math.floor(rng()*(mycelium?4:3)+density*1.4),used=[];for(let k=0;k<branches;k++){const fraction=.23+rng()*.56;const at=Math.min(points.length-2,Math.max(1,Math.round(fraction*(points.length-1))));if(used.includes(at))continue;used.push(at);const side=rng()<.5?-1:1;const branchAngle=angles[at-1]+side*(.5+rng()*.85),branchLength=length*(.18+rng()*.26)*(1-fraction*.35);grow(points[at].slice(0,2),branchAngle,branchLength,width*(.33+rng()*.22),depth-1);}}
 }
 grow(origin,heading,37+rng()*15,(mycelium?.26:.78)*( .8+density*.55),mycelium?3:2);
 if(mycelium&&rng()<.7)grow([origin[0]*.65,origin[1]*.65],heading+(rng()-.5)*1.4,23+rng()*16,.2,2);
}
`+s.slice(b);
s=s.replace('let n=seed+311;','let n=(seed+311+settings.pattern*7297)>>>0;');
a=s.indexOf('if(type===0){for(let j=0;j<Math.round(8+density*30)');b=s.indexOf('if(type===2){',a);
s=s.slice(0,a)+String.raw`if(type===0){const angle=rng()*6.28,cx=Math.cos(angle)*16,cy=Math.sin(angle)*15;for(let j=0;j<Math.round(12+density*40);j++){const a=rng()*6.28,r=Math.sqrt(rng()),xx=cx+Math.cos(a)*r*(6+rng()*9),yy=cy+Math.sin(a)*r*(5+rng()*7);if(Math.abs(xx)>26||Math.abs(yy)>24)continue;const size=.8+rng()*2.6;pebble(group,xx,yy,42.9,size,size*(.7+rng()*.5),.45+rng()*.65,['#78894d','#899858','#657747','#9ba064'][Math.floor(rng()*4)]);}}
if(type===1||type===5)network(group,rng,type===5?density*.65:density,false);
`+s.slice(b);
a=s.indexOf('if(type===3){for(let j=0;j<2+Math.round(density*3)');b=s.indexOf('if(type===5){for(let j=0;j<4+Math.round(density*8)',a);
s=s.slice(0,a)+String.raw`if(type===3){network(group,rng,density,true);if(rng()<.75){const xx=-18+rng()*36,yy=-18+rng()*36;pebble(group,xx,yy,44.5,.7,.7,1.6,'#c7bfa3');pebble(group,xx+.2,yy,46,1.9,1.6,.55,'#b2ad91');}}
if(type===4){const cx=-5+rng()*10,cy=-5+rng()*10,angle=rng()*6.28,length=22+rng()*11,leaves=4+Math.floor(rng()*3);const leafPoint=(u,v)=>[cx+Math.cos(angle)*u-Math.sin(angle)*v,cy+Math.sin(angle)*u+Math.cos(angle)*v,43.12];let bend=(rng()-.5)*4;const stem=[];for(let k=0;k<=7;k++){const u=(k/7-.5)*length;stem.push(leafPoint(u,Math.sin(k/7*Math.PI)*bend));}strand(group,stem,.2,'#79583e');for(let k=0;k<leaves;k++){const u=-length*.36+k/(leaves-1)*length*.7+(rng()-.5)*2,side=rng()<.5?-1:1,reach=3+rng()*5,base=Math.sin((u/length+.5)*Math.PI)*bend;strand(group,[leafPoint(u,base),leafPoint(u+reach*.35,base+side*reach*.6),leafPoint(u+reach*.7,base+side*reach)],.12+rng()*.09,'#806045');if(rng()<.45)strand(group,[leafPoint(u+1,base),leafPoint(u+2,base-side*reach*.45),leafPoint(u+4,base-side*reach*.75)],.11,'#806045');}}
`+s.slice(b);
s=s.replace('stone(t,21+j*3+k,detail,j*72,k*72)','stone(t,193+j*739+k*1951,detail,j*72,k*72)');
s=s.replace("$('#favorite').onclick=", "$('#newPattern').onclick=()=>{settings.pattern++;renderAll();};\n$('#favorite').onclick=");
s=s.replace("nurbi-dungeon-stone-favorite-v1","nurbi-dungeon-material-favorite-v2");
fs.writeFileSync(p,s);
const hp='outputs/nurbis-dungeons/steinstudie.html';let h=fs.readFileSync(hp,'utf8');h=h.replace('MATERIALSTUDIE 02','MATERIALSTUDIE 03').replace('<button id="favorite">','<button id="newPattern">Weitere Ausprägung ↻</button><button id="favorite">').replace('id="single" aria-pressed="false"','id="single" aria-pressed="true"').replace('id="wall" aria-pressed="true"','id="wall" aria-pressed="false"');fs.writeFileSync(hp,h);
fs.appendFileSync('outputs/nurbis-dungeons/study.css','\n#newPattern{margin-top:22px;padding:11px;width:100%;border:1px solid #b5a37d66;border-radius:8px;background:transparent;color:#d5c6a9;font-size:12px}#favorite{margin-top:10px}@media(max-width:800px){#newPattern{grid-column:1/-1}}\n');
