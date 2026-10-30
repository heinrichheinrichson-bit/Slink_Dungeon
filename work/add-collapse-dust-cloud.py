from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig');pos=s.index('for(const type of')
s=s[:pos]+'''// Soft, irregular dust density rather than individual solid specks.
const dustCanvas=document.createElement('canvas');dustCanvas.width=dustCanvas.height=128;
const dustContext=dustCanvas.getContext('2d');
for(let i=0;i<13;i++){const x=64+Math.sin(i*2.4)*19,y=64+Math.cos(i*1.7)*17,r=21+(i%4)*4;const g=dustContext.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,.17)');g.addColorStop(.45,'rgba(255,255,255,.11)');g.addColorStop(1,'rgba(255,255,255,0)');dustContext.fillStyle=g;dustContext.fillRect(0,0,128,128);}
const dustTexture=new THREE.CanvasTexture(dustCanvas);
''' +s[pos:]
a=s.index(' const dust=[];');b=s.index(' const camera=',a)
s=s[:a]+''' const dust=[];for(let i=0;i<14;i++){
  const material=new THREE.SpriteMaterial({map:dustTexture,color:type==='wood'?'#b3a080':'#a8ad9b',transparent:true,opacity:0,depthWrite:false,depthTest:true});
  const cloud=new THREE.Sprite(material);cloud.visible=false;root.add(cloud);dust.push({cloud,index:i});
 }
''' +s[b:]
a=s.index('  item.dust.forEach');b=s.index('  item.nurbi.update',a)
s=s[:a]+'''  item.dust.forEach(({cloud,index:i})=>{
   const age=fall-(.025+i*.023),life=1.35+(i%3)*.12,u=age/life;
   cloud.visible=age>0&&age<life;
   if(!cloud.visible){cloud.material.opacity=0;return;}
   const inside=i<7,z=(inside?-19:7)+age*(inside?35:20),spread=8+age*12;
   cloud.position.set(Math.sin(i*2.4)*spread,Math.cos(i*1.7)*spread,z);
   const size=(inside?17:23)+age*26;cloud.scale.set(size,size*(.8+(i%3)*.11),1);
   cloud.material.rotation=Math.sin(i*1.2)*.6+age*.1;
   cloud.material.opacity=Math.sin(Math.PI*u)**1.15*(inside?.38:.29);
   // Below the lip dust is seen only through the hole. Above it the cloud
   // can expand naturally over the terrain, with ordinary depth occlusion.
   cloud.material.stencilWrite=z<4;cloud.material.stencilWriteMask=0;cloud.material.stencilRef=1;cloud.material.stencilFunc=THREE.EqualStencilFunc;
  });
''' +s[b:];p.write_text(s,encoding='utf-8')
p=Path('outputs/nurbis-dungeons/bruchbodenstudie.html');s=p.read_text(encoding='utf-8-sig').replace('Unter dem Stein brechen die Bretter und fallen mit ihm in die Tiefe.','Unter dem Stein brechen die Bretter und fallen mit ihm in die Tiefe. Eine weiche Staubwolke steigt aus dem Schacht auf.');p.write_text(s,encoding='utf-8')
