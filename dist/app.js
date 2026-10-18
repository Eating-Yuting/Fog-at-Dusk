import {initPoster} from './poster.js';
import {coverPoint,mouthRatio,indexExtended,advanceDwell} from './interaction.js';
const $=id=>document.getElementById(id),canvas=$('glass'),wrap=$('glass-wrap'),video=$('video');
const water=$('water'),wc=water.getContext('2d'),mask=document.createElement('canvas'),mc=mask.getContext('2d',{willReadFrequently:true}),source=document.createElement('canvas'),sc=source.getContext('2d');
const gl=canvas.getContext('webgl',{alpha:false,preserveDrawingBuffer:true,antialias:false});
const state={handTarget:null,beads:[],bg:'monet',color:'#a99375',fog:.72,brush:12,paused:false,evaporate:true,breathing:false,camera:false,starting:false,hand:null,mouth:null,pointer:null,lastPoint:null,dwell:null,drops:[],marks:0,lastTick:0,workerBusy:false,workerReady:false,lastInference:0,session:0};
let worker,stream,toastTimer,lastWetPoint=null,handSeenAt=0,w=1000,h=700,maskDirty=true,sourceDirty=true,initialized=false;
const images={};
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),5000)}
function dismiss(){$('welcome').classList.add('hidden')}
function shader(type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
let program,texSource,texMask,loc;
if(gl){
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 a; varying vec2 uv; void main(){uv=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}'));
 gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision highp float;
 varying vec2 uv; uniform sampler2D picture; uniform sampler2D fogMap; uniform vec2 resolution; uniform float strength;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 void main(){
 float fog=texture2D(fogMap,uv).r*strength;
 vec2 px=uv*resolution; float grain=hash(floor(px));
 vec2 wobble=vec2(hash(floor(px/3.0)),hash(floor(px/3.0)+71.))-0.5;
 vec2 refractUV=clamp(uv+wobble*.004*fog,0.,1.);
 vec3 clear=texture2D(picture,uv).rgb;
 vec2 off=vec2(19.)/resolution*(.45+fog);
 vec3 blur=texture2D(picture,refractUV).rgb*.20;
 blur+=texture2D(picture,refractUV+vec2(off.x,0.)).rgb*.12;
 blur+=texture2D(picture,refractUV-vec2(off.x,0.)).rgb*.12;
 blur+=texture2D(picture,refractUV+vec2(0.,off.y)).rgb*.12;
 blur+=texture2D(picture,refractUV-vec2(0.,off.y)).rgb*.12;
 blur+=texture2D(picture,refractUV+off).rgb*.08;
 blur+=texture2D(picture,refractUV-off).rgb*.08;
 blur+=texture2D(picture,refractUV+vec2(off.x,-off.y)).rgb*.08;
 blur+=texture2D(picture,refractUV+vec2(-off.x,off.y)).rgb*.08;
 vec3 tint=vec3(.89,.80,.64);
 vec3 frosted=mix(blur,tint,.23*fog)+vec3((grain-.5)*.24*fog);
 float mist=smoothstep(0.,.78,fog);
 vec3 color=mix(clear,frosted,mist);
 // Subtle brighter edge where condensed moisture meets a wiped stroke.
 vec2 gradient=vec2(texture2D(fogMap,uv+vec2(2./resolution.x,0.)).r-texture2D(fogMap,uv-vec2(2./resolution.x,0.)).r,texture2D(fogMap,uv+vec2(0.,2./resolution.y)).r-texture2D(fogMap,uv-vec2(0.,2./resolution.y)).r);
 color+=vec3(1.,.91,.73)*length(gradient)*.13-gradient.y*.045;
 float vignette=smoothstep(.30,.83,distance(uv,vec2(.5)));
 color*=1.-vignette*.09;
 float lamp=exp(-distance(uv,vec2(.83,.13))*3.5);
 color=mix(color,vec3(1.,.79,.41),lamp*.09);
 gl_FragColor=vec4(color,1.);
 }`));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 loc={resolution:gl.getUniformLocation(program,'resolution'),strength:gl.getUniformLocation(program,'strength')};
 function texture(unit,name){const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,name),unit);return t}
 texSource=texture(0,'picture');texMask=texture(1,'fogMap');
}else{toast('此浏览器未能启用 WebGL，请用最新版 Chrome 打开。');$('start-camera').disabled=true;$('save').disabled=true;$('make-poster').disabled=true}
function reset(){mc.fillStyle='#000';mc.fillRect(0,0,w,h);state.drops=[];state.beads=[];lastWetPoint=null;state.lastPoint=null;state.dwell=null;maskDirty=true;state.marks=0;wc.clearRect(0,0,w,h)}
function resize(){
 const old=document.createElement('canvas');old.width=mask.width;old.height=mask.height;if(mask.width)old.getContext('2d').drawImage(mask,0,0);
 const rect=wrap.getBoundingClientRect(),scale=Math.min(devicePixelRatio||1,1.5,1600/rect.width);
 w=Math.round(rect.width*scale);h=Math.round(rect.height*scale);
 [canvas,water,mask,source].forEach(c=>{c.width=w;c.height=h});
 if(initialized){mc.drawImage(old,0,0,w,h)}else{reset();initialized=true;}
 maskDirty=true;sourceDirty=true;state.lastPoint=null;state.dwell=null;
 if(gl)gl.viewport(0,0,w,h);
}
// Native object-cover mapping is shared by the video and landmark coordinates.
function drawCover(ctx,asset,mirror=false){const iw=asset.videoWidth||asset.naturalWidth,ih=asset.videoHeight||asset.naturalHeight;if(!iw||!ih)return;const scale=Math.max(w/iw,h/ih),dx=(w-iw*scale)/2,dy=(h-ih*scale)/2;ctx.save();if(mirror){ctx.translate(w,0);ctx.scale(-1,1)}ctx.drawImage(asset,dx,dy,iw*scale,ih*scale);ctx.restore()}
function drawSource(){
 sc.fillStyle=state.color;sc.fillRect(0,0,w,h);
 if(state.bg==='camera'&&state.camera&&video.readyState>=2)drawCover(sc,video,true);
 else if(images[state.bg])drawCover(sc,images[state.bg]);
 sourceDirty=false;
}
function render(){if(!gl)return;if(sourceDirty||state.bg==='camera'&&state.camera&&!state.paused){drawSource();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texSource);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source)}if(maskDirty){gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,texMask);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,mask);maskDirty=false}gl.uniform2f(loc.resolution,w,h);gl.uniform1f(loc.strength,state.fog);gl.drawArrays(gl.TRIANGLES,0,6)}
function breath(p,dt){const x=p.x*w,y=p.y*h,r=Math.min(w,h)*.26;const g=mc.createRadialGradient(x,y,r*.08,x,y,r);g.addColorStop(0,`rgba(255,255,255,${Math.min(.13,dt*.0028)})`);g.addColorStop(.5,`rgba(255,255,255,${Math.min(.065,dt*.0014)})`);g.addColorStop(1,'rgba(255,255,255,0)');mc.fillStyle=g;mc.fillRect(x-r,y-r,r*2,r*2);maskDirty=true}
// A cached feathered tip avoids building a gradient for every stroke sample.
const tip=document.createElement('canvas');tip.width=tip.height=128;
const tc=tip.getContext('2d'),feather=tc.createRadialGradient(64,64,0,64,64,64);
feather.addColorStop(0,'#000');feather.addColorStop(.48,'#000');feather.addColorStop(.7,'rgba(0,0,0,.6)');feather.addColorStop(1,'transparent');tc.fillStyle=feather;tc.fillRect(0,0,128,128);
function wipe(a,b,r){
 const dx=(b.x-a.x)*w,dy=(b.y-a.y)*h,steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/Math.max(1,r*.24)));
 for(let i=0;i<=steps;i++){const x=a.x*w+dx*i/steps,y=a.y*h+dy*i/steps;mc.drawImage(tip,x-r,y-r,r*2,r*2)}maskDirty=true;
}
function gatherWater(a,b,r){
 const dx=(b.x-a.x)*w,dy=(b.y-a.y)*h,len=Math.hypot(dx,dy);
 if(len<.5||lastWetPoint&&Math.hypot((b.x-lastWetPoint.x)*w,(b.y-lastWetPoint.y)*h)<r*.9)return;
 lastWetPoint={...b};
 const moisture=mc.getImageData(Math.min(w-1,Math.max(0,Math.round(b.x*w-dy/len*r))),Math.min(h-1,Math.max(0,Math.round(b.y*h+dx/len*r))),1,1).data[0]/255;
 if(moisture<.08)return;
 // Small beads gather at the lip of the wiped line, not over its clear centre.
 for(const side of [-1,1]){const offset=r*(.79+Math.random()*.16)*side;
  state.beads.push({x:b.x-dy/len*offset/w,y:b.y+dx/len*offset/h,r:(.8+Math.random()*1.7)*w/1000,age:0,life:12000+Math.random()*9000,slide:Math.random()<.14,delay:1200+Math.random()*2600,v:0,trail:[]});
 }if(state.beads.length>180)state.beads.splice(0,state.beads.length-180);
}
function drawing(p,time){if(p.x<0||p.y<0||p.x>1||p.y>1){state.lastPoint=null;return}dismiss();const r=state.brush*w/1000;const prev=state.lastPoint;if(!prev||!state.pointer?.down&&Math.hypot(prev.x-p.x,prev.y-p.y)>.25)state.lastPoint=p;gatherWater(state.lastPoint,p,r);wipe(state.lastPoint,p,r);state.lastPoint={...p};state.dwell=advanceDwell(state.dwell,p,time);if(state.dwell.drop){state.drops.push({x:p.x,y:p.y,v:.015,r:Math.max(.0035,state.brush/3700),age:0,trail:[]});if(state.drops.length>30)state.drops.shift();state.marks++;}const c=$('cursor');c.hidden=false;c.style.left=p.x*100+'%';c.style.top=p.y*100+'%';$('dwell-ring').style.strokeDashoffset=163.36*(1-state.dwell.progress)}
function waterBead(x,y,r,stretch,alpha){
 wc.save();wc.globalAlpha=alpha;wc.translate(x,y);
 wc.fillStyle='rgba(77,58,35,.16)';wc.beginPath();wc.ellipse(.4,r*.25,r,r*stretch,0,0,Math.PI*2);wc.fill();
 const g=wc.createRadialGradient(-r*.28,-r*.4,0,0,0,r*1.5);
 g.addColorStop(0,'rgba(255,251,226,.66)');g.addColorStop(.3,'rgba(251,227,185,.06)');g.addColorStop(.7,'rgba(98,73,44,.12)');g.addColorStop(1,'rgba(255,242,208,.5)');
 wc.fillStyle=g;wc.beginPath();wc.ellipse(0,0,r,r*stretch,0,0,Math.PI*2);wc.fill();
 wc.strokeStyle='rgba(255,248,224,.48)';wc.lineWidth=Math.max(.55,r*.14);wc.beginPath();wc.ellipse(-r*.08,-r*.08,r*.76,r*stretch*.78,0,Math.PI,Math.PI*1.65);wc.stroke();wc.restore();
}
function drawWater(dt){
 wc.clearRect(0,0,w,h);
 for(const d of [...state.beads,...state.drops]){
  const tiny=d.life!==undefined,r=tiny?d.r:d.r*w;
  if(!state.paused){d.age+=dt;
   if(!tiny||d.slide&&d.age>d.delay){const old={x:d.x,y:d.y};d.v=Math.min(tiny ? .026 : .22,d.v+dt*(tiny ? .000002 : .000017));d.y+=d.v*dt/1000;d.x+=Math.sin(d.age*.002)*dt*.00000035;
    wipe(old,d,Math.max(1,r*.38));
    if(!d.trail.length||Math.hypot((d.x-d.trail.at(-1).x)*w,(d.y-d.trail.at(-1).y)*h)>2){d.trail.push(old);if(d.trail.length>44)d.trail.shift();}
   }
  }
  const alpha=tiny?Math.min(1,(d.life-d.age)/2500):1;
  if(d.trail.length>1){wc.save();wc.globalAlpha=Math.max(0,alpha)*.52;wc.lineCap='round';wc.strokeStyle='#fff0cd';wc.lineWidth=tiny ? .65 : 1.1;wc.beginPath();d.trail.forEach((p,i)=>i?wc.lineTo(p.x*w-r*.25,p.y*h):wc.moveTo(p.x*w-r*.25,p.y*h));wc.lineTo(d.x*w-r*.25,d.y*h);wc.stroke();wc.restore()}
  waterBead(d.x*w,d.y*h,r,tiny?1.05:1.75,Math.max(0,alpha));
 }
 state.drops=state.drops.filter(d=>d.y<1.08);state.beads=state.beads.filter(d=>d.age<d.life&&d.y<1.05);
}
let lastFrame=0;
function animate(time){requestAnimationFrame(animate);if(document.hidden)return;const dt=Math.min(70,time-(lastFrame||time));lastFrame=time;
 if(!state.paused){
  if(state.handTarget&&time-handSeenAt<250){const t=state.handTarget,old=state.hand||t;const speed=Math.hypot(t.x-old.x,t.y-old.y);const blend=1-Math.exp(-dt/(speed>.04?32:55));state.hand={x:old.x+(t.x-old.x)*blend,y:old.y+(t.y-old.y)*blend}}else{state.hand=null;state.handTarget=null}
  const point=state.pointer?.down?state.pointer:state.hand;
  if(point){drawing(point,time);$('action-label').textContent=state.dwell?.progress>.1?'STAY A LITTLE · '+Math.min(2,Math.floor(state.dwell.progress*2))+' / 2':'FOLLOW YOUR FINGERTIP'}else{state.lastPoint=null;lastWetPoint=null;state.dwell=null;$('cursor').hidden=true;$('action-label').textContent='DRAG TO REVEAL'}
  if(state.breathing||state.mouth?.open){dismiss();breath(state.mouth?.open?state.mouth:(state.pointer||{x:.5,y:.55}),dt);$('action-label').textContent='A BREATH BECOMES MIST'}
  if(state.evaporate){mc.fillStyle=`rgba(0,0,0,${dt*.000018})`;mc.fillRect(0,0,w,h);maskDirty=true}
 }
 drawWater(dt);render();
 if(state.camera&&state.bg==='camera'&&state.workerReady&&!state.workerBusy&&!state.paused&&time-state.lastInference>50&&video.readyState>=2){
  state.workerBusy=true;state.lastInference=time;const token=state.session;
  createImageBitmap(video,{resizeWidth:640,resizeHeight:Math.round(640*video.videoHeight/video.videoWidth)}).then(bitmap=>{if(token!==state.session||!worker){bitmap.close();return}worker.postMessage({type:'frame',bitmap,time},[bitmap])}).catch(()=>{state.workerBusy=false});
 }
}
function point(event){const r=wrap.getBoundingClientRect();return {x:(event.clientX-r.left)/r.width,y:(event.clientY-r.top)/r.height}}
canvas.addEventListener('pointerdown',e=>{if(state.paused){toast('Resume to keep tracing. / 点击继续流动后擦写');return}canvas.setPointerCapture(e.pointerId);state.pointer={...point(e),down:true};state.lastPoint=null;state.dwell=null;drawing(state.pointer,performance.now());dismiss()});
canvas.addEventListener('pointermove',e=>{state.pointer={...point(e),down:state.pointer?.down||false};if(state.pointer.down&&!state.paused){for(const sample of (e.getCoalescedEvents?.().length?e.getCoalescedEvents():[e]))drawing(point(sample),performance.now())}});
function pointerEnd(){lastWetPoint=null;if(state.pointer)state.pointer.down=false;state.lastPoint=null;state.dwell=null}
canvas.addEventListener('pointerup',pointerEnd);canvas.addEventListener('pointercancel',pointerEnd);canvas.addEventListener('lostpointercapture',pointerEnd);canvas.addEventListener('pointerleave',()=>{if(!state.pointer?.down)state.pointer=null});
function setBackground(bg){if(bg!==state.bg){state.hand=null;state.handTarget=null;state.mouth=null;handSeenAt=0;state.lastPoint=null;state.dwell=null}state.bg=bg;sourceDirty=true;if(state.camera&&!state.paused)$('camera-status').textContent=bg==='camera'?'CAMERA ON · ON-DEVICE':'CAMERA ON · TRACKING PAUSED';document.querySelectorAll('[data-bg]').forEach(b=>{b.classList.toggle('selected',b.dataset.bg===bg);b.setAttribute('aria-pressed',b.dataset.bg===bg)});$('scene-label').textContent={camera:'THIS MOMENT · LIVE',monet:"MONET'S GARDEN",bridge:"MONET'S GARDEN",city:"HARBOUR AT DUSK",solid:'A QUIET COLOUR'}[bg];$('art-credit').textContent=bg==='monet'?'CLAUDE MONET · THE JAPANESE FOOTBRIDGE, 1899':bg==='bridge'?'CLAUDE MONET · WATERLOO BRIDGE, GRAY DAY, 1903':bg==='camera'?'CAMERA · PROCESSED ON YOUR DEVICE':bg==='city'?'HONG KONG · GPT-GENERATED & EDITED':'A COLOUR OF YOUR OWN'}
document.querySelectorAll('[data-bg]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.bg==='camera'&&!state.camera){startCamera();return}setBackground(b.dataset.bg)}));
function setColor(color){state.color=color;document.querySelector('.scene-solid').style.background=color;document.querySelectorAll('[data-color]').forEach(b=>{b.classList.toggle('selected',b.dataset.color===color);b.setAttribute('aria-pressed',b.dataset.color===color)});setBackground('solid')}
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>setColor(b.dataset.color)));$('custom-color').oninput=e=>setColor(e.target.value);
$('fog-strength').oninput=e=>{state.fog=+e.target.value/100;$('fog-value').value=e.target.value+'%'};$('brush-size').oninput=e=>{state.brush=+e.target.value;$('brush-value').value=state.brush<16?'Fine':state.brush<30?'Soft':'Broad'};$('evaporate').onchange=e=>state.evaporate=e.target.checked;$('mouth-threshold').oninput=e=>$('mouth-value').value=+e.target.value<15?'Sensitive':+e.target.value<27?'Medium':'Wide';
$('dismiss').onclick=dismiss;$('reset').onclick=()=>{reset();toast('Clear glass. A fresh moment. / 玻璃清晰，重新开始。')};
function togglePause(){state.paused=!state.paused;state.breathing=false;state.hand=null;state.handTarget=null;state.pointer=null;state.lastPoint=null;state.dwell=null;sourceDirty=true;$('pause').innerHTML=state.paused?'<span>▷</span><span class="button-copy">Let it flow<small>继续流动</small></span>':'<span>Ⅱ</span><span class="button-copy">Hold this moment<small>留住此刻</small></span>';$('pause').setAttribute('aria-pressed',state.paused);$('camera-status').textContent=state.paused?'MOMENT HELD':state.camera?'CAMERA ON · ON-DEVICE':'MOUSE / TOUCH';if(state.paused){$('cursor').hidden=true;toast('A moment held. Change the view, or save it. / 已定格，可换背景或保存。')}}
$('pause').onclick=togglePause;
$('breathe').addEventListener('pointerdown',e=>{if(state.paused)return;$('breathe').setPointerCapture(e.pointerId);state.breathing=true;dismiss()});for(const event of ['pointerup','pointercancel','lostpointercapture'])$('breathe').addEventListener(event,()=>state.breathing=false);
window.addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','BUTTON','SELECT','TEXTAREA','SUMMARY'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();if(!state.paused)state.breathing=true}});window.addEventListener('keyup',e=>{if(e.code==='Space')state.breathing=false});window.addEventListener('blur',()=>{state.breathing=false;pointerEnd()});
$('breathe').addEventListener('click',e=>{if(e.detail===0&&!state.paused){state.breathing=true;setTimeout(()=>state.breathing=false,850)}});
const ambience=$('ambience'),musicToggle=$('music-toggle');ambience.volume=.2;musicToggle.onclick=async()=>{if(ambience.paused){try{await ambience.play();musicToggle.setAttribute('aria-pressed','true');musicToggle.querySelector('.button-copy').innerHTML='Music on<small>音乐已开启</small>'}catch{toast('Music could not start. Try again. / 音乐没能播放，请再试一次。')}}else{ambience.pause();musicToggle.setAttribute('aria-pressed','false');musicToggle.querySelector('.button-copy').innerHTML='Soft music<small>轻柔音乐 · 已关闭</small>'}};
$('help').onclick=()=>$('help-dialog').showModal();$('close-help').onclick=()=>$('help-dialog').close();
function trackingResult(data){state.workerBusy=false;if(state.paused||state.bg!=='camera')return;const map=p=>coverPoint(p.x,p.y,video.videoWidth,video.videoHeight,w,h);
 if(data.face){const f=data.face,m=map({x:(f[13].x+f[14].x)/2,y:(f[13].y+f[14].y)/2});state.mouth={...m,open:mouthRatio(f)>+$('mouth-threshold').value/100}}else state.mouth=null;
 if(data.hand&&indexExtended(data.hand)){const next=map(data.hand[8]);if(!state.handTarget){state.hand=next;state.lastPoint=null;lastWetPoint=null}state.handTarget=next;handSeenAt=performance.now()}else{state.hand=null;state.handTarget=null;lastWetPoint=null}
 $('tracking-status').innerHTML=(data.face?'Face found':'Looking for face')+' · '+(data.hand?'Hand found':'Looking for hand')+'. Point to draw; bend to lift.<small>Keep your face and hand in frame; step back slightly if the cursor ring does not appear.</small><small>让脸和手都入镜；没看到圆圈时，试着稍微后退一点。</small>';
}
async function startCamera(){if(state.camera||state.starting)return;state.starting=true;const token=++state.session;$('start-camera').disabled=true;$('camera-toggle').disabled=true;$('camera-status').textContent='WAITING FOR CAMERA PERMISSION';
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw Error('需要在 localhost 或 HTTPS 页面使用摄像头。');
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});
  if(token!==state.session){stream.getTracks().forEach(t=>t.stop());return}
  video.srcObject=stream;await video.play();state.camera=true;state.starting=false;state.workerReady=false;state.workerBusy=false;document.body.classList.add('camera-on');setBackground('camera');dismiss();$('camera-status').textContent='CAMERA ON · PREPARING TRACKING';$('camera-toggle').innerHTML='<span>◉</span> Turn camera off <span>×</span>';$('camera-toggle').disabled=false;
  worker=new Worker(new URL('./tracking-worker.js',import.meta.url));worker.onmessage=({data})=>{if(token!==state.session)return;if(data.type==='ready'){state.workerReady=true;$('camera-status').textContent='CAMERA ON · ON-DEVICE';toast('Open your mouth to mist. Point to trace. / 张嘴起雾，伸指擦写。')}else if(data.type==='result')trackingResult(data);else{console.error('Tracking initialization:',data.message);state.workerBusy=false;state.workerReady=false;state.hand=null;state.handTarget=null;state.mouth=null;worker?.terminate();worker=null;toast('Tracking unavailable. The camera view and mouse still work. / 可用鼠标擦写。');$('camera-status').textContent='TRACKING UNAVAILABLE · MOUSE / TOUCH';$('tracking-status').textContent='Tracking failed. Restart the camera, or use your mouse. / 可重启镜头或用鼠标。'}};
  worker.onerror=()=>{state.workerBusy=false;state.workerReady=false;state.hand=null;state.handTarget=null;state.mouth=null;worker?.terminate();worker=null;toast('Tracking unavailable. You can still use your mouse. / 可用鼠标擦写。')};worker.postMessage({type:'init'});
  stream.getVideoTracks()[0].onended=()=>stopCamera();
 }catch(e){stopCamera();toast(e.name==='NotAllowedError'?'Camera permission declined. Try mouse or touch. / 可用鼠标或触屏。':e.name==='NotFoundError'?'No camera found. Try mouse or touch. / 未找到镜头，可用鼠标。':'镜头开启失败：'+e.message)}finally{state.starting=false;$('start-camera').disabled=false;$('camera-toggle').disabled=false}
}
function stopCamera(){++state.session;worker?.terminate();worker=null;stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;state.camera=false;state.starting=false;state.workerReady=false;state.workerBusy=false;state.hand=null;state.handTarget=null;state.mouth=null;state.lastPoint=null;state.dwell=null;document.body.classList.remove('camera-on');$('camera-toggle').innerHTML='<span>◉</span> Enable camera <span>↗</span>';$('camera-status').textContent='MOUSE / TOUCH';$('tracking-status').innerHTML='Open your mouth to mist. Point to trace.<small>张嘴起雾，伸出食指擦写 · 画面仅在本机处理</small>';if(state.bg==='camera')setBackground('monet')}
$('start-camera').onclick=startCamera;$('camera-toggle').onclick=()=>state.camera?stopCamera():startCamera();window.addEventListener('pagehide',stopCamera);document.addEventListener('visibilitychange',()=>{if(document.hidden){state.hand=null;state.handTarget=null;state.mouth=null;state.breathing=false;pointerEnd()}});
function captureGlass(){render();const out=document.createElement('canvas');out.width=w;out.height=h;const c=out.getContext('2d');c.drawImage(canvas,0,0);c.drawImage(water,0,0);return out}
initPoster({capture:captureGlass,hold:()=>{if(!state.paused)togglePause()}});
$('save').onclick=()=>{const out=captureGlass();const format=$('format').value;out.toBlob(blob=>{if(!blob){toast('Could not save. Please try again. / 保存失败，请重试。');return}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='breath-'+new Date().toISOString().replace(/[:.]/g,'-')+'.'+(format==='jpeg'?'jpg':'png');a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Saved to your downloads. / 画面已保存到下载文件夹。')},'image/'+format,.94)};
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stopCamera();toast('图形处理暂时中断，请刷新页面重新体验。')});
for(const [key,path] of [['monet','monet-water-lilies.jpg'],['bridge','monet-bridge.jpg'],['city','hong-kong-dusk.png']]){const img=new Image();img.onload=()=>{images[key]=img;if(state.bg===key)sourceDirty=true};img.onerror=()=>toast('Artwork unavailable. Try a quiet colour. / 可先选择纯色背景。');img.src='./assets/'+path}
resize();new ResizeObserver(resize).observe(wrap);requestAnimationFrame(animate);
// Read-only inspection supports deterministic local checks without capturing camera imagery.
window.breathGlass={state,sampleFog:(x,y)=>mc.getImageData(Math.round(x*(w-1)),Math.round(y*(h-1)),1,1).data[0],snapshot:()=>({width:w,height:h,background:state.bg,drops:state.drops.length,camera:state.camera,tracking:state.workerReady,paused:state.paused})};
