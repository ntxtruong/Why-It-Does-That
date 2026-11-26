# Production details (scenes, rendering, brand kit, production lessons)

Moved out of CLAUDE.md on 2026-11-26 (v19) so agents read only what they need. Text unchanged.

## Producing an episode

1. Check the mechanism against at least two published sources; keep the numbers.
2. `epNN/script.json`: scenes, each a list of narration "beats" (one sentence or two, about 7 s at most).
3. `python3 tts.py` → `narration.wav`, `timeline.json` / `timeline.js` (start and end of every beat, relative to the scene start) and `subtitles.srt`. Start from `ep02/tts.py`: a scene's `"long"` list in `script.json` names the beats followed by a 1.5 s pause, subtitles are one per sentence, and the narration is brought to about −16 LUFS (resample to 48 kHz first, then gain and limiter; limiting before the resample let the true peak overshoot to 0 dBFS). Generating 900 words takes about 7 minutes.
4. `python3 tools/asr_check.py epNN/narration.wav epNN/script.json epNN/timeline.json` lists the beats where the recognised words differ from the script. Fix real misreadings by rewording; pass the rest to Trường as places to listen to. It cannot judge tone.
5. Scenes. Episode 2 is the working example: `core.js` (helpers, colour physics, mascot with eye direction, blink and mouth), `scenesA–C.js` (one function per scene, `fn(t, T, B, E, dur)` with `B(i)` / `E(i)` the start and end of narration beat i) and `build.js`, which writes `index.html` with every on-screen caption as a timed HTML clip taken from `timeline.json`. Change the script or the voice, rerun `tts.py` and `node build.js`, and captions and pictures follow the new timing. The bare starter is `templates/hyperframes/index.html`: the simulation is a pure function `renderFrame(t)` on a canvas, driven by a paused GSAP timeline registered in `window.__timelines`; titles and labels are HTML elements with an `id`, class `clip`, `data-start` and `data-duration`; narration is an `<audio>` clip. Nothing may depend on wall-clock time or unseeded randomness. Keep particle counts low (about 3,000 dots). Keep the mascot and labels out of the bottom 15% of the frame, where YouTube draws captions.
6. `npx hyperframes check` in the episode folder (lint, runtime errors, layout, motion, contrast), then `npx hyperframes snapshot --no-end --at <times>` and look at the contact sheets it writes (about one second per frame, so 20 to 30 frames a scene is cheap). The layout pass samples only 9 moments by default; `npx hyperframes inspect --at <one time per beat>` covers every beat. The lint warning `timeline_track_too_dense` is about file organisation (it wants captions split into sub-compositions) and does not affect the render.
7. `npx hyperframes render -o renders/master.mp4` (1080p30; about 8 frames a second on this machine, so a 6.5-minute video takes roughly 25 minutes). A render started in the background is cancelled when the shell that started it returns (`render_cancelled_parent_exited`): set `HYPERFRAMES_RENDER_DETACHED=1` and start it with `setsid nohup`. For a motion check before the full render, `-q draft -f 10` takes about 6 minutes. The master is too large for GitHub (100 MB limit), so encode the delivery file from it (see `ep02/encode.sh`). Narration at about −16 LUFS. Fallback: `node render.js <first> <last> out.mp4` in two halves, concat and add narration with ffmpeg.
8. `python3 tools/qc_video.py media/epNN-topic-1080p.mp4 epNN/timeline.json` must exit 0 (no frozen stretch over 3 s). Then sample frames every 5–6 s and look at them before delivering. Claude cannot hear audio; Trường checks the voice.
9. Thumbnail: `brandkit.js` `thumb()`; 1280×720 PNG in `media/`. It shows the phenomenon itself.

## Lessons from the episode 2 session (2026-10-08)

- Check a path in an app before telling Trường to follow it. This session repeated a note about "routines → Edit → repositories" that did not apply to his Cowork scheduled task, and he went looking for a setting that was not there. Read the product's documentation first, and say when a step has not been verified.
- Ask for the music early. He can heart tracks in the YouTube Audio Library at any time, so ask at script approval which mood or tracks he wants; otherwise the video sits Unlisted waiting on the music gate.
- Measure loudness on the delivered file, not on the narration file. The first delivery came out 3 LU too loud because of how mono became stereo; it was caught only because the final file was measured.
- Design the end card with the end screen in mind: the mascot on the left, the right two thirds free below the closing line, so the YouTube elements do not need dragging.
- Start the draft render (`-q draft -f 10`) as soon as all scenes draw, and run `tools/qc_video.py` on it before the full render; it costs 6 minutes and would catch a frozen scene before a 20-minute render.
- Say what was not used. Of eight reference links only Hyperframes went into episode 2; he asked, and should have been told in the delivery message without asking.
- Open point in the plan doc: one rule says "no more than 1 video a week" while the schedule is 2 a week. Trường has been asked which one stands; do not change either line until he answers.

## Brand kit (v2, brighter; Trường asked for the brighter colours on 2026-10-15)

Change only with Trường's approval. The kit fixes identity, not content: each episode keeps its own visual language, opening and structure.

| Token | v2 | v1 (episodes 1–2) |
| --- | --- | --- |
| background | `#18264F` | `#0a1020` |
| panel | `#23356A` | — |
| ink (main text) | `#F2F5FB` | `#eef2f8` |
| quiet (secondary text) | `#AAB7D1` | `#8a97ad` |
| gold (accent, key numbers) | `#FFD45E` | `#ffd166` |
| blue (water, light paths) | `#8CC6FF` | `#7fb4ff` |
| coral (warning, "wrong idea") | `#FF8A7A` | — |

- Contrast (measured 2026-10-28): every text colour passes WCAG AA (≥ 4.5:1) on both background and panel; lowest is coral on panel at 5.1:1. Check any new pairing before use.
- Typeface: Inter (SIL OFL, commercial use allowed) for on-screen English text. On-screen text stays English; translated subtitles are rendered by YouTube's own fonts, so Inter's lack of Thai/CJK glyphs does not affect them. If translated text is ever burned into a video or thumbnail, use Noto Sans (Thai, JP, KR, TC; OFL).
- Not pure black or white anywhere.
- Logo sting ≤ 2 s, thumbnail layout, subtitle style and end-screen layout: keep the episode 2 versions until a v2 variant is approved (end card: mascot left, right two thirds free for YouTube elements).
- Music: chosen by Claude by mood (standing permission, 2026-11-03); Mix level 15 in the YouTube Studio editor.
- Localization languages (7, since 2026-11-07, Trường: "bổ sung thêm ngôn ngữ indo, philipine"): Vietnamese (vi), Thai (th), Japanese (ja), Korean (ko), Chinese Traditional (zh-Hant), Indonesian (id, Studio "Tiếng Indonesia") and Filipino (fil, Studio "Tiếng Philippines"/"Filipino", not Cebuano). Added on every upload, no gate. Episodes 1–18 have the first five only unless Trường asks for a backfill. Indonesian: standard Bahasa, informal-polite ("kamu"); Filipino: everyday Tagalog-based, not formal.
- `brand/brandkit.js` switched to the v2 colours on 2026-10-28 (episodes 3–5 were built on v2).

## Lessons from the 2026-10-28 run

- Every push so far came from sessions Trường opened himself with the repo attached (commit trailers: sessions 01P2FM…, 01D6qu…, 01RAgZ…). No scheduled-task run has pushed. Check `git log --format=%(trailers)` before claiming a route "worked before".
- The Cowork scheduled task has no Repository setting, and the routines page cannot be configured either. Do not send him to look for a repository setting; attach the repo inside the session with `add_repo`.
- The git proxy allows creating and updating branches but not deleting them. Never push throwaway test branches; the first real push of the work branch is the test.
- A shallow clone tracks only `main`: fetch other branches with an explicit refspec (`+refs/heads/claude/<name>:refs/remotes/origin/claude/<name>`) and add it to `remote.origin.fetch` before `git branch -u`.
- When push is refused, still write CLAUDE.md updates on a local `claude/*` branch and send the file and a `git format-patch` through the chat, so nothing is lost.


## Lessons from the 2026-10-28 production run (episodes 3–5 in one session)

- This machine had 2 CPU cores: Kokoro takes about 7 minutes per 900-word script, a 6:45 Hyperframes render about 16 minutes (~12 fps alone, ~6 fps with another job running), and the slow x264 encode cannot finish in a 10-minute foreground call when a render is running. Run TTS, renders and encodes detached and one at a time.
- A `while pgrep -f "python3 tts.py"` waiter matches its own command line and never ends; chain jobs with `;` in one detached shell instead.
- Split every subtitle sentence that runs over ~7 s before the voice is generated; check with the subtitle durations, not the beat durations (beats hold several sentences).
- Frame check caught a script error the skeptic missed: in ep3 "a little slower crawls forward / a little faster creeps backwards" was reversed (just below the freeze speed the leftover step is almost a whole gap, so it looks backwards). Draw the physics first, then read the script against the drawing.
- Captions kept to the opening question and the end card; numbers and labels drawn on the canvas next to what they describe. Layout check stays clean this way and the frame is less cluttered than episode 2.
- Shared files for a new episode: `core.js` (v2 colours, primitives, mascot, `spring()`), a generic `build.js` that reads `captions.js`, `tts.py` with subtitle numerals in `nums.json`, `encode.sh` that brings the narration to −14 LUFS and measures the final file, and `thumb.js` that writes three thumbnail variants.
- Translations: one Sonnet subagent per episode translates title, description and subtitles into the five languages from `tr_input.json`; `compose_tr` puts the English timings back. About 4 minutes per episode.

## Lessons from the 2026-11-02 run (episodes 6–8 in one session)

- Three episodes in one session: one git worktree per branch (`git worktree add /home/claude/wNN claude/epNN-…`) with sparse checkout excluding `media/` and `brand/*.png`, and `tts`, `asr`, `node_modules` symlinked from the main clone. New media then needs `git add --sparse media/…`.
- Remove the `[TRUONG_ANGLE …]` placeholder beat from `script.json` before `tts.py`, or Kokoro reads it aloud.
- `pkill -f <pattern>` matched the tool's own shell and killed it; kill by PID instead.
- A Short (1080×1920) uses the same `build.js` with `FW=1080 FH=1920`, extra CSS in `captions.css`, and `tts.py` short pauses (`"format": "short"`). Keep text in the top third and the character above y ≈ 1530; nothing right of x ≈ 940.
- `ep06/core.js` holds the v2 helpers plus `chibi3()` / `mascot3()` (blink, mouth, lean) for the new character; ep07/ep08 copy it.
- Machine load on 2 cores: a 6:30 render took about 30 minutes while TTS and a second render ran; run renders one at a time where possible.

## Lessons from the 2026-11-13 production run (Shorts 28–30, format v3)

- Format v3: speed 1.0 (was 0.9), 26–29 s, the first frame carries a claim (not a question) in the `.q` caption and the last 1.1 s repeat it for the loop. Three Shorts written, cold-read on snapshots, rendered (~2 min each) and encoded in about 50 minutes in one session, without subagents.
- Cold read before render again caught real problems: a rolling number that read "59 million km" mid-roll (never roll a value the narration states; show the final number), labels on top of moving objects, a zoom that pushed Earth off frame, a caption over a chart.
- Translations were written by Claude in-session with `scripts`-style generation (`meta_en.json`, `tr_output.json`, `youtube-metadata.md`, `sources.md` from one table); compose_tr.py then writes the SRTs.
- Upload: the playlist dialog's rows sometimes load after 10 s; wait for the named row, not a fixed delay. On the translations page the "Tải tệp lên" button's text can carry extra characters: match it with a regex. Two of 21 subtitle uploads missed (ep 29 zh-Hant, ep 30 vi) and were fixed by reopening the row; keep reading the table at the end.
- Vietnamese voice (H6): Microsoft edge-tts and Hugging Face are blocked here. Piper `vi_VN-vais1000-medium` (dataset CC BY 4.0) downloads from the sherpa-onnx GitHub release `tts-models/vits-piper-vi_VN-vais1000-medium.tar.bz2` and runs with `pip install piper-tts` (the sherpa-onnx wheel here has no espeak frontend). `tools/vn_dub.py` lays each Vietnamese subtitle line at the English start time (numbers must be written as words). Whisper-base heard most words but garbled some "tr"/"ng" sounds, Trường listened to the ep 28 preview and decided (2026-11-13): the Vietnamese voice is too loud; keep the English voice, which is warm and deep. No Vietnamese audio tracks.

## Lessons from the 2026-11-25 v5 run (AI line removal on 52 videos; eps 53–54)

- Removing a line from every description: one foreground tab, one background JS job that walks the whole list with SPA navigation (`history.pushState` + a `popstate` event keeps the JS alive between videos; `location.href` would kill it). Wait for an `<a>` with the video id before acting. Several Studio tabs in parallel failed: hidden tabs throttle the dialogs and the job died on half-open dialogs.
- After SPA navigation the page holds several `ytgn-language-dialog` elements; use the one with text. Its "Hủy" icon needs a click on the inner `<button>`, not the `ytcp-icon-button`.
- `tools/sfx.py` synthesizes the SFX (whoosh, pop, tick, drip, chime, rise, crack, hiss, thud) from noise and sines and mixes them under the narration into `mix.wav`; `build.js` points the audio clip at `mix.wav` and `encode.sh` gets `mix.wav` as its 4th argument. Keep a loud event (crack) at −7 dB or lower so it does not mask the voice.
- v5 look: own camera (`cam()`), hard cuts (all scenes in `NOPUSH`/`NODIP`), a full-frame subject, per-pillar palette by overriding `PANEL` in the episode's `core.js` and `.q`/`.kara` colours in `captions.css`; burned-in captions at x 330–970 so the larger mascot (s 0.6) stays clear.
- `qc_video.py` lit area reads ~9–18 % on full-frame light backgrounds (aluminium skin): the metric is median-based, ignore it there (same as the 11-20 lesson).
- Voice test: `voice-test/ep53-voice-*.mp3` (am_michael, am_puck, af_heart, bm_george) for Trường to choose; default unchanged until he answers.
