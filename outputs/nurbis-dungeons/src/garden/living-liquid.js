import {QUIET_LIQUIDS} from './quiet-liquid-presets.js';
import * as THREE from 'three';
/** Drop-in MeshStandardMaterial for the existing recessed liquid mesh. XY grid, Z up. */
export function createLivingLiquid(type,{animated=true,center=[60,-60],style="flow"}={}){
 const lava=type==='lava',clock={value:0};let material=new THREE.MeshStandardMaterial({color:lava?'#ff6416':'#0875bd',roughness:lava?.45:.24,emissive:lava?'#ed3f08':'#001b35',emissiveIntensity:lava?.28:.05});
 const legacyEffect=lava?"vec2 flow=p+vec2(t*.055,-t*.035);float n=lf(flow+vec2(sin(p.y*.7+t*.12),cos(p.x*.8-t*.1))*.35);float heat=smoothstep(.28,.73,n);vec3 liquid=mix(vec3(.34,.025,.005),vec3(1.,.24,.014),heat);float vein=1.-smoothstep(.018,.068,abs(n-.53));liquid=mix(liquid,vec3(1.,.67,.075),vein*.77);float phase=fract(t*.085+.17);float dist=length(vLiquidXY-uLiquidCenter-vec2(9,-5));float rim=(1.-smoothstep(.6,1.8,abs(dist-phase*12.)))*sin(phase*3.14159)*.6;liquid+=vec3(.38,.19,.015)*rim;diffuseColor.rgb=liquid;":"float a=sin(p.x*1.8+p.y*.65+t*.55)+sin(p.y*2.2-p.x*.45-t*.38);float b=sin(p.x*.9-p.y*1.6+t*.28);float ripple=pow(max(0.,1.-abs(sin(a*1.8+b))),12.);vec3 liquid=mix(vec3(.015,.17,.37),vec3(.025,.43,.65),.5+.22*a);liquid+=vec3(.13,.3,.32)*ripple*.55;float sheen=pow(max(0.,sin(p.x*.45+p.y*.6-t*.22)),16.)*.16;liquid+=vec3(.18,.38,.42)*sheen;float phase=fract(t*.11);float dist=length(vLiquidXY-uLiquidCenter);float ring=(1.-smoothstep(.35,1.35,abs(dist-phase*23.)))*sin(phase*3.14159)*.16;liquid+=vec3(.4,.7,.8)*ring;diffuseColor.rgb=liquid;";
 const effect=QUIET_LIQUIDS[type]?.[style]||legacyEffect;
 material.onBeforeCompile=shader=>{shader.uniforms.uLiquidTime=clock;shader.uniforms.uLiquidCenter={value:new THREE.Vector2(...center)};shader.vertexShader='varying vec2 vLiquidXY;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLiquidXY=position.xy;');shader.fragmentShader=`uniform float uLiquidTime;uniform vec2 uLiquidCenter;varying vec2 vLiquidXY;
 float lh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float ln(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(lh(i),lh(i+vec2(1,0)),f.x),mix(lh(i+vec2(0,1)),lh(i+vec2(1,1)),f.x),f.y);}
 float lf(vec2 p){return ln(p)*.57+ln(p*2.03)*.28+ln(p*4.01)*.15;}
 `+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec2 p=vLiquidXY*.065;float t=uLiquidTime;
 ${effect}`)};
 material.customProgramCacheKey=()=>type+'-'+style+'-2';
 return {material,update(seconds){clock.value=animated?seconds:0;},dispose(){material.dispose()},type};
}
