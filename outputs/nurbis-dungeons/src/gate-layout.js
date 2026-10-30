// Gate leaf spans between its two supporting walls, perpendicular to the walking direction.
export function gateRotation(level,x,y){const wall=(x,y)=>level.map[y]?.[x]==='#';const horizontal=Number(wall(x-1,y))+Number(wall(x+1,y)),vertical=Number(wall(x,y-1))+Number(wall(x,y+1));return vertical>horizontal?Math.PI/2:0;}
