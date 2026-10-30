from pathlib import Path
for name in ['src/rocker-study.js','wippenstudie.html']:
 p=Path('outputs/nurbis-dungeons')/name
 s=p.read_text(encoding='utf-8-sig')
 for ch in 'äöüÄÖÜß·’←→':
  s=s.replace(ch.encode('utf-8').decode('cp1252',errors='replace'),ch)
 s=s.replace('bevelSegments:4,steps:1,','bevelSegments:4,').replace("d.style==='curved'?12.1","d.style==='curved'?13.8")
 p.write_text(s,encoding='utf-8')

