# Episode 1 review (2026-10-08)

Trường asked for this before episode 2. Everything here is measured from `media/ep01-rainbow-1080p.mp4` with `tools/qc_video.py` and `tools/asr_check.py`, or read from YouTube Studio.

## YouTube numbers, five days after publishing

18 views from 2 unique viewers, 43 thumbnail impressions, click-through 7.0%, 0.3 hours watched, no retention graph yet. Too little to steer anything; the findings below come from the file.

## What is weak

| Finding | Measurement |
| --- | --- |
| Frozen picture | 10 stretches longer than 3 s, 59 s in total (19% of the video), all between 0:27 and 2:42. The scene right after the hook (`oneray`) is still 75% of the time; the longest freezes are 9.0 s and 9.5 s. |
| Small labels | 25 of 52 `text()` calls are 26 to 32 px at 1080p. On a phone in portrait that is about 5 px. |
| Empty frame | Lit area is 2 to 7% of the frame in the first half. The mascot is absent from 0:21 to 2:43. |
| Opening | No question on screen in the first 5 s. The thumbnail ("ALWAYS 42° why?") shows no rainbow. |
| Ending | 4:10 to 5:00 is one picture with small changes. |
| Narration rhythm | 788 words, 173 words a minute while speaking, sentences up to 11.3 s, a fixed 0.45 s gap between beats, so the picture never gets time to play on its own. |
| Narration check | Speech recognition against the script: 13 of 796 words differ, none a clear mispronunciation. Worth a listen: 3:31 ("bow") and 4:14 ("bounced"). |

## Rules taken from this for later episodes

1. No picture frozen for more than 3 s outside the end card (`tools/qc_video.py` fails the render otherwise).
2. Text at least 40 px at 1080p; the subject fills most of the frame.
3. The question is on screen within the first 3 s; the thumbnail shows the phenomenon itself.
4. Sentences of about 7 s at most; a 1 to 2 s pause after each key idea; 900 to 1,000 words for a long video.
5. The mascot stays present and reacts to what is shown.
6. `tools/asr_check.py` runs before Trường listens; he gets the list of places to listen to.
