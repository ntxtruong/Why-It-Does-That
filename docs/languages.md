# Languages: current coverage, trials and the expansion rule

Added 2026-11-26 (Trường: "cập nhật ngôn ngữ cho các tệp khán giả, mỗi lần có ngôn ngữ mới mình cập nhật thêm cho kênh luôn"). Owner rules are unchanged: Unlisted only, nothing Public or scheduled, no deletes, no comments.

## Audience data (vidIQ `vidiq_channel_analytics`, `audience_geography`, 2026-10-29 to 2026-11-26, top 25 countries, about 12.8 k views)

| Country | Views | Language status |
|---|---|---|
| VN | 7,163 | vi subtitles; VN dub on hold |
| PH | 1,378 | fil subtitles |
| US / GB / AU / CA | 1,221 / 360 / 167 / 99 | English |
| ID | 656 | id subtitles; id dub on hold |
| **IN** | **604** | **hi: new (trial)** |
| **MY** | **255** | **ms: new (trial)** |
| BD | 141 | bn: later, no verified TTS |
| **PL** | **122** | **pl: new (trial)** |
| DE | 106 | de: later (next candidate) |
| ES, MX, FR, IT | 27, 39, 26, 29 | Kokoro supports es/fr/it natively, but the audience is tiny: not now |

Views are counted from the first frame since 2026-08-27, and a country is not proof that viewers need subtitles or a dub. Language benefit is a guess until the trial is read.

## Language lists the pipeline uses

| Item | Languages | Status |
|---|---|---|
| Subtitles and translated titles/descriptions | vi, th, ja, ko, zh-Hant, id, fil | standing |
| Subtitles and translated titles/descriptions, **trial** | hi, ms, pl | start with the first run after 2026-11-26; keep to subtitles, title and description |
| Later candidate | de | add when its audience passes the rule below |
| Dubbed audio | ja (jf_alpha), zh-Hant (zf_xiaobei) | standing from ep 61 |
| Dubbed audio, **trial** | hi (Kokoro, lang_code `h`) | one Unlisted Short only, see below |
| Dubbed audio on hold | vi, th, id, ko | until Trường decides |

## Trial plan: one Unlisted Short

1. Pick one new Short of the run. Translate title, description and subtitles into hi, ms, pl with `docs/glossary.md` as the base; append new hi/ms/pl/de terms to the glossary as new tables, same format.
2. Hindi dub: Kokoro supports Hindi (README of hexgrad/kokoro, lang_code `h`). The exact voice names, the phoneme path in `kokoro-onnx` and the quality are **unverified**. `tools/dub.py` has no hi entry yet: add one only after a listening test of three sample sentences by Trường. Until then no hi audio track is uploaded.
3. Upload as Unlisted like every other video. Add hi, ms, pl subtitles and titles in the Studio translations page; the hi audio track only after step 2 passes.
4. After 7 days read subtitle-language and audio-language views with vidIQ `vidiq_channel_analytics_extended` (`advanced_analytics`: `caption_languages`, `audio_languages`, `translation_use`); it needs the vidIQ browser extension on Trường's computer. If it is not connected, say so and keep the language until the next run.
5. Native-speaker check of the translations is pending for hi, ms, pl (machine-drafted, same status as the other 7 languages). YouTube's limit on audio tracks and subtitle languages per video is **unverified**: read the YouTube help page before adding more than the languages above.

## Standing rule: language expansion (every run, step 1 and step 8)

1. Read audience countries with vidIQ `vidiq_channel_analytics` (`report: audience_geography`, last 28 days).
2. Compare with the language lists above. A country that has no matching language and brings **at least about 100 views in the 28 days, or 2 % of views**, is a candidate.
3. Add a candidate as subtitles and metadata when a translation is possible. Add a dubbed track only when a TTS path with a verified license (commercial use allowed for weights and code) and an audible quality check by Trường exist.
4. Record each decision in the log below, with date, country, views, language and what was added; add one line to Learnings in `docs/learning.md`.
5. Add each new language to the translation step (§8 of the runbook) and the glossary, and tell Trường in the report. Never make a video Public or scheduled because of it.
6. Candidate TTS checked on 2026-11-26 (README only, nothing listened to): Kokoro (es, fr, hi, it, pt-BR, ja, zh native; Apache-2.0), Chatterbox Multilingual (ja, ko, zh, ms and 20 more, no vi/th/id/fil; code MIT, repository archived, weights license unverified, adds a watermark), CosyVoice 3 (zh, en, ja, ko, de, es, fr, it, ru; code Apache-2.0, weights unverified), VieNeu-TTS v3 Turbo (Vietnamese, README says Apache 2.0, v4 is closed). F5-TTS weights are CC-BY-NC: do not use.

## Log

| Date | Decision |
|---|---|
| 2026-11-26 | Added hi, ms, pl to the subtitle/metadata list (trial) and a hi dub trial; de listed as next candidate. Reason: IN 604, MY 255, PL 122 views in 28 days. |
