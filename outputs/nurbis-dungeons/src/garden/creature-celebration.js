/** Short characterful joy gesture; age is seconds since centred arrival. */
export function sampleCelebration(age=-1,style='hops'){
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*x*(x*(x*6-15)+10)};
 const zero={active:false,lift:0,tuck:0,happy:0,look:0,squash:0,pollen:0,antenna:0,pitch:0,roll:0,turnStep:0};if(age<0||age>3.7)return zero;
 if(style==='compact'){
  if(age>1.25)return zero;
  const rise=smooth(age/.22)*(1-smooth((age-.65)/.55));
  return {...zero,active:true,look:smooth(age/.55),happy:rise,tuck:rise*.6,lift:rise*.25,pitch:-rise*.018,roll:Math.sin(age*5)*rise*.012,antenna:rise*.18,squash:rise*.008};
 }
 if(style==='gentle'){
  const rise=smooth((age-.75)/.55)*(1-smooth((age-2.5)/.65));
  const sway=rise*Math.sin((age-.85)*7)*.018;
  return {...zero,active:true,look:smooth((age-.12)/.72),turnStep:Math.sin(Math.PI*Math.max(0,Math.min(1,(age-.06)/.85)))**2,lift:0,tuck:rise*1.35,happy:rise,roll:sway,pitch:-rise*.035,squash:rise*.012,antenna:rise*.3+Math.sin(age*8)*rise*.13,pollen:smooth((age-1.5)/.35)*(1-smooth((age-2.9)/.6))};
 }
 const hop=(start,duration,height)=>{const u=(age-start)/duration;return u>0&&u<1?Math.sin(Math.PI*u)**2*height:0};
 const lift=hop(.92,.5,2.8)+hop(1.55,.8,6.2),happy=smooth((age-.78)/.26)*(1-smooth((age-3.05)/.55));
 const pulse=(start,duration)=>{const u=(age-start)/duration;return u>0&&u<1?Math.sin(u*Math.PI)**2:0};
 const settle=age>2.35?Math.sin((age-2.35)*10)*Math.exp(-(age-2.35)*3.5):0;
 const anticipation=pulse(.72,.3),secondLoad=pulse(1.35,.3),landing=pulse(1.32,.3)+pulse(2.25,.4);
 return {active:true,lift,tuck:Math.min(1,lift/3.5)*1.7,happy,look:smooth((age-.12)/.72),turnStep:Math.sin(Math.PI*Math.max(0,Math.min(1,(age-.06)/.85)))**2,squash:anticipation*.055+secondLoad*.035+landing*.065,pollen:smooth((age-2.35)/.2)*(1-smooth((age-2.9)/.7)),antenna:settle*.65+lift*.045,pitch:anticipation*.035-lift*.007-settle*.013,roll:lift*.005*Math.sin(age*3+.6)+settle*.012};
}
