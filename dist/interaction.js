export function coverPoint(x,y,sourceW,sourceH,width,height,mirror=true){
 const scale=Math.max(width/sourceW,height/sourceH);
 return {x:((mirror?1-x:x)*sourceW*scale-(sourceW*scale-width)/2)/width,y:(y*sourceH*scale-(sourceH*scale-height)/2)/height};
}
export function mouthRatio(points){const a=points[13],b=points[14],l=points[61],r=points[291];return Math.hypot(a.x-b.x,a.y-b.y)/Math.max(.001,Math.hypot(l.x-r.x,l.y-r.y))}
export function indexExtended(points){const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);return d(points[8],points[0])>d(points[6],points[0])*1.1}
export function advanceDwell(state,p,time,radius=.016){
 if(!state||Math.hypot(state.x-p.x,state.y-p.y)>radius) return {x:p.x,y:p.y,start:time,fired:false,progress:0,drop:false};
 const progress=Math.min(1,(time-state.start)/3000),drop=progress===1&&!state.fired;
 return {...state,progress,fired:state.fired||drop,drop};
}
