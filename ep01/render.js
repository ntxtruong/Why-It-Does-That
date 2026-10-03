const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
(async()=>{const fps=30,[f0,f1,out]=[+process.argv[2],+process.argv[3],process.argv[4]];
 const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
 await pg.goto('file://'+path.resolve('video.html'));await pg.evaluate(()=>document.fonts.load('600 40px Inter'));await pg.evaluate(()=>document.fonts.load('800 40px Inter'));await pg.evaluate(()=>document.fonts.ready);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','png','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium',out],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let i=f0;i<f1;i++){await pg.evaluate(t=>window.renderFrame(t),i/fps);const buf=await pg.screenshot({type:'png'});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if((i-f0)%300===0)console.log(out,i-f0,'/',f1-f0,((Date.now()-t0)/1000).toFixed(0)+'s')}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('DONE',out,((Date.now()-t0)/1000).toFixed(0)+'s');})();
