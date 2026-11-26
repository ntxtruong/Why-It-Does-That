import onnx, numpy as np, json, onnxruntime as ort, soundfile as sf
from onnx import numpy_helper
D='/tmp/ttsm/vits-piper-vi_VN-vivos-x_low/'; M=D+'vi_VN-vivos-x_low.onnx'
m=onnx.load(M)
emb=[i for i in m.graph.initializer if len(i.dims)==2 and i.dims[0]==65]
print([(i.name,list(i.dims)) for i in emb])
E=emb[0]; W=numpy_helper.to_array(E).copy()
blends={'nu_mix':{63:.5,20:.5},'nam_mix':{33:.5,38:.5},'nu_am':{63:.65,33:.35}}
slots={}
for k,(name,w) in enumerate(blends.items()):
    slot=k  # overwrite rows 0..2 (unused picks)
    W[slot]=sum(W[s]*a for s,a in w.items()); slots[name]=slot
E.CopyFrom(numpy_helper.from_array(W.astype(numpy_helper.to_array(E).dtype),E.name))
onnx.save(m,'/tmp/ttsm/vivos_mix.onnx'); json.dump(slots,open('/tmp/ttsm/vivos_mix_slots.json','w'))
exec(open('/tmp/ttsm/vi2.py').read().split('D=')[0])
c=json.load(open(M+'.json')); s=ort.InferenceSession('/tmp/ttsm/vivos_mix.onnx'); i=c['inference']; sr=c['audio']['sample_rate']
ids=ids_for(c)
for name,slot in slots.items():
    for ns in [0.5]:
        a=s.run(None,{'input':np.array([ids],np.int64),'input_lengths':np.array([len(ids)],np.int64),'scales':np.array([ns,i['length_scale'],0.6],np.float32),'sid':np.array([slot],np.int64)})[0].squeeze()
        sf.write(f'/tmp/ttsm/vi_{name}.wav',a,sr); print(name,round(len(a)/sr,1))
