from pathlib import Path
p=Path('outputs/nurbis-dungeons/wippenstudie.html');s=p.read_text(encoding='utf-8');a=s.index('<a href="hebelwerkstatt.html">');b=s.index('</a>',a);s=s[:a]+'<a href="hebelwerkstatt.html">Zur Werkstatt'+s[b:];s=s.replace('Ein Schalter. Kein Loch im Boden.','Bodenwippen · Vier Bauformen');p.write_text(s,encoding='utf-8')
