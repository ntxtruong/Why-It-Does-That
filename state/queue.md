# Work queue

Open work carried between runs. The coordinator reads this first and updates it last. One line per item; tick `[x]` and keep ticked items for one run, then delete them.

## In progress

(none)

## Waiting for browser finishing (step 10 of docs/runbook.md)

- [x] ep61 https://youtube.com/shorts/av2Gxw-DZGA (Unlisted): details, EN subs, 10 subtitle languages (7 standing + hi/ms/pl trial), ja + zh-Hant dubs (re-checked 2026-11-26 ~15:30 UTC in the built-in browser: both show "Đã xuất bản" again after the music edit), music "Spring In My Step" mix 15. Not possible: end screen on a Short. Thumbnail left on automatic frame 0. Delete this line next run.
- [ ] Windsor `upload_video` retry: it was rate-limited 3 times on 2026-11-26 ~15:00 UTC. Retry once in the next run (commit-SHA raw URL) with a fresh small Short; if it still fails, keep Chrome as the upload path and note the time and error text.
(eps 55–60 were uploaded and finished in Claude in Chrome on 2026-11-26)

## Other

(none)

## Schedule

- 2026-11-26: scheduled task v19 `trig_011GCsUutw8UMVbC7F6ePJeT` (Wed + Fri 07:47 Asia/Ho_Chi_Minh, new thread per run) replaces v18 `trig_01Ti3QYFc7qP7UeRiEBBHsnP`, which is DISABLED (not deleted). Prompt copy: `/mnt/project-files/reports/schedule-v19-prompt.md` in the project. Open risks: unverified that a scheduled run can reach the built-in browser (needs Trường's computer on, app open); Windsor rate limit; no audio listening; translations unreviewed.
- 2026-11-26 (Trường): any computer with the Claude app open can serve the built-in browser; it need not be the same machine as this session. In a run, use whatever device `list_devices`/browser tools show; only report "no browser" if none is reachable.
- 2026-11-26 (Trường): run time moved to 01:05 Asia/Ho_Chi_Minh and runs now schedule publication (runbook step 11). Task v20 replaces v19 trig_011GCsUutw8UMVbC7F6ePJeT (disabled).
