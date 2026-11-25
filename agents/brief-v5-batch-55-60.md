# Brief: v5 Shorts batch, eps 55–60 (2026-11-26)

Trường (channel owner) asked: "Chia agent ra dựng 6 tập nhé, ưu tiên bản thân phải cải thiện liên tục để kênh được hiệu quả hơn" — split the 6 episodes across agents, and above all keep improving every episode so the channel performs better.

Repo: /home/claude/Why-It-Does-That (branch `claude/ep52-finger-sausage`). Read first, in this order:
1. `CLAUDE.md` sections "Channel v5 direction", "Shorts v4 playbook", "Lessons from the 2026-11-25 v5 run", "Producing an episode", the voice v5 line near the top, and the Episodes table (never repeat a topic).
2. `ep53/` (apple browning, Kitchen Science) and `ep54/` (plane windows, Designed) — the two v5 references. Copy their structure: script.json, tts.py (uses tools/voice.py), scenes.js, captions.js/.css, core.js (PANEL palette override), sfx.json, build.js, encode.sh, compose_tr.py, meta_en.json, tr_output.json, claims.md, youtube-metadata.md.
3. `research/hook-swipe-file.md`, `research/shorts-results.md` (last block).

## Assignment

Agents: A = 55 then 58 · B = 56 then 59 · C = 57 then 60.

| ep | pillar | topic (suggested; swap only if facts fail) | voice (auto) | Related |
| --- | --- | --- | --- | --- |
| 55 | Animals Explained | Why cats' eyes glow in the dark (tapetum lucidum). script.json + narration already exist — review the script against the rules, redo TTS if you change it | bella_sarah | pick |
| 56 | Why Is It Designed Like That? | Why pen caps have a hole (ISO 11540). script.json exists, TTS not done | bm_fable (en-gb) | ep 54 |
| 57 | Kitchen Science | Why a wooden spoon across a pot stops it boiling over (starch foam bubbles pop on the dry, cooler wood) — onions were ep 20, do not redo | bella_sarah | ep 53 |
| 58 | Your Brain Is Tricking You | Glance at a clock: the first second lasts too long (stopped-clock illusion, chronostasis; DO hook, viewer tries it) — afterimage was ep 45, do not redo | am_michael | ep 29 |
| 59 | Animals Explained | How a falling cat turns to land on its feet (righting reflex, no spin to push off) | bf_emma (en-gb) | ep 55 |
| 60 | Your Body, Explained | Why ice cream gives you brain freeze, and the tongue-on-palate fix | bella_heart | pick |

`"voice": "auto"` in script.json, no `speed`; tools/voice.py picks the preset from the episode number — check tts.log shows the preset above.

Facts: verify the mechanism and every number with web search before voicing; write `claims.md` with sources. Weak or contested science (e.g. the palate fix) gets hedged wording or is cut.

## Hard rules (v5)
- Hook at 0 s is a DO or WEIRD visual, 3–6 words of on-screen text, never a flat claim. Wrong guess killed early, reveal at 7–10 s, a visible change every ≤ 2.5 s, 20–32 s total, no recap, last frame loops to the first, ends on a one-word question.
- Subject ≥ 60 % of the frame, own camera `cam()`, hard cuts (NOPUSH/NODIP), mascot via MASR at x 150 y 1585 s 0.6 reacting each beat, kara captions at left 330 width 640 top 1352, nothing important below ~1536 px or under the mascot. Pillar palette (Animals: a new warm palette you define; Designed: reuse ep54 teal; Kitchen: ep53's; Brain / Body: define one each, not navy).
- SFX via `tools/sfx.py` on every visible event, loud events ≤ −7 dB; list the SFX timings in your report.
- Descriptions: no mention of AI, Claude, TTS, Kokoro, or how it was made. Metadata in `meta_en.json` + `youtube-metadata.md` (title, description, tags, pinned-comment question, playlist, Related ep), translations for vi, th, ja, ko, zh-Hant, id, fil in `tr_output.json` (title, description, subtitles) and run compose_tr.py.
- Do NOT commit or push, do NOT edit CLAUDE.md, do NOT touch YouTube/Chrome. The lead merges and uploads.

## Shared machine (2 CPUs)
Wrap every CPU-heavy step in the shared lock so agents don't fight:
`flock /tmp/wid-heavy.lock <command>` — for `python3 tts.py`, `npx hyperframes snapshot`, `npx hyperframes render`, `encode.sh`, `qc_video.py`, `asr_check.py`. Run `. tools/env.sh` before Hyperframes. For a render that must outlive the shell: `HYPERFRAMES_RENDER_DETACHED=1 setsid nohup flock /tmp/wid-heavy.lock npx hyperframes render -o renders/master.mp4 > render.log 2>&1 &` and poll.

## Continuous improvement (the priority Trường set)
For each episode:
1. Before building: read every existing `ep5*/retro.md` (other agents write them as they finish) and apply their lessons.
2. Hook gate: snapshot frames at 0, 1, 3 s; look at frame 0 at thumbnail size (Read the PNG). If a stranger would not stop scrolling, redo the hook before the full render.
3. After the render: snapshot ~1 frame per 1.5 s and the 7–10 s window; review them as a strict outside critic with this checklist and fix everything that fails, then re-render: text readable on a phone, subject fills ≥ 60 %, something changes every ≤ 2.5 s, reveal visible by 10 s, mascot present and not covering anything, nothing below 1536 px important, captions don't overlap labels, no frozen frame, last frame loops. Run `tools/qc_video.py` and `tools/asr_check.py` (ASR must match the script).
4. Write `epNN/retro.md` (≤ 12 lines): what failed the critic pass and how you fixed it, one thing to do better next time, and a prediction (stayed %, avg view s) with the reason. Be concrete — the next episode (yours and the other agents') must be better because of it.
5. Do your second episode only after finishing the first one's retro, applying it.

## Deliverables per episode
`media/epNN-<slug>-short.mp4` (encode.sh, 95, mix.wav), all files above, retro.md. Final message to the lead (English, short): file path, length, hook type, voice preset seen in tts.log, SFX timings, playlist + Related, prediction, top lesson, anything unresolved.
