# Run book v19 (2026-11-26): the Wednesday/Friday production run

Approved by Trường on 2026-11-26 ("Duyệt, làm và chạy thử"). The scheduled task prompt stays short and points here, so change the routine by editing this file, not the task. CLAUDE.md (core) still wins over this file on any conflict; say so in one line.

Goal of every run: 3 Shorts (or the number the prompt names), each with an independent review score ≥ 7.5 and no P0, on YouTube as **Unlisted**, with EN subtitles, 7 translations (plus the trial languages in `docs/languages.md`) and ja/zh dubbed audio, and a short Vietnamese report. Never Public, never scheduled, never deleted unless Trường asks in chat.

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

- Language expansion data: `vidiq_channel_analytics` with `report: audience_geography` for the last 28 days (feeds the rule below).
- vidIQ: `vidiq_channel_videos` / `vidiq_video_stats` / `vidiq_channel_analytics` for channel `UC9sC_yvLVzT19dxs39Q22fg`: per Short views, average view duration, stayed % or average % viewed where offered, likes, subs gained.
- If vidIQ gives nothing: Windsor `get_data` (connector `youtube`; call `get_fields` first).
- Append one dated block to `research/shorts-results.md`; mark which tool gave which number. Missing numbers stay missing; never estimate them.
- Retention graphs of the best and worst Short still need YouTube Studio: only when the browser step (10) runs, and then cheaply (read the page text, not screenshots).
- Experiment readout (see "Experiments" below): for every Short at least 48 h old, record views, views per hour, average view duration in seconds, average % viewed, subs gained and shares, next to its experiment label.

## 2. Learn (coordinator)

Score predictions in the Hypotheses table (`docs/learning.md`; under 48 h public = too early). One lesson with evidence in Learnings; keep Learnings under about 60 lines. Update the experiment scoreboard (see "Experiments").

## 3. Research and pick topics

≤ 5 lookups in total (vidIQ `vidiq_outliers`, `vidiq_keyword_research`, `vidiq_trending_videos`, web search). Add 2–3 scored candidates to the swipe file. Pick one Short per pillar group as in the v18 rules (favour Kitchen Science, Animals Explained, Why Is It Designed Like That?, Your Brain, Your Body). Never repeat a row of `docs/episodes.md`. No idea gate.

Experiment labels: give every picked Short a label `hook=<try|why|claim> len=<short|long> look=<flat|boil>` (see "Experiments" for the current assignment) and write it in its brief. Optionally use one `vidiq_outliers` lookup on a topic we already cover, to see how small channels frame it.

## 4–7. Script, fact-check, build, review

As in the v18 routine and the "Lessons from the 2026-11-26 agent batch" section of CLAUDE.md, unchanged:
- Brief file `agents/brief-<eps>.md`: topic table, voice "auto" from `tools/voices.json`, Related ep, hard v5 rules, ep 61+ rules, the mascot rule (off by default), the experiment label, shared `flock /tmp/wid-heavy.lock` for TTS/snapshot/render/encode/QC/dub, no commit/push/CLAUDE.md/browser for builders. Copy the standing gate checklist into the brief so reviewers need nothing else.
- Builders (Opus) write the script, then a **separate Sonnet fact-check agent** checks every number and mechanism before scenes are built; the coordinator re-checks if a builder had no separate fact-check.
- Builders build, run their own critic pass, write `epNN/retro.md`, run `python3 ../tools/dub.py ja` and `python3 ../tools/dub.py zh-Hant` after translations (factor > 1.3 → shorten that language's lines and rerun).
- Fresh Sonnet reviewer each round, contact sheets only, writes `agents/reviewN-<eps>.md`. Fix all P0/P1, re-render, and re-review **only the Shorts that have not passed**. Max 3 rounds. Ship nothing below 7.
- Rate limit hit: save state to `state/queue.md`, report, resume after the reset.
- Builders also follow "Animation rules" below. Reviewers add two gate lines: "something happens in the first second" and "every scene hands over to the next (no stack of unrelated clips)".

## Animation rules (from the ClaudeAnimationBase guide, adopted 2026-11-26)

These are guidance for builders; CLAUDE.md and the brand kit win on any conflict.

1. Plan before drawing: write a short storyboard (one line per scene: what happens, how it hands over to the next) before any scene code.
2. Something always happens. Every shot has a character, object or quantity that does, changes or breaks something; no static explanatory frames.
3. One piece, not a pile of clips: each scene ends with a motion, colour or object the next scene picks up.
4. Show, don't write: keep on-screen text to the opening claim, the end card and numbers drawn next to the thing they describe (matches the existing "captions kept to the opening question and the end card" lesson).
5. Timing is the rule models get wrong most often: give each idea enough time to be read, and check with contact sheets at one frame per second.
6. Flat 2D with depth from overlap, scale and colour; no fake 3D projection.
7. Soft palette, no pure black or white (already in the brand kit).
8. Hand-drawn "boil" (line wobble reseeded 12 times a second, with fixed hashes for things that must stay put) is **experimental**: only on Shorts labelled `look=boil` (see Experiments). Do not apply it elsewhere.
9. Light is added, not painted over: use a glow/additive layer for anything that shines.

Source guide: ClaudeAnimationBase `ANIMATION_GUIDE.md` (p5.js engine; we keep Hyperframes as the engine and borrow the rules only). Check the licence of its mascot before using it; our own mascot rule is unchanged.

## Experiments (started 2026-11-26)

Data behind them (vidIQ): about 95 % of views come from the Shorts feed, average view 19 s (about 47 %), 16 subs on about 25 k views. The 2026-11-25 batch with "try it" hooks reached 1.0–1.6 k views in about a day; the 2026-11-16 batch with claim hooks got 37–160. This is one batch each, so treat the results as hints (guess, not proof). Impressions and swipe-away rate are not in vidIQ; Studio only (step 10).

Rules for all experiments: compare Shorts of the same pillar group, at least 4–6 per arm before concluding, read at 48 h or later, and never change more than the labelled variable.

| # | Question | Arms | Read at 48 h | Guess to test |
|---|---|---|---|---|
| E1 | Which hook gets more views? | `hook=try` (do-it-now) vs `why` (question) vs `claim` (statement), same length 25–30 s | views, views/hour | `try` wins |
| E2 | Does length matter for views? | `len=short` (20–25 s) vs `len=long` (40–50 s), similar topics | views, average view seconds, % viewed | short has higher % but not higher views |
| E3 | Does a hand-drawn look help? | `look=boil` vs `look=flat`, two Shorts each | % viewed, shares | boil raises % viewed a little |
| E4 | Do outlier topics work for us? | Our angle on topics that small channels got 20 k+ views on (ice, mosquito bites, "How X becomes Y") | views against the current typical ~700 | topic is not the gap; hook and picture are |
| E5 | Can we convert viewers to subs? | End with a "part 2" promise and a series playlist vs the current end | subs per 1,000 views (now about 0.6), channel-page views | small lift |

Scoreboard: one table in `docs/learning.md` (columns: episode, label, 48 h views, avg view s, % viewed, subs, shares). The coordinator updates it in step 2, and Hypotheses predictions stay as before.

## 8. Translations, dubs, metadata (Haiku agent)

Title, description WITHOUT any mention of AI, Claude, TTS or how it was made (sources list stays), tags, pinned-comment draft in `youtube-metadata.md`; 7 translations (vi, th, ja, ko, zh-Hant, id, fil) with the glossary, plus the trial subtitle languages hi, ms, pl from `docs/languages.md` (machine-drafted, native check pending; de is a later candidate). Run the language expansion rule (below) once per run. Optional: `vidiq_score_title` on 2–3 title options, pick the best.

## 9. Upload (Windsor, no browser needed)

> **2026-11-26 (Trường: "đổi qua chrome đi upload"): until Windsor's rate limit is understood, Chrome (step 10's Studio upload, `docs/upload-studio.md`, plus the ep 61 notes in `state/dryrun-v19.md`) is the primary upload path. Windsor `upload_video` returned "YouTube rate-limited the upload" 3 times in a row on 2026-11-26; use Windsor only as a fallback or for metadata.** Use the commit-SHA raw URL for any fetch, never probe the branch URL before the push (404 is cached).

1. Push episode folders (with `dub.ja.mp3`, `dub.zh-Hant.mp3`, `subtitles.srt`) and `media/` files; verify with `git ls-remote`. No push → no public URL → stop the upload and report.
2. Duplicate guard: if `docs/episodes.md` already has a video URL for the episode, or the channel's video list (vidIQ) has the same title, skip.
3. Windsor `execute_action`, connector `youtube`, action `upload_video`: `video_url` = `https://raw.githubusercontent.com/ntxtruong/Why-It-Does-That/<branch>/media/<file>.mp4`, `title`, `description`, `tags`, `category_id` "27" (Education), `made_for_kids` false, `privacy_status` **"unlisted"**, no `publish_at`. File must be ≤ 100 MB (a 30 s Short is far below; if not, re-encode at a lower bitrate).
4. `add_video_to_playlist` for the pillar playlist (if the playlist does not exist yet, leave it for step 10, which creates it Unlisted).
5. Write the video URL into `docs/episodes.md` and add a "browser finishing" item per video to `state/queue.md`.
6. If Windsor fails twice: leave the whole upload to step 10 (the v18 Chrome upload in `docs/upload-studio.md`) and note it in the queue.

## 10. Browser finishing (Sonnet agent, Claude in Chrome on Trường's computer)

Only if Claude in Chrome is reachable. Confirm channel ID first; one foreground tab. For each queue item: EN subtitles, 7 translations (re-read the table after), dubbed audio on the Japanese and Chinese (Phồn Thể) rows, altered content = No, Related video, music by mood with licence "Không cần ghi công" confirmed before saving, mix 15, Save; create a missing pillar playlist Unlisted. Follow `docs/upload-studio.md` and its helpers (`__wid_up`, `__wid_full`, `__wid_h`, `__wid_music` in localStorage). Tick the item in `state/queue.md`. When the page is open anyway, read impressions and the swipe-away share for the Shorts in the experiment scoreboard (page text only).

Not reachable: say so in one line; the items stay in the queue for the next run. The video is already on YouTube as Unlisted, without subtitles, translations, dubs or music.

## 11. Lessons and report

- Predictions (stayed %, avg view s) per new Short into the Hypotheses table, with its experiment label.
- Merge the round scores and the 2–3 most important new rules into the right file: rules every agent needs → CLAUDE.md core (drop or move a stale line for each one added, keep it under about 25 KB); production detail → `docs/production.md`; Studio detail → `docs/upload-studio.md`.
- Commit and push; update `state/queue.md` last.
- Report to Trường in short Vietnamese: numbers and what changed because of them; what was made (topic, voice, length, independent score per round, prediction, experiment label); the experiment scoreboard in two lines; per video either **"sẵn sàng"** (uploaded + finished in the browser) or **"đã lên Unlisted, chưa làm đẹp"** with links; what could not be checked (ask him to listen to one video when a voice, SFX or dub changed). Tell him to schedule only videos marked "sẵn sàng".

## Language expansion (standing rule, 2026-11-26)

Details, audience table, trial plan and log: `docs/languages.md`. Each run: read audience countries (step 1), compare with the languages we have, and add any language that has about 100 or more views in 28 days (or 2 %) and a workable path: subtitles and metadata when a translation is possible, a dubbed track only with a verified TTS license and a quality check by Trường. Record it in the log of `docs/languages.md` and one line in `docs/learning.md` Learnings, add it to step 8 and the glossary, and mention it in the report. Hindi dubbed audio (Kokoro) is a one-video trial; voice quality and YouTube's per-video track limit are unverified. Unlisted only, nothing Public or scheduled, no deletes, as always.

## Hard rules

- Never make a video Public or schedule it unless Trường asks in chat; never delete a video; never sign in, type passwords or switch accounts; confirm the channel before any Studio action; never post comments.
- Never present an unverified number as fact.
- Vietnamese, Thai, Indonesian and Korean dubs are on hold until Trường decides. Hindi dub is a trial on one Short only (see `docs/languages.md`).
- If Trường writes during a run, his message comes first.
