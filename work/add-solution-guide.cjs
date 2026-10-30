const fs=require('fs');const root='outputs/nurbis-dungeons/';const solution=JSON.parse(fs.readFileSync('work/interlock-solution.json')).solution;fs.writeFileSync(root+'src/interlock-solution.js',`// Verified complete rescue route. One character is one ordinary player move.\nexport const solution=${JSON.stringify(solution)};\n`);
let app=fs.readFileSync(root+'src/interlock-app.js','utf8');app="import {solution} from './interlock-solution.js';\n"+app;const insertion=`
const solutionDirections={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
const solutionStates=[rooms[0].initial()];
for(const letter of solution){const result=rooms[0].act(solutionStates.at(-1),solutionDirections[letter]);if(!result.state)throw Error('Ungültiger Lösungsschritt');solutionStates.push(result.state);}
const solutionKey=s=>JSON.stringify([s.p,s.boxes,s.rescued,s.won]);
function guidePosition(){const s=slots[index].state;return solutionStates[s.moves]&&solutionKey(solutionStates[s.moves])===solutionKey(s)?s.moves:-1;}
function drawGuide(){const at=guidePosition(),onRoute=at>=0;$('solution-step').disabled=!onRoute||at===solution.length;$('solution-progress').textContent=onRoute?'Lösungsschritt '+at+' / '+solution.length:'Du bist von der Musterlösung abgewichen. Gehe mit Rückgängig zurück oder starte den Lösungslauf neu.';}
`;
app=app.replace('let winTimer;',insertion+'\nlet winTimer;').replace('});save();}','});drawGuide();save();}');
app=app.replace("const board=$('board');",`$('solution-step').onclick=()=>{const at=guidePosition();if(at>=0&&at<solution.length)run(solutionDirections[solution[at]]);};
$('solution-restart').onclick=()=>{$('reset').click();message='Lösungslauf am Anfang. Jeder Klick bewegt Nurbi genau ein Feld.';draw();};
const board=$('board');`);
fs.writeFileSync(root+'src/interlock-app.js',app);
let html=fs.readFileSync(root+'verzahnte-wege.html','utf8');html=html.replace('<p id="status" role="status"></p>',`<details class="solution-guide" open><summary>Tester · Schrittweise Lösung</summary><div class="solution-buttons"><button id="solution-step">Nächster Lösungsschritt →</button><button id="solution-restart">Lösung von vorn</button></div><p id="solution-progress" aria-live="polite"></p></details><p id="status" role="status"></p>`).replace('</style>',`.solution-guide{margin-top:14px;padding-top:12px}.solution-guide summary{min-height:30px}.solution-buttons{display:flex;flex-wrap:wrap;gap:8px}.solution-buttons button{font-size:12px;min-height:46px}.solution-guide p{font-size:12px;line-height:1.4;margin:9px 0}#solution-step{background:#c5bd92;color:#263225}@media(max-width:760px){.solution-buttons button{flex:1;padding:8px}.solution-guide{margin-top:10px}}\n</style>`);
fs.writeFileSync(root+'verzahnte-wege.html',html);
const deps='C:/Users/heinr/Documents/Codex/2026-10-12/k/outputs/Slink/node_modules';require(deps+'/esbuild').buildSync({entryPoints:[root+'src/interlock-app.js'],bundle:true,minify:true,outfile:root+'interlock.js',format:'iife'});
