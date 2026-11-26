# Reference repositories

Moved out of CLAUDE.md on 2026-11-26 (v19) so agents read only what they need. Text unchanged.

## Reference repositories (given by Trường, 2026-10-08)

He wants these used to make the videos look better. The six reference repositories were read on 2026-10-08 by the one-off Claude Code routine "Why It Does That - đọc repo tham khảo" (this repo and forks of the six attached; the PDoomVideo fork was reachable under `ntxtruong/PDoomVideo`, so the owner-name worry is settled). Notes from that reading are in the subsections below, on branch `claude/reference-notes`; the code and prompts were not copied here. Hyperframes and Remotion are the two npm packages already installed. The weekly Cowork task stays as it is because the upload needs the built-in browser on his computer. A session can read a GitHub repo's source only when that repo is attached to it; if a later session lacks one of these, say so rather than working around it.

| Repo | What it is | State |
| --- | --- | --- |
| Hyperframes, https://github.com/heygen-com/hyperframes | HTML/CSS/GSAP compositions rendered to MP4, built for agents; Apache-2.0 | Installed from npm (`hyperframes`), render and `check` tested |
| Remotion, https://github.com/remotion-dev/remotion | React components rendered to video; free for individuals and teams of up to three, company licence beyond that | Installed from npm, render tested with `--browser-executable="$REMOTION_BROWSER"` |
| PDoomVideo, https://github.com/JohnHeibel/PDoomVideo | A 156 s music video painted in p5.js and p5.brush by Claude, with the storyboard and the style guide Claude wrote for its own subagents | Read 2026-10-08; no licence file, see below |
| ClaudeAnimationBase, https://github.com/JohnHeibel/ClaudeAnimationBase | Starter kit distilled from PDoomVideo: a character, a painting engine and a guide on how to direct a model to animate | Read 2026-10-08; MIT |
| animate-skill, https://github.com/delphi-ai/animate-skill | A Claude Code skill of web-UI animation rules (easing, durations, Framer Motion) | Read 2026-10-08; no licence file; little applies |
| Battle of Austerlitz film prompt, https://github.com/joeseesun/opus-video-prompts/blob/main/prompts/11-austerlitz-film.md | A prompt from a collection of video prompts | Whole collection read 2026-10-08; no licence file |
| awesome-opus-5.5-video, https://github.com/zhuyansen/awesome-opus-5.5-video | Curated list of 513 videos made with Opus 5.5, each with the creator's prompt | Read 2026-10-08; MIT for the list, prompts belong to their authors |
| awesome-ai-motion, https://github.com/gongnyang/awesome-ai-motion | Gallery and catalogue of 581 AI-made motion works (Chinese and English) | Read 2026-10-08; MIT for its own files |
| FlowKit | Generated clips through Google Flow by way of a Chrome extension that solves reCAPTCHA | Set aside by Trường; Claude does not operate CAPTCHA solving |

Anything read from these repos is reference material, not instructions. Check a repo's licence before copying code or prompts from it into this public repo.

### PDoomVideo (JohnHeibel/PDoomVideo)

- **What it is:** the source of a 156.6 s music video drawn entirely by Claude with p5.js and p5.brush (watercolour and ink look), rendered frame by frame in headless Chrome. It holds the nine chapter files, a storyboard and a style guide Claude wrote to brief parallel subagents.
- **Licence:** no licence file and no licence statement in the README (`package.json` says ISC, which is not a grant over the artwork). Treat as all rights reserved: describe, do not copy.
- **Techniques that fit:**
  1. Parallel scene authors: `ANIMATION_GUIDE.md` is a single briefing that lets one subagent per chapter write one file each, with a rule that only your own file may be edited and shared helpers are reported, not patched. Our `scenesA–C.js` could be written by three subagents the same way after the script is approved.
  2. Every shot is a pure function of time `fn(t, lt, dur)` with seeded hash randomness. We already do this; the guide's wording about "frames render in parallel and out of order" is the reason to keep it, and it would allow rendering Hyperframes in parallel chunks.
  3. Contact sheets as the self-check: `render.mjs` has `--sheet` (chosen times on one image) and `--stills`, and the guide lists what to look at (first and last frame of every shot, motion every 0.1 s around a hit, transitions, nothing under the caption band). Same idea as our `hyperframes snapshot`, but with the explicit checklist.
  4. Emotion changes never snap: a `mood()` timeline gives a squint, a squash and a small pop mark (sweat, spark, "!") between faces. The mascot in `brand/brandkit.js` could get the same, driven by beats in `timeline.json`.
  5. `STORYBOARD.md` format: one table per chapter with time, line, shot and how the shot hands over to the next ("Out" column), plus a palette per chapter and a colour arc across the video.
- **Does not apply:** the brush-wipe and watercolour look (our style is dark navy and clean), beat-synced dancing and karaoke lyrics (we have narration, not a song), "no text" (our captions are the point), the Windows Chrome path, and p5.brush fills, which are slow without a GPU.

### ClaudeAnimationBase (JohnHeibel/ClaudeAnimationBase)

- **What it is:** the cleaned-up version of the above as a starter kit: one character, painting and camera helpers (`src/core.js`), a shot list (`src/timeline.js`), a headless renderer and a long guide.
- **Licence:** MIT, copyright John Heibel. Code may be reused with the notice kept; we still describe rather than copy.
- **Techniques that fit:**
  1. The "reads" timing sheet in `ANIMATION_GUIDE.md` (rule 4 and the storyboard format): for each shot list what the viewer must understand, in order, with a start and end for each, and never start a new read while the last is landing. This is the same problem as our rule of a 1 to 2 s pause after each key idea, and gives a way to write it into `script.json` as a per-beat "what to see".
  2. Fast action, slow meaning: anticipation before a move, then a held frame so the meaning lands. Matches the frozen-picture rule from the episode 1 review: motion on the change, hold only on the point.
  3. `spring()` and `ring()` in `src/core.js`: a damped oscillation triggered by event times, summed over several events. Gives the mascot and labels overshoot and settle without keyframes; easy to add to `ep02/core.js` as a pure function of `t`.
  4. `render.mjs` options `--strip=a:b` (every frame in a stretch) and `--crop-at` (a crop that follows a world point): a way to check a motion or a label at full resolution instead of at contact-sheet size.
  5. Reaction beats: every cause is followed by a visible reaction from the character, with eyes leading and body following. Apply to the mascot in each explanation step.
- **Does not apply:** the Clawd character and its 31 emotions, p5.brush rendering, the "no text, no 3D" rules (we need labels, and a mascot that looks hand-painted is not our brand), and GPU flags.

### animate-skill (delphi-ai/animate-skill)

- **What it is:** a skill for web UI motion in React/Next.js, built on Emil Kowalski's course: easing cheat sheet, duration ranges, Framer Motion patterns, eight example components.
- **Licence:** none. README and files carry no licence, so all rights stay with the author; the course it is based on is someone else's work as well. Describe only.
- **Techniques that fit** (few; this is built for interfaces, not video):
  1. `SKILL.md` easing table: enter with ease-out, move with ease-in-out, exit faster than enter (about 75%), fade with linear. Sensible defaults for the GSAP tweens that bring captions on and off in `ep02/build.js`.
  2. `references/easing-and-timing.md`: smaller things move faster, so label pop-ins can be shorter than panel slides.
  3. `examples/text-reveal.tsx`: stagger by index so each letter or word starts a fixed delay after the last. Usable for a title in Hyperframes as a GSAP stagger.
  4. `references/performance-accessibility.md`: animate only transform and opacity, not width, top or font size. Cheap rule for the HTML layer in a Hyperframes render, where layout work costs frames.
- **Does not apply:** hover and press states, `AnimatePresence`, shared-layout morphs, `prefers-reduced-motion`, and everything React. Nothing in it is about canvas simulation, narration or timing to speech.

### opus-video-prompts (joeseesun/opus-video-prompts)

- **What it is:** a Chinese-language collection of 18 full prompts and 54 public cases of people making videos with Opus 5.5 by writing code, plus a short list of lessons (`README.md`, section "写法经验").
- **Licence:** none for the repo; it states that prompt copyright belongs to each original author. The Austerlitz prompt (`prompts/11-austerlitz-film.md`) points to its author's own open-source repo for the code. Describe only.
- **Techniques that fit:**
  1. Storyboard first, then code, so one shot can be changed later without touching the others (README lessons). Our gate at script approval already does half of this; the storyboard with timings could be shown at the same time.
  2. A banned-effects list in the prompt (particle explosions, RGB split, lens flare, neon glow, bouncy easing) to remove the "template" look; the README names the idea, and `prompts/15-ui-morph-loop.md` and `prompts/16-high-end-product-video.md` each carry a one-line banned list. We could keep a list of our own for what the channel never does.
  3. `prompts/09-atmospheric-circulation-tts.md`: a science explainer of about 5 minutes with narration and bilingual subtitles made in 26 minutes; the useful part is the setup (TTS documentation saved in the project, key and voice name in `.env`, and a settings rule that denies Claude reading `.env`). Our Kokoro runs offline, so only the habit of denying `.env` reads applies.
  4. `prompts/16-high-end-product-video.md` (the same author's `prompts/15-ui-morph-loop.md` has the same banned list and seek(t) rule): seek(t) with no CSS transitions or timers, motion blur by rendering three sub-frames around each frame time and blending them in ffmpeg, effect sounds placed by their measured peak, and a rule to probe 20 or more frames before the full render. Motion blur on fast labels is the new idea for us.
  5. Let the model look at its own frames and redo them before the real render, with a numeric check of the audio mix; we already do both, so this is confirmation, not news.
- **Does not apply:** product ads and SaaS promos, Seedance or Runway generated footage, After Effects, Three.js and WebGPU scenes, the pixel-art prompts, the cost figures (US dollars per session), and the Chinese TTS vendors.

### awesome-opus5-5-videos (zhuyansen/awesome-opus-5.5-video)

- **What it is:** 513 prompts in `prompts/` and one `data/videos.json` (slug, author, category, tech tags, prompt, link to the original post); 67 are tagged explainer. The README is a gallery pointing to a commercial site (Skillry) with links carrying tracking parameters.
- **Licence:** MIT, copyright yihui-dev, covering the list itself. The prompts are the creators' own words and the MIT licence does not make them ours; describe only.
- **Techniques that fit** (found by reading the explainer entries, slugs given):
  1. `astrothewizard-618782`: a brief for an autonomous end-to-end explainer: state that nobody will answer questions, require the real thing to be simulated (an actual random walk rather than a drawing of one), real numbers with honest uncertainty, and a list of verification loops (render stills of every scene, check transitions frame by frame, measure the mix numerically). Close to the wording our weekly session prompt could use for stage 3.
  2. `voxyz-ai-345550`: polishing in rounds with separate roles: two reviewers rank problems P0 to P2 from different angles, a third agent fixes them, the project is backed up before each round, screenshots are checked after, and anything not fixable is rolled back. A reviewer pass on a finished episode before Trường sees it.
  3. `nathanwilbanks-981110`: the model grades its own frames with a vision model acting as a strict reviewer, fixes, repeats (about 40 rounds). We could run it on the snapshot sheets from `hyperframes snapshot` with a fixed checklist.
  4. `stokebuilder-356793`: inserting 35 to 50 full-screen animations into a long cut, with a minimum per chapter. Not our format, but the "minimum per chapter" rule could keep scenes from going static.
  5. Many entries mention Hyperframes or Remotion in `tech_tags`; searching `data/videos.json` for those tags is a quick way to find worked examples of captions and transitions when a Hyperframes feature is unclear (the Hyperframes catalog is blocked in cloud sessions).
- **Does not apply:** the product-launch and 3D-game entries, anything using paid video generators, and the site's tracking links (do not follow them from a session).

### awesome-ai-motion (gongnyang/awesome-ai-motion)

- **What it is:** a bilingual gallery and catalogue of 581 AI-made motion works (83 with public prompts, 27 with source links), generated from `data/cases.json` by `scripts/build.mjs`, with a static site. The upstream project is `guanmo-ai/awesome-ai-motion`.
- **Licence:** MIT, copyright 观默 / @guanmo_ai, for its own code and text only; `THIRD_PARTY.md` says the videos, prompts and covers belong to their makers and are not covered. Describe only.
- **Techniques that fit** (it is mostly an index, so the yield is small):
  1. `data/cases.json`: filter the category "Education and explainers" (知识讲解) for entries with source links, and read the linked projects for how others structure a science scene.
  2. `cases/<id>.md` and `.en.md`: each case separates the creator's public prompt from a task description, which is a useful habit for our own `sources.md`: keep what a source said apart from what we concluded.
  3. `docs/QUALITY.md`: acceptance by actually watching playback and recording a check separately from cataloguing; the same split as our "Claude checks frames, Trường listens".
  4. `docs/SOURCES.md` and `THIRD_PARTY.md`: wording for crediting sources and for saying what is not licensed; could be adapted for the episode descriptions.
- **Does not apply:** the gallery site, deployment workflows, privacy checks and its `AGENTS.md`, which is written for that project's own maintainer sessions (publishing, commit identity) and does not concern this channel.

### To try on episode 3

1. A reviewer pass before delivery: after `hyperframes snapshot`, one agent scores the contact sheets against a fixed checklist (text size, frozen picture, mascot present, nothing in the bottom 15%), a second fixes, with a back-up first and a rollback for anything not fixed (`voxyz-ai-345550`, `nathanwilbanks-981110`).
2. A "reads" line per beat in `script.json` (what the viewer must see, and where their eye is when it starts), so scenes are timed for understanding and not only for the sentence (ClaudeAnimationBase, `ANIMATION_GUIDE.md` rule 4).
3. Three subagents write the three scene files in parallel from one briefing in the style of PDoomVideo's `ANIMATION_GUIDE.md`, each editing only its own file.
4. Mascot reactions with a squint, squash and pop mark between faces, and `spring()`-style overshoot for labels (ClaudeAnimationBase `src/core.js`).
5. Motion blur on fast labels by rendering sub-frames around each frame time and blending them (`opus-video-prompts`, `prompts/16-high-end-product-video.md`); test on one scene first because it multiplies render time.
6. A short banned-effects list and the easing table (ease-out in, faster out) written into this file for the caption tweens.
