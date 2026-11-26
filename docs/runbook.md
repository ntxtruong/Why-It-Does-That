# Run book v19 (2026-11-26): the Wednesday/Friday production run

Approved by Trường on 2026-11-26 ("Duyệt, làm và chạy thử"). The scheduled task prompt stays short and points here, so change the routine by editing this file, not the task. CLAUDE.md (core) still wins over this file on any conflict; say so in one line.

Goal of every run: 3 Shorts (or the number the prompt names), each with an independent review score ≥ 7.5 and no P0, on YouTube as **Unlisted**, with EN subtitles, 7 translations and ja/zh dubbed audio, and a short Vietnamese report. Never Public, never scheduled, never deleted unless Trường asks in chat.

## Token rules (read first)

- The coordinator (this session; its model is picked automatically) only orchestrates: read CLAUDE.md, this file, `state/queue.md`; write briefs; merge results. Everything heavy goes to a subagent with an explicit model.
- Each agent reads only its pack (table below). Point to files; never paste file contents into prompts.
- Never read `.env`. Never read whole `docs/episodes.md` into a builder; give it the list of titles to avoid.
- Escalate one model step (Haiku → Sonnet → Opus) only when a task fails twice or a review flags a defect the cheaper model caused; note it in the report.

| Step | Agent | Model | Reads |
|---|---|---|---|
| 1 Measure | measure agent | Haiku | this file §1, `research/shorts-results.md` (last block only) |
| 2 Learn | coordinator | (auto) | `docs/learning.md` Hypotheses + Learnings |
| 3 Research + pick topics | coordinator or one research agent | Sonnet | `research/hook-swipe-file.md`, titles from `docs/episodes.md` |
| 4 Script + 6 Build | build agent, one per Short or two Shorts | Opus | CLAUDE.md, `docs/production.md`, its brief, the other builders' `retro.md` |
| 5 Fact-check | fresh agent per batch | Sonnet | the scripts only |
| 7 Review | fresh agent per round | Sonnet (Opus only if two rounds in a row do not raise a score) | the gate checklist in its brief + contact sheets |
| 8 Translate, dub, metadata | one agent per batch | Haiku | `docs/glossary.md`, `tr_input.json`, the episodes' `youtube-metadata.md` |
| 9 Upload | coordinator | (auto) | this file §9 |
| 10 Browser finishing | browser agent | Sonnet | `docs/upload-studio.md`, `state/queue.md` |

## 0. Setup (silent)

1. `mcp__claude-code-remote__add_repo` (owner `ntxtruong`, repo `Why-It-Does-That`, access `push`), clone as its result says. Ignore `push_check`; a real push plus `git ls-remote` proves it.
2. Work on the `claude/*` branch with the newest commit (explicit refspec). Never push to main, force-push, or delete branches.
3. `bash tools/setup.sh`, then `. tools/env.sh` in every rendering shell.
4. Read `state/queue.md`. Do its open items first (unfinished episodes, uploads, browser finishing), then the new work.
5. Next episode number = last row of the table in `docs/episodes.md` + 1.

## 1. Measure (Haiku agent, no browser needed)

- vidIQ: `vidiq_channel_videos` / `vidiq_video_stats` / `vidiq_channel_analytics` for channel `UC9sC_yvLVzT19dxs39Q22fg`: per Short views, average view duration, stayed % or average % viewed where offered, likes, subs gained.
- If vidIQ gives nothing: Windsor `get_data` (connector `youtube`; call `get_fields` first).
- Append one dated block to `research/shorts-results.md`; mark which tool gave which number. Missing numbers stay missing; never estimate them.
- Retention graphs of the best and worst Short still need YouTube Studio: only when the browser step (10) runs, and then cheaply (read the page text, not screenshots).

## 2. Learn (coordinator)

Score predictions in the Hypotheses table (`docs/learning.md`; under 48 h public = too early). One lesson with evidence in Learnings; keep Learnings under about 60 lines.

## 3. Research and pick topics

≤ 5 lookups in total (vidIQ `vidiq_outliers`, `vidiq_keyword_research`, `vidiq_trending_videos`, web search). Add 2–3 scored candidates to the swipe file. Pick one Short per pillar group as in the v18 rules (favour Kitchen Science, Animals Explained, Why Is It Designed Like That?, Your Brain, Your Body). Never repeat a row of `docs/episodes.md`. No idea gate.

## 4–7. Script, fact-check, build, review

As in the v18 routine and the "Lessons from the 2026-11-26 agent batch" section of CLAUDE.md, unchanged:
- Brief file `agents/brief-<eps>.md`: topic table, voice "auto" from `tools/voices.json`, Related ep, hard v5 rules, ep 61+ rules, the mascot rule (off by default), shared `flock /tmp/wid-heavy.lock` for TTS/snapshot/render/encode/QC/dub, no commit/push/CLAUDE.md/browser for builders. Copy the standing gate checklist into the brief so reviewers need nothing else.
- Builders (Opus) write the script, then a **separate Sonnet fact-check agent** checks every number and mechanism before scenes are built; the coordinator re-checks if a builder had no separate fact-check.
- Builders build, run their own critic pass, write `epNN/retro.md`, run `python3 ../tools/dub.py ja` and `python3 ../tools/dub.py zh-Hant` after translations (factor > 1.3 → shorten that language's lines and rerun).
- Fresh Sonnet reviewer each round, contact sheets only, writes `agents/reviewN-<eps>.md`. Fix all P0/P1, re-render, and re-review **only the Shorts that have not passed**. Max 3 rounds. Ship nothing below 7.
- Rate limit hit: save state to `state/queue.md`, report, resume after the reset.

## 8. Translations, dubs, metadata (Haiku agent)

Title, description WITHOUT any mention of AI, Claude, TTS or how it was made (sources list stays), tags, pinned-comment draft in `youtube-metadata.md`; 7 translations (vi, th, ja, ko, zh-Hant, id, fil) with the glossary. Optional: `vidiq_score_title` on 2–3 title options, pick the best.

## 9. Upload (Windsor, no browser needed)

1. Push episode folders (with `dub.ja.mp3`, `dub.zh-Hant.mp3`, `subtitles.srt`) and `media/` files; verify with `git ls-remote`. No push → no public URL → stop the upload and report.
2. Duplicate guard: if `docs/episodes.md` already has a video URL for the episode, or the channel's video list (vidIQ) has the same title, skip.
3. Windsor `execute_action`, connector `youtube`, action `upload_video`: `video_url` = `https://raw.githubusercontent.com/ntxtruong/Why-It-Does-That/<branch>/media/<file>.mp4`, `title`, `description`, `tags`, `category_id` "27" (Education), `made_for_kids` false, `privacy_status` **"unlisted"**, no `publish_at`. File must be ≤ 100 MB (a 30 s Short is far below; if not, re-encode at a lower bitrate).
4. `add_video_to_playlist` for the pillar playlist (if the playlist does not exist yet, leave it for step 10, which creates it Unlisted).
5. Write the video URL into `docs/episodes.md` and add a "browser finishing" item per video to `state/queue.md`.
6. If Windsor fails twice: leave the whole upload to step 10 (the v18 Chrome upload in `docs/upload-studio.md`) and note it in the queue.

## 10. Browser finishing (Sonnet agent, Claude in Chrome on Trường's computer)

Only if Claude in Chrome is reachable. Confirm channel ID first; one foreground tab. For each queue item: EN subtitles, 7 translations (re-read the table after), dubbed audio on the Japanese and Chinese (Phồn Thể) rows, altered content = No, Related video, music by mood with licence "Không cần ghi công" confirmed before saving, mix 15, Save; create a missing pillar playlist Unlisted. Follow `docs/upload-studio.md` and its helpers (`__wid_up`, `__wid_full`, `__wid_h`, `__wid_music` in localStorage). Tick the item in `state/queue.md`.

Not reachable: say so in one line; the items stay in the queue for the next run. The video is already on YouTube as Unlisted, without subtitles, translations, dubs or music.

## 11. Lessons and report

- Predictions (stayed %, avg view s) per new Short into the Hypotheses table.
- Merge the round scores and the 2–3 most important new rules into the right file: rules every agent needs → CLAUDE.md core (drop or move a stale line for each one added, keep it under about 25 KB); production detail → `docs/production.md`; Studio detail → `docs/upload-studio.md`.
- Commit and push; update `state/queue.md` last.
- Report to Trường in short Vietnamese: numbers and what changed because of them; what was made (topic, voice, length, independent score per round, prediction); per video either **"sẵn sàng"** (uploaded + finished in the browser) or **"đã lên Unlisted, chưa làm đẹp"** with links; what could not be checked (ask him to listen to one video when a voice, SFX or dub changed). Tell him to schedule only videos marked "sẵn sàng".

## Hard rules

- Never make a video Public or schedule it unless Trường asks in chat; never delete a video; never sign in, type passwords or switch accounts; confirm the channel before any Studio action; never post comments.
- Never present an unverified number as fact.
- Vietnamese, Thai, Indonesian and Korean dubs are on hold until Trường decides.
- If Trường writes during a run, his message comes first.
