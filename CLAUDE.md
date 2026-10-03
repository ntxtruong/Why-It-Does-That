# Why It Does That — working notes for Claude

YouTube channel of animated explainers about everyday phenomena, owned by Trường and produced end to end by Claude. English audience, Vietnamese-speaking owner (reply to him in Vietnamese, keep it short).

- Channel: https://www.youtube.com/@WhyItDoesThat-hell (channel ID `UC9sC_yvLVzT19dxs39Q22fg`)
- Plan doc (Claude Docs artifact, holds the topic backlog): https://claude.ai/code/artifact/5af0639b-eb14-4e5d-8a64-77d02e9d6f1f
- Newest notes may sit on a `claude/*` branch rather than `main`; start from whichever branch has the newest commit.

## Decisions already made

- Goal for this stage (Trường, 2026-10-03): build the channel and learn how this kind of content is made. Monetisation is not a goal for now; do not pick topics for search volume or watch hours, and do not bring up monetisation thresholds unless he asks. He works in IT and wants AI used as far as it will go at every step. Where a step still needs him (hearing audio, signing in, the final check), say so plainly and note whether it could be automated later.
- One theme, two formats: long videos (5–8 min, one "why" question, one mechanism) and Shorts ("one surprising fact" plus a 30–45 s simulation). No listicles, no life-story content on this channel.
- Visuals are code-drawn simulations of the real physics (HTML canvas), dark navy style, with the chibi mascot (`brand/brandkit.js`) in scenes, banner and thumbnails.
- Voice: Kokoro (`kokoro-onnx`, Apache 2.0), voice `am_michael`, speed 0.9. Trường approved this voice and pace on episode 1.
- Music: chosen by Trường by ear from the YouTube Audio Library and added in the YouTube Studio editor after upload, at mix level 15. Claude cannot hear, so Claude never picks or judges music alone.
- Uploads are Unlisted; Trường does the final check on YouTube and switches to Public himself. Claude never makes a video public.
- Every description states that script, voice and animation are AI-produced, and lists sources.

## Weekly routine (Wednesday and Saturday mornings)

A scheduled task opens a new session on Wednesday and Saturday morning (Vietnam time). Each session takes one video from idea to "ready for Trường's final check" in four stages. A stage marked **gate** ends with a question to Trường; wait for his answer before going on.

1. **Ideas (gate).** Open by saying it is idea day and offer 1–3 ideas: working title, format (long or Short), the mechanism in one line, why people would click. Choose for how interesting the phenomenon is and how clearly a simulation can show it. Take them from the plan doc's backlog or propose new ones; never repeat the Episodes table below. He picks one, asks for others, or skips the day.
2. **Script (gate).** Check the mechanism and every number against published sources. Write `epNN/script.json`. Send him the full English narration, a two or three line Vietnamese summary, the planned scenes and the sources. He approves or asks for changes.
3. **Production.** Voice, timeline, scenes, render, frame check, thumbnail, `youtube-metadata.md` (see "Producing an episode"). No gate; tell him if something forces a change to the approved script.
4. **Publish prep (gates inside).**
   - Push the episode folder and `media/` files to this repo.
   - Upload to YouTube as Unlisted and fill in title, description with chapters, tags, thumbnail, subtitles, end screen (see "Uploading to YouTube"). This needs Trường's computer on, with the Claude desktop app open and its built-in browser signed in to YouTube; if it is not reachable, say so and wait.
   - Music (gate): ask Trường to listen in the Studio editor and heart the tracks he wants (they then appear under "Thư viện của bạn"), and to say which track goes where. Place them, set mix level 15, let him listen. Saving in the editor cannot be undone: he presses "Lưu", or says to save.
   - Final report (gate): the link, what was set, anything he should look at, and two or three lines on what was new this time (how the AI pipeline handled a step, what got automated or could not be, how YouTube behaved, something the numbers showed), because he wants to learn from building the channel. He checks and switches to Public.
   - Update the Episodes table here and push.

## Setting up a fresh session

- Clone this repo (GitHub owner `ntxtruong`, repo `Why-It-Does-That`, public). `git push` works through the session's git proxy even when the `gh` CLI has no valid token.
- `pip install --break-system-packages kokoro-onnx soundfile` if missing. Model files go in `tts/` at the repo root (git-ignored, about 350 MB): `kokoro-v1.0.onnx` and `voices-v1.0.bin` from `https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/`.
- The Inter font must be installed (`fc-list | grep Inter`; Debian package `fonts-inter`). Playwright and Chromium are preinstalled in the cloud workspace; ffmpeg too.
- Start a new episode by copying `ep01/tts.py`, `render.js`, `thumb.js` and the helper half of `ep01/video.html` (everything above `// ---------- scenes ----------`, plus the dispatcher at the bottom).

## Producing an episode

1. Check the mechanism against at least one published source; keep the numbers.
2. `epNN/script.json`: scenes, each a list of narration "beats" (one sentence or two).
3. `python3 tts.py` → `narration.wav`, `timeline.json` / `timeline.js` (start and end of every beat, relative to the scene start) and `subtitles.srt`.
4. `epNN/video.html`: one function per scene, timed from the beat times. Keep particle counts low (about 3,000 dots); they dominate render time and file size. Keep the mascot and labels out of the bottom 15% of the frame, where YouTube draws captions.
5. `node render.js <first> <last> out.mp4` (Playwright + Chromium, 1080p30); run two halves in parallel, then concat with ffmpeg and add narration normalised to about −16 LUFS.
6. Sample frames every 5–6 s and look at them before delivering. Claude cannot hear audio; Trường checks the voice.
7. Thumbnail: `brandkit.js` `thumb()`; 1280×720 PNG in `media/`.

## Uploading to YouTube (works, used for episode 1)

Claude's files live in a cloud workspace and the signed-in browser is on Trường's computer, so the file travels through this public repo:

1. Push the video, thumbnail and `subtitles.srt` to this repo.
2. In the built-in browser (signed in to YouTube), open `https://studio.youtube.com/channel/<channel ID>/videos/upload?d=ud`.
3. Run JavaScript in the page: `fetch()` the file from `https://raw.githubusercontent.com/ntxtruong/Why-It-Does-That/<branch>/media/<file>`, wrap it in a `File`, put it in a `DataTransfer`, assign to `input[type=file][name=Filedata]`, dispatch a `change` event.
4. Same trick for the thumbnail (`ytcp-thumbnail-uploader input[type=file]`) and for subtitles (`#captions-file-loader`, after choosing "upload file" with timing).
5. Title and description: select the `#textbox` contents with a DOM range, then type.

Channel images are set the same way from `Customization → Profile` (`ytcp-profile-image-upload` and `ytcp-banner-upload` file inputs).

Known limits: files over 100 MB cannot be pushed to GitHub; release-asset URLs are not readable from the page (no CORS), raw and Pages URLs are; files sent through the chat must be under about 30 MB; the Google Drive connector cannot take binary files.

## Music in the YouTube Studio editor (learned on episode 1)

Editor: `https://studio.youtube.com/video/<video ID>/editor` → "Âm thanh". Tabs: "Tất cả bản nhạc" (filters: genre, mood, duration, "Không cần ghi công") and "Thư viện của bạn" (tracks Trường hearted).

- "Thêm" on a row puts the track on the timeline at the playhead (0:00 after a fresh load). Drag the chip to move it, drag an edge to trim; trimming the left edge starts the track part-way in. A segment cannot run past the end of the video.
- Loudness: the "⋮" on a timeline track → slider `tp-yt-paper-slider[aria-label="Mức kết hợp"]` (1–100, default 100; lower is quieter music). Set `value`, then dispatch `immediate-value-change`, `value-change`, `change`. Do not confuse it with the player's own volume slider (`aria-label="âm lượng"`).
- Read the state instead of guessing from pixels: `document.querySelector('ytve-audioswap-timeline').polymerController.currentAudioswapSegments` (start and end in ms, `trackOffsetMillis`, `mixLevel`); `.publishedAudioswaps` shows what is saved.
- Unsaved edits vanish when the page navigates or the browser pane closes. Opening another URL reuses the same tab, so never browse elsewhere while edits are staged.
- When the pane is small the timeline rows fall outside the viewport: emulate 1280×900, do the work, then return to the desktop preset. Synthetic `mousedown` / `mousemove` / `mouseup` events with page coordinates drag the markers reliably; pixels per second = marker width ÷ segment length.
- Trường may be working in the same pane at the same moment. Re-read the state before every change and do not overwrite what he just set.
- Saving cannot be undone (the fallback is a re-upload under a new link), so it happens only on his word.

## Episodes

| # | Topic | Status |
| --- | --- | --- |
| 1 | Why is a rainbow always at the same angle? | Public since 2026-10-03: https://youtu.be/CywvAndxdSk. Music: "Secret Conversations" (The 126ers), four segments, mix 15 |
