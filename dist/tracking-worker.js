
let face,hand;
self.onmessage=async({data})=>{
 if(data.type==='init'){
  try{
   const {FilesetResolver, FaceLandmarker, HandLandmarker}=await import('./assets/vision_bundle.mjs');
   const vision=await FilesetResolver.forVisionTasks(new URL('./assets/wasm/',self.location.href).href);
   face=await FaceLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:new URL('./assets/models/face.task',self.location.href).href,delegate:'CPU'},runningMode:'VIDEO',numFaces:1});
   hand=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:new URL('./assets/models/hand.task',self.location.href).href,delegate:'CPU'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.55,minTrackingConfidence:.55});
   self.postMessage({type:'ready'});
  }catch(e){self.postMessage({type:'error',message:e.message})}
 }else if(data.type==='frame'){
  try{
   const f=face.detectForVideo(data.bitmap,data.time),h=hand.detectForVideo(data.bitmap,data.time);
   self.postMessage({type:'result',face:f.faceLandmarks[0]||null,hand:h.landmarks[0]||null});
  }catch(e){self.postMessage({type:'error',message:e.message})}finally{data.bitmap.close()}
 }
};
