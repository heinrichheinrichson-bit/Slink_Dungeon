from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig');a=s.index('   const edge=[[-7,outer]');b=s.index('   const points=edge.map',a)
s=s[:a]+'''   const count=3+(b+si)%3,edge=[[-7,outer],[-7,outer-length+.4]];
   for(let j=1;j<count;j++){
    const dx=-7+14*j/count+Math.sin((b+1)*17+si*11+j*7)*.8;
    const grain=Math.sin((b+1)*31+si*23+j*13)*1.5+Math.cos(b*9+si*5+j*17)*.7;
    edge.push([dx,outer-length+grain]);
   }
   edge.push([7,outer-length+Math.sin(b*14+si*9)*1.1],[7,outer]);
''' +s[b:];p.write_text(s,encoding='utf-8')
