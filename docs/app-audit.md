# App audit (October 2026)

Every main screen was walked through on the live site, at iPhone 16 Pro size (402×874), in light and dark mode: Home, Explore, Library, Find a free book, Brain (home, a game, a quiz, the test), Stashes, You, Voices, Review, Highlights, Favorites, a book page, a classic page, the reader and a topic page. The script is `audit.js` in the e2e test folder. It records console errors, content running off the edge, small tap targets, and a cold load on throttled 4G with a 4× slower CPU.

## Measurements

| | Before | After |
| --- | --- | --- |
| First thing on screen, cold, slow 4G + 4× CPU | ~5.0 s (blank page until the app started) | Instant loading screen in the HTML; app ready in about the same time |
| JavaScript downloaded at startup (gzip) | ~860 KB | Smaller: the zip library (EPUB) and the image-capture library (share cards) now load only when used |
| Console errors across all screens | 0 | 0 |

## Findings and fixes

| Severity | Finding | Fix |
| --- | --- | --- |
| High | "Robotic" voices: the natural voice was only used after a manual download, so most people heard the device's basic voice | The natural voice is the default (downloads once on first Listen). 88 books now have human narration from LibriVox |
| High | No way to keep data if browser storage is cleared or the phone changes | Backup & restore in You (file export/import, merge or replace) |
| Medium | Library: the "Find a free book" card ran off the right edge | Margins fixed |
| Medium | Blank screen while the app downloads on a slow connection | Inline loading screen (follows light/dark) |
| Medium | No reminders | Daily reminder added to the calendar (.ics with an alert). A static site can't send push notifications without a server |
| Medium | Interface only in English | Language setting (Automatic / English / Français): tabs, Home, Library, Explore, You, Brain and all 20 games |
| Medium | Brain had no sense of progress over time | Progress chart per area, a rank-up moment and a shareable score card |
| Low | Sleep timer stopped mid-word | It stops at the end of the sentence |
| Low | "Overflow" warnings on Library, Explore and book pages | False positives: horizontal shelves that scroll on purpose |
| Low | Small tap targets reported for favourite hearts on covers | They have a larger hit area (hitSlop), so they're fine on a phone |

## Known limits

- Background push notifications need a server; the calendar reminder replaces them.
- Human narration streams from the Internet Archive and needs a connection. Offline download of narration isn't available yet: iPhone audio needs ranged requests, which a simple offline cache doesn't serve.
- Higher-quality AI voices ("high" Piper models, Kokoro) are too slow to run live on a phone in the browser. The medium voices stay.
- Idea cards are still in their original language (mostly English); only the interface is translated.
