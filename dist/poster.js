const $=id=>document.getElementById(id);
const letters=new Intl.Segmenter(undefined,{granularity:'grapheme'});
export const characters=text=>Array.from(letters.segment(text),part=>part.segment);
const blobOf=(canvas,type='image/png')=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed.')),type,.95));
const loadImage=blob=>new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(blob);img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Could not read this frame.'))};img.src=url});
function database(){return new Promise((resolve,reject)=>{const request=indexedDB.open('fog-at-dusk-film',1);request.onupgradeneeded=()=>request.result.createObjectStore('frames',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function storedFrame(value){const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('frames',value?'readwrite':'readonly'),store=tx.objectStore('frames');const request=value?store.put(value):store.getAll();tx.oncomplete=()=>resolve(request.result);tx.onabort=tx.onerror=()=>reject(tx.error||Error('Storage unavailable.'))})}finally{db.close()}}
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)}
// Wrap words where possible; split a single long word only when it cannot fit.
function lines(ctx,text,width){const result=[];for(const paragraph of text.split('\n')){let line='';for(const token of paragraph.match(/\s+|[A-Za-z0-9’'.,!?-]+|[^\s]/gu)||[]){if(ctx.measureText(line+token).width<=width){line+=token;continue}if(line.trim())result.push(line.trimEnd());line='';for(const char of characters(token.trimStart())){if(ctx.measureText(line+char).width>width){result.push(line);line=''}line+=char}}result.push(line.trimEnd())}return result}
export function initPoster({capture,hold}){
 const canvas=$('poster-canvas'),ctx=canvas.getContext('2d');let draft=null,picture=null,urls=[],busy=false;
 function status(text){$('poster-status').textContent=text}
 function draw(){if(!picture||!draft)return;
  ctx.fillStyle='#f2e9d8';ctx.fillRect(0,0,1200,1800);
  // Quiet paper speckles, deterministic so preview and export remain identical.
  ctx.fillStyle='#92764b';ctx.globalAlpha=.045;for(let i=0;i<13000;i++){const x=(i*7919%12000)/10,y=(i*3571%18000)/10;ctx.fillRect(x,y,1,1)}ctx.globalAlpha=1;
  ctx.fillStyle='#8a7150';ctx.font='17px sans-serif';ctx.fillText('FOG AT DUSK  /  EVENING LETTER',80,82);ctx.textAlign='right';ctx.fillText(new Date(draft.created).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase(),1110,82);ctx.textAlign='left';
  ctx.strokeStyle='#b8a17d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(80,111);ctx.lineTo(1120,111);ctx.stroke();
  ctx.fillStyle='#665036';ctx.font='italic 116px Georgia, serif';ctx.fillText('Fog at Dusk.',76,253);
  ctx.fillStyle='#9b8059';ctx.font='17px sans-serif';ctx.fillText('A LITTLE ROOM TO BREATHE.',83,304);
  const frame={x:80,y:354,w:968,h:938};ctx.fillStyle='#e6d8c0';ctx.fillRect(frame.x,frame.y,frame.w,frame.h);
  const scale=Math.min(frame.w/picture.width,frame.h/picture.height),iw=picture.width*scale,ih=picture.height*scale;
  ctx.drawImage(picture,frame.x+(frame.w-iw)/2,frame.y+(frame.h-ih)/2,iw,ih);
  ctx.strokeStyle='#fffae9';ctx.strokeRect(frame.x+.5,frame.y+.5,frame.w-1,frame.h-1);
  ctx.fillStyle='#695339';ctx.font='54px "Songti SC", "Noto Serif CJK SC", serif';[...'傍晚的大雾天'].forEach((char,i)=>ctx.fillText(char,1075,400+i*70));
  ctx.save();ctx.translate(1107,1267);ctx.rotate(-Math.PI/2);ctx.fillStyle='#9a825c';ctx.font='14px sans-serif';ctx.fillText('BREATHE. TRACE. LET GO.',0,0);ctx.restore();
  ctx.fillStyle='#957b56';ctx.font='16px sans-serif';ctx.fillText('A NOTE TO THIS MOMENT',80,1356);ctx.font='16px "Songti SC", serif';ctx.fillText('写给这一刻',80,1385);
  let size=29,wrapped;do{ctx.font=`${size}px Georgia, "Songti SC", serif`;wrapped=lines(ctx,draft.message,955);if(wrapped.length*(size*1.45)<=244)break;size--}while(size>17);
  if(wrapped.length*size*1.45>244){size=29;ctx.font=`${size}px Georgia, "Songti SC", serif`;wrapped=lines(ctx,draft.message.replace(/\s+/g,' '),955)}
  ctx.fillStyle='#67553e';wrapped.forEach((line,i)=>ctx.fillText(line,80,1440+i*size*1.45));
  ctx.strokeStyle='#beaa88';ctx.beginPath();ctx.moveTo(80,1730);ctx.lineTo(1120,1730);ctx.stroke();
  ctx.fillStyle='#9b825e';ctx.font='14px sans-serif';ctx.fillText('AN EVENING, HELD IN WARM LIGHT.',80,1764);ctx.textAlign='right';ctx.fillText('傍晚的大雾天  /  01',1120,1764);ctx.textAlign='left';
 }
 function setMessage(){const input=$('poster-message'),parts=characters(input.value);if(parts.length>200)input.value=parts.slice(0,200).join('');draft.message=input.value;$('message-count').value=characters(input.value).length+' / 200';draw();status('')}
 async function open(record){try{hold();draft=record?{...record}:{id:crypto.randomUUID(),created:Date.now(),message:'',shot:await blobOf(capture())};picture=await loadImage(draft.shot);$('poster-message').value=draft.message;setMessage();$('collection-dialog').close();$('poster-dialog').showModal()}catch(error){$('collection-status').textContent='Could not open this moment. / 暂时无法打开，请重试。';console.error(error)}}
 $('make-poster').onclick=()=>open();$('close-poster').onclick=()=>$('poster-dialog').close();$('close-collection').onclick=()=>$('collection-dialog').close();$('poster-message').addEventListener('input',setMessage);
 async function save(downloadImage=false){if(busy||!draft)return;busy=true;const record={...draft},format=$('poster-format').value;$('archive-poster').disabled=$('export-poster').disabled=$('poster-message').disabled=true;
  try{const poster=await blobOf(canvas);let saved=false;try{await storedFrame({...record,poster});saved=true}catch{status('Browser storage is unavailable or full. Export an image to keep this moment. / 本机收藏未保存，请导出图片。')}
   if(downloadImage){download(format==='png'?poster:await blobOf(canvas,'image/jpeg'),'fog-at-dusk-'+new Date(record.created).toISOString().replace(/[:.]/g,'-')+'.'+(format==='jpeg'?'jpg':'png'))}
   if(saved)status(downloadImage?'Export started · kept in your film collection. / 已发起下载，并收入胶片收藏。':'Kept in your film collection. / 已收入胶片收藏夹。');
  }catch{status('Could not save. Please try again. / 保存失败，请重试。')}finally{busy=false;$('archive-poster').disabled=$('export-poster').disabled=$('poster-message').disabled=false}
 }
 $('archive-poster').onclick=()=>save();$('export-poster').onclick=()=>save(true);
 $('open-collection').onclick=async()=>{hold();$('collection-dialog').showModal();urls.forEach(URL.revokeObjectURL);urls=[];$('film-strip').replaceChildren();$('collection-status').textContent='Opening your collection… / 正在打开收藏…';
  try{const frames=(await storedFrame()).sort((a,b)=>b.created-a.created);$('collection-status').textContent=frames.length?`${frames.length} quiet moment${frames.length===1?'':'s'}. Yours to keep. / ${frames.length} 个傍晚片刻`:'Your first evening is waiting. Make a poster to begin. / 制作第一张海报，留住一个傍晚。';
   for(const [index,frame] of frames.entries()){const button=document.createElement('button');button.className='film-frame';const img=document.createElement('img');img.src=URL.createObjectURL(frame.poster);urls.push(img.src);img.alt='Evening postcard / 傍晚明信片';const label=document.createElement('span');label.textContent=String(frames.length-index).padStart(2,'0')+' — '+new Date(frame.created).toLocaleDateString('en-GB',{month:'short',day:'2-digit'});button.append(img,label);button.onclick=()=>open(frame);$('film-strip').append(button)}
  }catch{$('collection-status').textContent='Collection unavailable. You can still export a poster. / 暂时无法读取收藏，可直接导出海报。'}
 };
}
