from pathlib import Path
p=Path('outputs/nurbis-dungeons/src/break-study.js');s=p.read_text(encoding='utf-8-sig');old='item.stone.position.set(-72*(1-move),0,wood?woodStoneHeight(fall,stress):11-stress*2-220*stoneFall*stoneFall);';new='''// The front load breaks the timber before the crate covers the whole deck.
  // Its rear remains supported on the approach until it slides fully over the hole.
  const woodX=time<1.65?-72+56*move:-16*(1-smooth(0,.24,fall));
  const woodZ=time<1.65?11:THREE.MathUtils.lerp(11,woodStoneHeight(fall,stress),smooth(-3,0,woodX));
  item.stone.position.set(wood?woodX:-72*(1-move),0,wood?woodZ:11-stress*2-220*stoneFall*stoneFall);''';assert old in s;s=s.replace(old,new);p.write_text(s,encoding='utf-8')
