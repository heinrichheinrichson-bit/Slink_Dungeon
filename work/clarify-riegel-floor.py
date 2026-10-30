from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/dungeon-rooms.js');s=p.read_text(encoding='utf-8-sig');needle="box(65,138,3,5,'#333d39',X,centerY,10);"
replacement="""// The traversable tile has a continuous load-bearing deck. The parking
 // socket is a dark recessed machine bay, visually distinct from the path.
 box(65,138,3,5,'#333d39',X,centerY,7);
 box(53,66,3,3,'#84928a',X,Y,10);
 for(const yy of [-22,-11,0,11,22])box(42,1.1,.6,.3,'#b2b6a1',X,Y+yy,11.8);
 box(54,59,12,3,'#1c2927',px,py,-2);
 // A fixed cross brace belongs to the non-walkable socket, not the deck.
 for(const sign of [-1,1]){const brace=box(49,3,2,1,'#8f896b',px,py,4);brace.rotation.z=sign*.72;}
"""
assert needle in s;s=s.replace(needle,replacement);p.write_text(s,encoding='utf-8')
