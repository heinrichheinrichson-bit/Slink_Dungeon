// Technical conduits use the shortest orthogonal route, including through walls.
// Prefer the route with more concealed cells when the two one-bend routes tie.
export function conduitRoute(start,end,map=[]){
 const walk=horizontalFirst=>{const p=[...start],cells=[[...p]];for(const axis of horizontalFirst?[0,1]:[1,0])while(p[axis]!==end[axis]){p[axis]+=Math.sign(end[axis]-p[axis]);cells.push([...p]);}return cells;};
 const a=walk(true),b=walk(false),hidden=cells=>cells.filter(([x,y])=>map[y]?.[x]==='#').length;
 return hidden(b)>hidden(a)?b:a;
}
