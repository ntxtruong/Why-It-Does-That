# Work queue

Open work carried between runs. The coordinator reads this first and updates it last. One line per item; tick `[x]` and keep ticked items for one run, then delete them.

## In progress

(none)

## Waiting for browser finishing (step 10 of docs/runbook.md)

- [ ] ep61 https://youtube.com/shorts/av2Gxw-DZGA (id av2Gxw-DZGA, Unlisted, uploaded via Chrome 2026-11-26 ~15:04 UTC): done = title, description, tags, playlist Your Brain Is Tricking You, Related ep 52, altered=No, EN subtitles, 7 translations with subtitles, ja + zh-Hant dubbed audio published (showed "Đang xử lý" at ~15:20 UTC). STILL TO DO: music (editor Âm thanh is blocked while the dubs process: Studio says to wait), end screen not done, thumbnail not set. Re-check that the two dubs show published in the translations table.
(eps 55–60 were uploaded and finished in Claude in Chrome on 2026-11-26)

## Other

- [ ] 2026-11-27 run (v20): eps 62, 63, 64 are BUILT and pushed (commit a794691 on claude/project-thread-1ku2hd) but NOT uploaded: Windsor `upload_video` was rate-limited again on its one retry, and no browser was connected. Per ep: media/epNN-*.mp4, ep NN/dub.ja.mp3, dub.zh-Hant.mp3, subtitles.*.srt (en + vi th ja ko zh-Hant id fil + trial hi ms pl), meta_en.json, youtube-metadata.md (tags, Related, playlist, pinned comment). Next run: upload (Chrome/built-in browser first), full Studio finishing, then schedule. Scores: ep62 7.5 (round 2); ep63 7.0 and ep64 7.5 at round 3, then a last fix round with no re-review: re-review both (needs >= 7.5) BEFORE scheduling. hi/ms/pl subtitles and hi dub are trial; hi dub not built (needs Trường's listening test).
