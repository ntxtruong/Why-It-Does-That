# Why It Does That — working notes for Claude

YouTube channel of animated explainers about everyday phenomena, owned by Trường and produced end to end by Claude. English audience, Vietnamese-speaking owner (reply to him in Vietnamese, keep it short).

- Channel: https://www.youtube.com/@WhyItDoesThat-hell (channel ID `UC9sC_yvLVzT19dxs39Q22fg`)
- Plan doc (Claude Docs artifact): https://claude.ai/code/artifact/5af0639b-eb14-4e5d-8a64-77d02e9d6f1f

## Decisions already made

- One theme, two formats: long videos (5–8 min, one "why" question, one mechanism) and Shorts ("one surprising fact" plus a 30–45 s simulation). No listicles, no life-story content on this channel.
- Visuals are code-drawn simulations of the real physics (HTML canvas), dark navy style, with the chibi mascot (`brand/brandkit.js`) in scenes, banner and thumbnails.
- Voice: Kokoro (`kokoro-onnx`, Apache 2.0), voice `am_michael`, speed 0.9. Trường approved this voice and pace on episode 1.
- Uploads default to Unlisted; Trường reviews on YouTube and switches to Public himself.
- Every description states that script, voice and animation are AI-produced, and lists sources.

## Producing an episode

1. Check the mechanism against at least one published source; keep the numbers.
2. `epNN/script.json`: scenes, each a list of narration "beats" (one sentence or two).
3. `python3 tts.py` → `narration.wav`, `timeline.json` / `timeline.js` (start and end of every beat) and `subtitles.srt`. Model files `kokoro-v1.0.onnx` and `voices-v1.0.bin` come from the `thewh1teagle/kokoro-onnx` GitHub release `model-files-v1.0` and are not stored here.
4. `epNN/video.html`: one function per scene, timed from the beat times. Keep particle counts low (about 3,000 dots); they dominate render time and file size.
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

## Episodes

| # | Topic | Status |
| --- | --- | --- |
| 1 | Why is a rainbow always at the same angle? | Uploaded unlisted 2026-10-03: https://youtu.be/CywvAndxdSk |
| 2 | Why is the sky blue but sunsets red? | Not started |
