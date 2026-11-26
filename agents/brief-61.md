# Brief: ep 61 (v19 dry run, one Short, 2026-11-26)

Repo: /home/user/why-it-does-that, branch `claude/project-thread-i28n2t`. Read CLAUDE.md (core), docs/production.md, then the references `ep58/` (Your Brain) and `ep60/` (newest) incl. their retro.md. Copy their structure (script.json, tts.py, scenes.js, captions.*, core.js, sfx.json, build.js, encode.sh, compose_tr.py, meta_en.json, tr_output.json, claims.md, youtube-metadata.md). Run `bash tools/setup.sh` is already done; `. tools/env.sh` before Hyperframes.

| ep | pillar | topic | voice | Related | label |
|---|---|---|---|---|---|
| 61 | Your Brain Is Tricking You | Cross two fingers, touch your nose: it feels like two noses (Aristotle illusion). DO hook | auto (check tts.log) | ep 52 | hook=try len=short look=flat |

Hook at 0 s: viewer does it now. Length 20-25 s (len=short). Wrong guess killed early, reveal at 7-10 s (second event), visible change every <=2.5 s, no recap, last frame loops, ends on a one-word question. NO mascot (ep 61+ rule). Subject >=60 % of frame, kara captions x 60-1020, nothing important below ~1536 px. Own pillar palette (not navy). Text >=40 px, one text layer (labels 1-2 words, no label sharing >=3 words with caption). Animation rules in docs/runbook.md "Animation rules" (storyboard first, scenes hand over, no boil: look=flat).
Facts: verify mechanism and every number with a web search before voicing; write claims.md with sources. Hedge contested science.
Descriptions: no mention of AI/Claude/TTS/Kokoro/how made. meta_en.json + youtube-metadata.md (title, description with sources, tags, pinned-comment question, playlist, Related). 7 translations (vi, th, ja, ko, zh-Hant, id, fil) in tr_output.json using docs/glossary.md, run compose_tr.py; then `python3 ../tools/dub.py ja` and `python3 ../tools/dub.py zh-Hant` (factor >1.3 -> shorten lines, rerun).
Machine has 2 CPUs: wrap TTS, snapshot, render, encode, QC, dub in `flock /tmp/wid-heavy.lock`.
Gate checklist for the reviewer (build to pass it): frame 0 at 120 px wide shows the object and what is odd; something happens in the first second; every scene hands over to the next; hook object stays on screen 7-15 s; something moves in every 2 s window of 0-15 s; text >=40 px, lines >=8 px; captions on screen by the first syllable; ending question is about the topic; try-it test has eye/touch moment >= 3 clean seconds.
Do own critic pass with contact sheets (1 frame per ~1.5 s), run tools/qc_video.py and tools/asr_check.py, write ep61/retro.md (<=12 lines).
Deliverable: media/ep61-two-noses-short.mp4 (encode.sh, <=100 MB), dub.ja.mp3, dub.zh-Hant.mp3, subtitles.srt. Do NOT commit/push, edit CLAUDE.md, or touch YouTube/browser. Final message (English, short): file, length, voice preset, SFX timings, prediction, wall time per phase, unresolved.
