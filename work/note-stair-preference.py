from pathlib import Path
p=Path('outputs/nurbis-dungeons/becken-einbaustudie.html');s=p.read_text(encoding='utf-8-sig').replace('Formstudie · Noch keine Einbauart ausgewählt. Die Wasserwerkstatt bleibt vorerst unverändert.','Variante 1 ist bevorzugt · Steintreppe im Vergleich · Die Wasserwerkstatt bleibt vorerst unverändert.');p.write_text(s,encoding='utf-8')
