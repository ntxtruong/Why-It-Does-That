import json, numpy as np, onnxruntime as ort, soundfile as sf, espeakng_loader, sys
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(espeakng_loader.get_library_path()); EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
from phonemizer.backend import EspeakBackend
def run(model, cfgp, text, out):
    cfg=json.load(open(cfgp)); voice=cfg['espeak']['voice']; idmap=cfg['phoneme_id_map']
    be=EspeakBackend(voice, preserve_punctuation=True, with_stress=True)
    ph=be.phonemize([text])[0]
    ids=[idmap['^'][0]]
    for ch in ph:
        if ch in idmap: ids+=idmap[ch]+idmap['_']
    ids+=idmap['$']
    s=ort.InferenceSession(model); inf=cfg['inference']
    a=s.run(None,{'input':np.array([ids],dtype=np.int64),'input_lengths':np.array([len(ids)],dtype=np.int64),'scales':np.array([inf['noise_scale'],inf['length_scale'],inf['noise_w']],dtype=np.float32)})[0].squeeze()
    sf.write(out,a,cfg['audio']['sample_rate']); print(out, round(len(a)/cfg['audio']['sample_rate'],1), ph[:60])
d='/tmp/ttsm/'
srt=lambda l:' '.join(b.split('\n',2)[2].replace('\n',' ') for b in open(f'/home/claude/Why-It-Does-That/ep55/subtitles.{l}.srt').read().strip().split('\n\n')[:3])
run(d+'vits-piper-id_ID-news_tts-medium/id_ID-news_tts-medium.onnx', d+'vits-piper-id_ID-news_tts-medium/id_ID-news_tts-medium.onnx.json', srt('id'), d+'id.wav')
run(d+'vits-mimic3-ko_KO-kss_low/ko_KO-kss_low.onnx', d+'vits-mimic3-ko_KO-kss_low/ko_KO-kss_low.onnx.json', srt('ko'), d+'ko.wav')
run(d+'vits-piper-vi_VN-vais1000-medium/vi_VN-vais1000-medium.onnx', d+'vits-piper-vi_VN-vais1000-medium/vi_VN-vais1000-medium.onnx.json', srt('vi'), d+'vi.wav')
