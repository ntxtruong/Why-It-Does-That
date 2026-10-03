import json, numpy as np, soundfile as sf, sys
from kokoro_onnx import Kokoro
S=json.load(open('script.json')); k=Kokoro("../tts/kokoro-v1.0.onnx","../tts/voices-v1.0.bin"); SR=24000
PRE,GAP,POST=0.8,0.45,1.0
def trim(a,th=0.004):
    idx=np.where(np.abs(a)>th)[0]
    return a if len(idx)==0 else a[max(0,idx[0]-int(.03*SR)):min(len(a),idx[-1]+int(.06*SR))]
out=[];t=0.0;TL={"scenes":[]};srt=[]
sil=lambda s:np.zeros(int(s*SR),dtype=np.float32)
for sc in S["scenes"]:
    s0=t;beats=[];out.append(sil(PRE));t+=PRE
    for i,txt in enumerate(sc["beats"]):
        a,sr=k.create(txt,voice=S["voice"],speed=0.9,lang="en-us");assert sr==SR
        a=trim(a.astype(np.float32));d=len(a)/SR
        beats.append({"start":round(t-s0,3),"end":round(t-s0+d,3)});srt.append((t,t+d,txt))
        out.append(a);t+=d
        g=GAP if i<len(sc["beats"])-1 else POST;out.append(sil(g));t+=g
    TL["scenes"].append({"id":sc["id"],"start":round(s0,3),"dur":round(t-s0,3),"beats":beats});print(sc["id"],round(t-s0,1),flush=True)
out.append(sil(2.5));t+=2.5;TL["total"]=round(t,3);TL["scenes"][-1]["dur"]=round(TL["scenes"][-1]["dur"]+2.5,3)
audio=np.concatenate(out);peak=np.abs(audio).max();audio=audio/peak*0.89
sf.write("narration.wav",audio,SR)
json.dump(TL,open("timeline.json","w"));open("timeline.js","w").write("window.TL="+json.dumps(TL)+";")
def ts(x):
    h=int(x//3600);m=int(x%3600//60);s=x%60;return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000))%1000:03d}"
txt=lambda s:s.replace("forty-two and a half degrees","42.5°").replace("forty and a half","40.5°").replace("forty-two degrees","42°")
open("subtitles.srt","w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{txt(s)}\n" for i,(a,b,s) in enumerate(srt)))
print("total",round(t,1),"s", "words",sum(len(b.split()) for sc in S["scenes"] for b in sc["beats"]))
