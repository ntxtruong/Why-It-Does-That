window.__kit=(()=>{const RAD=Math.PI/180,SPEC=['#ff4b4b','#ff9340','#ffe04a','#58e07a','#45a8ff','#6470ff','#a56bff'],NS=SPEC.map((_,i)=>1.330+0.013*i/6),NW=1.333;
const BG='#0a1020',INK='#eef2f8',QUIET='#8a97ad',SUN='#f6f1e3',ACC='#ffd166',DROP='#7fb4ff';let g;
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),add=(a,b)=>({x:a.x+b.x,y:a.y+b.y}),mul=(a,k)=>({x:a.x*k,y:a.y*k}),dot=(a,b)=>a.x*b.x+a.y*b.y;
function refract(d,n,eta){const ci=-dot(d,n),k=1-eta*eta*(1-ci*ci);return add(mul(d,eta),mul(n,eta*ci-Math.sqrt(Math.max(0,k))))}
function bowAngle(n){const i=Math.acos(Math.sqrt((n*n-1)/3)),r=Math.asin(Math.sin(i)/n);return (4*r-2*i)/RAD}
function trace(b,n,C,R,x0,far){const P1={x:C.x-R*Math.sqrt(1-b*b),y:C.y-b*R},pts=[{x:x0,y:P1.y},P1];let d=refract({x:1,y:0},mul(sub(P1,C),1/R),1/n),P=P1;
  P=add(P,mul(d,-2*dot(sub(P,C),d)));pts.push(P);const nn=mul(sub(C,P),1/R);d=sub(d,mul(nn,2*dot(d,nn)));P=add(P,mul(d,-2*dot(sub(P,C),d)));pts.push(P);
  const o=refract(d,mul(sub(C,P),1/R),n);pts.push(add(P,mul(o,far)));return {pts,ang:Math.atan2(o.y,-o.x)/RAD}}
function poly(pts,from,to,col,a,lw){g.globalAlpha=a;g.strokeStyle=col;g.lineWidth=lw;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(pts[from].x,pts[from].y);for(let i=from+1;i<=to;i++)g.lineTo(pts[i].x,pts[i].y);g.stroke();g.globalAlpha=1}
function drop(C,R,lw){g.beginPath();g.arc(C.x,C.y,R,0,7);g.fillStyle='rgba(127,180,255,0.10)';g.fill();g.lineWidth=lw;g.strokeStyle=DROP;g.stroke()}
function canvas(w,h){const cv=document.createElement('canvas');cv.width=w;cv.height=h;g=cv.getContext('2d');g.fillStyle=BG;g.fillRect(0,0,w,h);return cv}
function bundle(C,R,n,x0){g.globalCompositeOperation='lighter';for(let k=0;k<n;k++){const b=0.02+0.97*k/(n-1),q0=trace(b,NW,C,R,x0,2600);poly(q0.pts,0,1,SUN,0.035,2.5);
    [0,3,6].forEach(i=>{const q=trace(b,NS[i],C,R,x0,2600),near=bowAngle(NS[i])-q.ang<1.6;poly(q.pts,1,4,SPEC[i],near?0.6:0.07,near?3.5:2.2)})}g.globalCompositeOperation='source-over';drop(C,R,4)}
function qmark(cx,cy,s,rot){g.save();g.translate(cx,cy);g.rotate(rot*RAD);const c=g.createConicGradient(170*RAD,0,0);[0,.105,.21,.32,.43,.535,.64].forEach((p,i)=>c.addColorStop(p,SPEC[i]));c.addColorStop(.9,SPEC[6]);c.addColorStop(.97,SPEC[0]);c.addColorStop(1,SPEC[0]);
  const path=()=>{const r=135*s,ex=r*Math.cos(40*RAD),ey=r*Math.sin(40*RAD);g.beginPath();g.arc(0,0,r,170*RAD,400*RAD);g.bezierCurveTo(ex-0.64*78*s,ey+0.77*78*s,0,150*s,0,238*s)};
  g.lineCap='round';g.lineJoin='round';g.strokeStyle='#ffffff';g.lineWidth=84*s+16;path();g.stroke();g.fillStyle='#ffffff';g.beginPath();g.arc(0,368*s,50*s+8,0,7);g.fill();
  g.strokeStyle=c;g.lineWidth=84*s;path();g.stroke();g.fillStyle=SPEC[6];g.beginPath();g.arc(0,368*s,50*s,0,7);g.fill();g.restore()}
function star(x,y,r,col){g.fillStyle=col;g.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*0.32:r;g.lineTo(x+Math.cos(a-Math.PI/2)*rr,y+Math.sin(a-Math.PI/2)*rr)}g.closePath();g.fill()}
// full-body chibi: x = centre, yFeet = bottom of the shoes, s = scale (1 = 714 px tall)
function chibi(x,yFeet,s){g.save();g.translate(x,yFeet-890*s);g.scale(s,s);const SKIN='#f6e3d3',HAIR='#15161d',CLOTH='#1b1d27',shapes=[],S=(b,f)=>shapes.push({b,f});
  S(()=>{g.beginPath();g.roundRect(-70,740,58,124,22)},'#2a2f40');S(()=>{g.beginPath();g.roundRect(12,740,58,124,22)},'#2a2f40');
  S(()=>{g.beginPath();g.ellipse(-46,866,46,24,0,0,7)},'#eef2f8');S(()=>{g.beginPath();g.ellipse(46,866,46,24,0,0,7)},'#eef2f8');
  S(()=>{g.beginPath();g.moveTo(-122,772);g.quadraticCurveTo(-156,604,-74,566);g.lineTo(74,566);g.quadraticCurveTo(156,604,122,772);g.quadraticCurveTo(0,800,-122,772);g.closePath()},CLOTH);
  S(()=>{g.beginPath();g.ellipse(0,400,200,182,0,0,7)},HAIR);S(()=>{g.beginPath();g.ellipse(0,424,172,156,0,0,7)},SKIN);
  S(()=>{g.beginPath();g.ellipse(0,400,200,182,0,Math.PI,2*Math.PI);g.lineTo(176,430);g.quadraticCurveTo(120,338,92,398);g.quadraticCurveTo(44,338,4,394);g.quadraticCurveTo(-40,338,-88,398);g.quadraticCurveTo(-124,338,-176,430);g.closePath()},HAIR);
  S(()=>{g.beginPath();g.ellipse(0,372,204,196,0,Math.PI,2*Math.PI);g.closePath()},'#22252f');S(()=>{g.beginPath();g.roundRect(-212,326,424,62,28)},'#3a4056');
  g.lineJoin='round';g.strokeStyle='#ffffff';g.lineWidth=22;shapes.forEach(q=>{q.b();g.stroke()});shapes.forEach(q=>{q.b();g.fillStyle=q.f;g.fill()});
  g.strokeStyle='#4b536e';g.lineWidth=5;for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*56,336);g.lineTo(i*56,378);g.stroke()}
  [-68,68].forEach(ex=>{g.fillStyle='#1b1e2c';g.beginPath();g.ellipse(ex,452,27,35,0,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(ex-9,438,10,0,7);g.fill();g.beginPath();g.arc(ex+10,464,5,0,7);g.fill()});
  g.fillStyle='rgba(255,120,130,0.45)';g.beginPath();g.ellipse(-112,494,30,17,0,0,7);g.fill();g.beginPath();g.ellipse(112,494,30,17,0,0,7);g.fill();
  g.strokeStyle='#7a4a45';g.lineWidth=7;g.lineCap='round';g.beginPath();g.arc(0,496,17,0.15*Math.PI,0.85*Math.PI);g.stroke();
  g.strokeStyle='#30364a';g.lineWidth=9;g.beginPath();g.moveTo(-70,580);g.quadraticCurveTo(0,650,70,580);g.stroke();
  g.strokeStyle='#d7dcea';g.lineWidth=6;g.beginPath();g.moveTo(-18,626);g.lineTo(-18,668);g.moveTo(18,626);g.lineTo(18,668);g.stroke();
  g.fillStyle=SKIN;g.strokeStyle=CLOTH;g.lineWidth=5;[-21,21].forEach(hx=>{g.beginPath();g.arc(hx,712,24,0,7);g.fill();g.stroke()});
  g.strokeStyle='#c9cfdd';g.lineWidth=4;[-46,46].forEach(sx=>{g.beginPath();g.moveTo(sx-26,872);g.lineTo(sx+26,872);g.stroke()});
  qmark(255,212,0.31,12);star(177,150,22,ACC);star(307,372,15,ACC);g.restore()}
function banner(font){const cv=canvas(2560,1440);bundle({x:2250,y:640},150,54,-50);
  const gr=g.createLinearGradient(380,0,1700,0);gr.addColorStop(0,'rgba(10,16,32,0)');gr.addColorStop(0.12,'rgba(10,16,32,0.9)');gr.addColorStop(0.85,'rgba(10,16,32,0.85)');gr.addColorStop(1,'rgba(10,16,32,0)');g.fillStyle=gr;g.fillRect(380,480,1320,480);
  g.textAlign='left';g.fillStyle=INK;g.font='800 132px '+font;g.fillText('Why It Does That',540,700);g.fillStyle=ACC;g.font='600 50px '+font;g.fillText('Everyday things, explained by simulation',546,792);
  g.fillStyle=QUIET;g.font='500 36px '+font;g.fillText('One question. One mechanism. Real physics on screen.',546,858);chibi(1836,922,0.54);return cv}
function thumb(font){const cv=canvas(1920,1080);const C={x:1400,y:420},R=340;drop(C,R,6);g.globalCompositeOperation='lighter';
  for(let k=0;k<60;k++){const b=0.02+0.97*k/59,q0=trace(b,NW,C,R,-40,2400);poly(q0.pts,0,1,SUN,0.10,2.4);[0,3,6].forEach(i=>{const q=trace(b,NS[i],C,R,-40,2400),near=bowAngle(NS[i])-q.ang<1.6;poly(q.pts,1,4,SPEC[i],near?0.6:0.08,near?4:2.4)})}
  g.globalCompositeOperation='source-over';const gr=g.createLinearGradient(0,0,1050,0);gr.addColorStop(0,'rgba(10,16,32,0.92)');gr.addColorStop(0.7,'rgba(10,16,32,0.75)');gr.addColorStop(1,'rgba(10,16,32,0)');g.fillStyle=gr;g.fillRect(0,0,1050,1080);
  g.textAlign='left';g.fillStyle=INK;g.font='800 150px '+font;g.fillText('ALWAYS',90,330);g.fillStyle=ACC;g.font='800 400px '+font;g.fillText('42°',80,700);g.fillStyle=INK;g.font='700 130px '+font;g.fillText('why?',90,890);
  chibi(1640,1058,0.56);return cv}
return {banner,thumb}})();
