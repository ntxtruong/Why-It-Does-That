const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
 await pg.goto('file://'+path.resolve('video.html'));await pg.evaluate(()=>document.fonts.load('800 40px Inter'));await pg.evaluate(()=>document.fonts.load('700 40px Inter'));await pg.evaluate(()=>document.fonts.ready);
 await pg.evaluate(()=>window.renderThumb());await pg.screenshot({path:'thumb_full.png'});await b.close()})();
