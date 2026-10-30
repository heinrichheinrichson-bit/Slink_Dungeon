// Conservative whole-body clearance: Nurbi descends only after his body has
// cleared the rim. On exit he reaches rim height before his front overlaps it.
export function basinTraversal(progress,mount='flush',stairs=false){
 const gap=mount==='original'?20:0,x=(progress*2-1)*(144+gap),bed=mount==='flush'?-16:-19;
 const innerEdge=mount==='neighbors'?108:101,clearance=40,safeCenter=innerEdge-clearance,a=Math.abs(x);
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
 let z;
 if(stairs&&mount==='flush'){
   // Highest support beneath Nurbi's full silhouette; rise before overlapping
   // each riser, descend only once the trailing body has cleared it.
   const support=Math.abs(x)+clearance;
   z=bed;
   for(const [edge,height] of [[59,7],[73,7],[87,7],[101,6]])z+=height*smooth((support-(edge-4))/4);
   // Bed -16, last tread -10, middle -3, upper 4, shore 11.
   z=Math.min(11,z);
   return {x,z,bed,innerEdge,clearance};
 }

 if(a<safeCenter)z=bed+(11-bed)*smooth((a-(safeCenter-20))/20);
 else {const outer=mount==='original'?125:108,t=Math.max(0,Math.min(1,(a-safeCenter)/(outer+20-safeCenter)));z=11+8*Math.sin(t*Math.PI);}
 return {x,z,bed,innerEdge,clearance};
}
