import json, numpy as np, onnxruntime as ort, soundfile as sf, espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(espeakng_loader.get_library_path()); EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
from phonemizer.backend import EspeakBackend
be=EspeakBackend('vi', preserve_punctuation=True, with_stress=True)
t=' '.join(b.split('\n',2)[2].replace('\n',' ') for b in open('/home/claude/Why-It-Does-That/ep55/subtitles.vi.srt').read().strip().split('\n\n')[:3])
ph=be.phonemize([t])[0]
def ids_for(cfg):
    m=cfg['phoneme_id_map']; ids=m['^'][:]
    for ch in ph:
        if ch in m: ids+=m[ch]+m['_']
    return ids+m['$']
D='/tmp/ttsm/'
# 25hours single
m=D+'vits-piper-vi_VN-25hours_single-low/vi_VN-25hours_single-low.onnx'; c=json.load(open(m+'.json')); s=ort.InferenceSession(m); i=c['inference']
ids=ids_for(c); a=s.run(None,{'input':np.array([ids],np.int64),'input_lengths':np.array([len(ids)],np.int64),'scales':np.array([i['noise_scale'],i['length_scale'],i['noise_w']],np.float32)})[0].squeeze()
sf.write(D+'vi_25h.wav',a,c['audio']['sample_rate'])
# vivos multi
m=D+'vits-piper-vi_VN-vivos-x_low/vi_VN-vivos-x_low.onnx'; c=json.load(open(m+'.json')); s=ort.InferenceSession(m); i=c['inference']; sr=c['audio']['sample_rate']
ids=ids_for(c); res=[]
for sid in range(c['num_speakers']):
    a=s.run(None,{'input':np.array([ids],np.int64),'input_lengths':np.array([len(ids)],np.int64),'scales':np.array([i['noise_scale'],i['length_scale'],i['noise_w']],np.float32),'sid':np.array([sid],np.int64)})[0].squeeze()
    # crude f0 via autocorrelation on voiced frames
    f0s=[]
    for k in range(0,len(a)-1024,512):
        fr=a[k:k+1024]; 
        if np.sqrt(np.mean(fr**2))<0.03: continue
        ac=np.correlate(fr,fr,'full')[1023:]; lo,hi=int(sr/400),int(sr/70)
        lag=lo+np.argmax(ac[lo:hi]); 
        if ac[lag]>0.3*ac[0]: f0s.append(sr/lag)
    res.append((sid, float(np.median(f0s)) if f0s else 0, a))
res.sort(key=lambda r:r[1])
print([(r[0],round(r[1])) for r in res])
male=[r for r in res if 70<r[1]<165]; fem=[r for r in res if r[1]>=170]
pick=male[len(male)//2-1:len(male)//2+1]+fem[len(fem)//2-1:len(fem)//2+1]
for sid,f,a in pick: sf.write(D+f'vi_vivos_{sid}.wav',a,sr); print('pick',sid,round(f))
