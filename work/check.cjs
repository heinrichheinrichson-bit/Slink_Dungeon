const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('outputs/nurbis-dungeons/index.html','utf8');
const ctx=new Proxy({},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const element=()=>({textContent:'',classList:{toggle(){}},getContext:()=>ctx,addEventListener(){},append(){},dataset:{dir:'0,1'}});
const els={};const sandbox={document:{querySelector:s=>els[s]??=element(),querySelectorAll:()=>[],createElement:element,addEventListener(){}},structuredClone,console,window:{addEventListener(){}}};
vm.createContext(sandbox);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],sandbox);
vm.runInContext(`
function key(s){return s.p.join(',')+'|'+s.boxes.map(b=>b.join(',')).sort().join(';');}
levels.forEach((l,i)=>{let start=initial(l),queue=[[start,[]]],seen=new Set([key(start)]),solution;for(let q=0;q<queue.length&&q<100000;q++){let [s,path]=queue[q];if(s.won){solution=path;break;}for(let d of [[0,1],[0,-1],[1,0],[-1,0]]){let n=step(s,l,...d);if(n&&!seen.has(key(n))){seen.add(key(n));queue.push([n,[...path,d]]);}}}if(!solution)throw Error('Unsolvable level '+i);load(i);for(let d of solution)move(...d);if(!state.won)throw Error('Win failed');let finalMoves=state.moves;document.querySelector('#undo').onclick();if(state.won||state.moves!==finalMoves-1)throw Error('Undo failed');document.querySelector('#reset').onclick();if(state.moves!==0||state.won)throw Error('Reset failed');console.log('Room '+(i+1)+': solvable in '+solution.length+' moves; win, undo, reset pass.');});
load(1);if(gateOpen(state,levels[1]))throw Error('Gate should start closed');
`,sandbox);
assert(html.includes('pointerup'));console.log('Script syntax and input bindings verified.');
