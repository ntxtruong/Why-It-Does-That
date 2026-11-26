# Dry run v19 report (2026-11-26, one Short, ep 61)

Times are UTC from `date` (the session clock) and are partly reconstructed from subagent reports: marked (guess) where so. Run start 14:37:18, last step about 15:05.

## Result
Short built and reviewed (7.0 then 7.8, gate 7.5, no P0). Pushed. **Windsor upload failed twice with "YouTube rate-limited the upload"**, so the video is NOT on YouTube. Verdict: Windsor step 9 did not pass; steps 0-8 work. After Trường asked for Chrome, ep 61 was uploaded through Claude in Chrome (Unlisted, https://youtube.com/shorts/av2Gxw-DZGA, channel UC9sC_yvLVzT19dxs39Q22fg confirmed by vidIQ: privacyStatus unlisted, uploadStatus processed). Music, end screen and thumbnail are still open.

## Tools available in this session
| Tool | Result |
|---|---|
| vidIQ | Worked: `vidiq_user_channels` (channel UC9sC_yvLVzT19dxs39Q22fg, 16 subs, 60 videos, account ntxtruong.81@gmail.com), `vidiq_channel_videos`, `vidiq_channel_analytics`, `vidiq_user_videos`. Needed ToolSearch first (deferred). |
| Windsor | `get_connectors` worked (connector `youtube`, account id 126285, actions incl. `upload_video`). `execute_action upload_video` failed twice (below). Needed ToolSearch first. |
| Claude in Chrome | `list_connected_browsers` showed 1 Windows browser (Browser 1, ext 1.0.109). `tabs_context_mcp` + `navigate` to `studio.youtube.com/channel/UC9s...` worked, page showed the Studio channel dashboard signed in (page text read OK). No upload attempted. |
| GitHub | `git push` worked via the session proxy; `mcp__github__*` not needed. |

## Models actually used
Coordinator: Sonnet 5.5 (this thread, as configured). Measure agent: Haiku 5.5 (self-reported `claude-haiku-5-5`). Build agent: Opus 5.5 (`claude-opus-5-5`, self-reported). Reviewers (both rounds): Sonnet 5.5. Fact-check was done by the build agent itself (web search), not a separate Sonnet agent (deviation from runbook, guess: saved time). Translation/metadata was also done by the Opus builder, not a Haiku agent (deviation).

## Steps
**0 Setup.** `add_repo` said already attached; branch `claude/project-thread-i28n2t` fetched with explicit refspec. `tools/setup.sh` **did not finish properly**: it stopped at `pip install "misaki[ja,zh]"` (jieba / unidic-lite fail to build, Debian setuptools `install_layout` error). Kokoro model, ASR model and node_modules were not installed. Builder fixed it with `pip install --use-pep517` and ran the remaining steps by hand (~2 min). Second bug: `. tools/env.sh` inside `setup.sh` aborts under `set -euo pipefail` (a glob fallback with `ls` fails), so the last checks (ffmpeg, hyperframes) exit with code 2. TODO: fix both in `tools/setup.sh`. Also `/tmp/setup.log` ends with a timestamp even when it failed, so the end line is not a success signal.

**1 Measure (Haiku).** ~42 s, 3 tool calls, no errors. `vidiq_channel_videos` (short) and `vidiq_channel_analytics` worked. Result appended to `research/shorts-results.md`. Limits: `channel_analytics` returned no rows for anything published after 2026-11-17 (probably reporting lag, guess), so avg view duration, % viewed and subs gained are missing for the 53-60 batch. The agent labelled the videos by publish order because the repo has no ep-to-video-id map: **its ep labels for 53-58 are unconfirmed (guess)**. It did not find eps 59-60, but later `vidiq_user_videos` shows both public (published 13:00 and 14:00 UTC on 2026-11-26, so already live). No experiment readout (nothing 48 h old). Suggestion: keep a video-id column in `docs/episodes.md`.

**2 Learn.** Not done in this dry run (nothing 48 h old to score). Prediction for ep 61 is in `docs/episodes.md` (stayed 58-64 %, avg 12-14 s, guess, builder's estimate).

**3 Topic.** Picked ep 61 = Aristotle illusion (candidate scored 9 in the swipe file, pillar Your Brain Is Tricking You). Label `hook=try len=short look=flat`. No new vidIQ research lookups (saved tokens).

**4-7 Script, fact-check, build, review.** Brief `agents/brief-61.md` (written by coordinator). Opus builder timings (reported by the agent; approximate):
| Phase | Time |
|---|---|
| Reading + setup repair | ~2 min (14:37:47-14:39:30) |
| Fact-check (web search, `claims.md` with sources) | ~1.5 min |
| Script | ~0.5 min |
| TTS + ASR check (bella_sarah, auto) | ~1 min |
| Build + 2 snapshot/fix rounds | ~4.5 min |
| Render (hyperframes) | 42 s |
| Encode + QC | ~1 min |
| Translations (7) + metadata | ~1 min |
| Dubs ja + zh-Hant | ~1 min |
| Build total | ~12.5 min |
Review round 1 (Sonnet, ~44 s): 7.0, P1: 4-word ending question, doubled noses shown from frame 0 (spoils reveal), unmatched zoom cuts. Fix round (Opus, ~5 min total). Review round 2 (fresh Sonnet, ~41 s): 7.8, no P0. Remaining P1/P2: frame 0 shows only crossed fingers at the chin (weak thumbnail), the Aristotle scene is a recolor, caption box bottom at y~1550 (past 1536), label "Try this right now" is 4 words, loop frame differs slightly. Not fixed (dry run). Final file: 20.7 s, 1080x1920, 3.6 MB, -14.0 LUFS, QC exit 0, ASR 0/49 words differ. Nobody has listened to the audio (voice, SFX, dubs): needs a human listen.
Self-reported by builder: ASR once heard "two" as "too" (round 1).

**8 Translations, dubs, metadata.** Done by the Opus builder inside the build (not a separate Haiku agent). `subtitles.{vi,th,ja,ko,zh-Hant,id,fil}.srt`, `dub.ja.mp3`, `dub.zh-Hant.mp3`, `meta_en.json`, `youtube-metadata.md`, no AI mention. Note: `meta_en.json` has only title + description; tags and playlist live in `youtube-metadata.md` (coordinator had to copy tags by hand). "Aristotle's illusion" is in `new_terms` of `tr_output.json`, not yet in `docs/glossary.md`. Translations not verified by a native speaker.

**9 Upload (Windsor).**
- Push: first push rejected (remote branch had 2 newer commits from the main thread: `735c7b7`); fetched, `git merge --no-edit` (clean), pushed `fb1e871`. `git ls-remote` confirms. Repo is readable by raw.githubusercontent.com.
- **Gotcha:** the branch-name raw URL (`.../claude/project-thread-i28n2t/media/ep61-...mp4`) returned **404 for ~5 min** because I curled it once before the push (raw.githubusercontent caches the 404). The **commit-SHA URL worked immediately** (HTTP 200, 3,641,418 bytes). Do not probe the URL before pushing; use the SHA URL in Windsor.
- Duplicate guard: `vidiq_user_videos` search "Two Noses" returned 0 videos.
- `execute_action` (connector `youtube`, account 126285, `upload_video`, category 27, made_for_kids false, privacy `unlisted`, no publish_at, 10 tags, video_url = SHA raw URL, 3.6 MB) -> attempt 1 (~14:58) error: `YouTube rate-limited the upload. Wait a minute and run the action again. Check YouTube Studio first if the previous attempt may have finished.` Checked: no new video on the channel. Attempt 2 (~15:00, after ~80 s wait) same error. Attempt 3 (extra, ~5 min after attempt 2) same error. Guess: the YouTube Data API upload quota or per-channel upload limit is hit (60 videos on a ~2-month-old channel, many uploads today; eps 55-60 were uploaded today), not a problem with the file or URL.
- Video id, privacy status as YouTube reports it, channel id: **not available (no upload happened)**.
- Per run book "Windsor fails twice -> leave to step 10", item left in `state/queue.md`.

**10 Browser finishing.** Claude in Chrome is reachable and signed in to the channel (confirmed channel ID in the Studio URL and dashboard). I did not run the Studio upload (the item has nothing to finish: the video is not on YouTube; a full Studio upload was out of the dry-run limits, guess). The dashboard lists eps 55-60 as published and 16 subs.

**11 Lessons/report.** Hypotheses table not updated (nothing to score). Commit/push after this file.

## Fix list for the real routine
1. Fix `tools/setup.sh` (misaki `--use-pep517`, `env.sh` under `set -e`, do not write a success timestamp on failure).
2. Windsor upload rate limit: check whether it is a quota that resets daily; if so, space uploads, retry later, or plan the Studio fallback (step 10) as the normal path for batches; add a retry-later note to the run book.
3. Run book step 9: say "use the commit-SHA raw URL; never curl the URL before pushing".
4. Add a video-id column to `docs/episodes.md` so the measure agent can map episodes to videos.
5. Decide whether fact-check and metadata/translation must be separate agents (runbook table) or can stay in the builder (faster, the dry run did it in the builder).
6. Meta file should carry tags + playlist (`meta_en.json`) so upload needs no copy from `youtube-metadata.md`.

## Addendum: Chrome upload of ep 61 (2026-11-26, ~15:04-15:22 UTC, ~15 min)
Source: Trường asked in chat to switch to Chrome. Browser: Windows Chrome, one connected browser, Studio signed in (UI in Vietnamese). The `__wid_*` helper scripts from the run book were NOT in localStorage on this browser (different profile), so the helpers were rewritten (about 6 JS calls).
- Upload: `fetch()` of the commit-SHA raw URL (3,641,418 bytes) into `input[name=Filedata]` on `/videos/upload?d=ud` worked. Video id av2Gxw-DZGA. Title and description by `execCommand('insertText')`, 1,283 chars. Tags: the channel defaults already add 5 chips (science, explained, why, animation, everyday science); I added the 10 ep 61 tags with Enter. Altered content = No (radio click). Playlist "Your Brain Is Tricking You" ticked. Related video = "Make a Floating Finger..." (JS click on the card). EN subtitles from `subtitles.srt` through the captured `captions-file-loader` input then `#publish-button`. Visibility step showed "Không công khai" (Unlisted); saved with the real "Lưu" click. "Đã kiểm tra xong, không phát hiện vấn đề" came before saving.
- Translations: all 7 (vi, th, ja, ko, zh-Hant, id, fil) in one background job, about 25 s each (~3 min total); the table shows 1 subtitle and "Đã xuất bản" title for every row. Language labels: Tiếng Việt, Thái, Nhật, Hàn, Indonesia, Philippines (for fil), Trung (Phồn thể).
- Dubbed audio: "Âm thanh → Thêm → Chọn tệp" with `dub.ja.mp3` and `dub.zh-Hant.mp3` (both 498,861 bytes, different md5) then "Xuất bản" worked; both rows show "Đang xử lý..." (still processing at the end of the run). Closing a language dialog asks "Lưu và tiếp tục?": answer "Lưu nội dung thay đổi".
- **Music: not done.** The Editor's "Âm thanh" tool is disabled while multi-language audio is processing (Studio tooltip: cannot add audio while multi-language audio is being processed; remove pending tracks first). So the run book order should be: music first, dubs after (guess: the old runs added dubs only later or on different videos).
- Not done: end screen, thumbnail (the video has an auto thumbnail), A/B test.
- Wall time (Chrome): upload+details ~6 min, subtitles ~1 min, translations ~4 min, dubs ~3 min; no popups or login prompts. The Windsor error text did not recur because Windsor was not retried (per Trường's instruction).
- Fix list additions: (7) music before dubs; (8) keep the helper code in the repo (tools/studio/*.js) instead of in localStorage, so a fresh browser profile works.
