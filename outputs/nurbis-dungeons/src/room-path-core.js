import * as original from './combined-core.js';
export const level={...original.level,title:'Ein Weg hinein. Ein Weg hinaus.',desc:'Nurbi kommt durch den linken Eingang. Befreie den Käfer und verlasse mit ihm den Raum durch den rechten Ausgang.',hint:original.level.hint,access:{entry:[0,7],entryRotation:Math.PI/2,exit:[10,9],exitRotation:-Math.PI/2,type:'passage'},map:original.level.map.map((r,y)=>y===7?'I'+r.slice(1):y===9?r.slice(0,10)+'O':r)};
export const plate=original.plate;
export const initial=()=>({...original.initial(),rescued:false});
export function act(s,d){if(s.won)return {reason:'Nurbi und sein Freund sind draußen.'};const next=[s.p[0]+d[0],s.p[1]+d[1]],c=level.map[next[1]]?.[next[0]];
 if(c==='O'){if(!s.rescued)return {reason:'Der Käfer wartet noch im Raum.'};if(!plate(s))return {reason:'Der Weg zum Ausgang muss frei bleiben.'};const n=structuredClone(s);n.p=[11,9];n.moves++;n.won=true;return {state:n,reason:'Nurbi und der Käfer verlassen gemeinsam den Raum.'};}
 if(c==='I'){const n=structuredClone(s);n.p=next;n.moves++;return {state:n,reason:'Durch diesen Eingang ist Nurbi hereingekommen. Der Freund wartet noch im Raum.'};}
 const result=original.act(s,d);if(result.state&&result.state.won){result.state.won=false;result.state.rescued=true;result.reason='Der Käfer ist bei dir. Gehe mit ihm durch den Ausgang rechts.';}return result;
}
