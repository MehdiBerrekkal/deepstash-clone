# Brain: playtest review and polish pass

This review covers all 20 games, both IQ-style test modes and the quizzes. They were played through on an emulated iPhone-sized screen (402×874) in both light and dark mode, using `brain2-test.js` (every game to its results) and `flows-test.js` (practice, pause/resume and today's session).

Severity: **High** means it breaks the experience or a puzzle is wrong. **Medium** means it is noticeably rough. **Low** means polish.

## Findings and what was done

### All games

| Severity | Issue | Fix |
| --- | --- | --- |
| High | No way to pause, and leaving mid-run lost everything. | Pause button in the HUD that stops the clock. "Save and quit" stores puzzle runs, and you can resume them from the game page or the Brain home for 24 h. |
| High | The first-run rules were text only. | A practice round: one easy worked item (not scored) with its explanation, or a short guided round for N-Back, Digit Span, Block Span and Tower. It is suggested the first time and available afterwards. |
| Medium | Difficulty felt flat: the staircase needed two right answers per step, so a 10-item run could rise only about 4 levels. | Warm-up: the first three items step up on every right answer. Levels are shown on screen as "Level N" rather than "D3". |
| Medium | Feedback was dry: a +points popup and nothing else. | A short pause between tapping and seeing the result. Then ✓ badge on the right answer, a streak multiplier (×1.5 → ×3) whose chip turns gold, amber then pink and glows, and a chime that climbs with the streak. Also "Level N ↑/↓" popups, "So close" for near misses, "−2 s" in sprints, a dot row of right and wrong answers, and pressed-state scaling on buttons. |
| Medium | The celebration toast covered the results. | Personal best and rank-up are now banners inside the results. |
| Medium | Results showed little. | Accuracy, time per answer, level change (from → to), XP, a bar against your previous best, rank progress, and a mistake review showing your answer next to the right one with the explanation. |
| Medium | Dead ends after a game. | Results offer: play again at the new level, try a suggested game from your weakest area, or the next game in today's session. |
| Low | The screen felt static. | Two soft glows in the area's colour drift slowly behind each game. They hold still when reduce-motion is on. |
| Low | Some option tiles clipped figures (paper folding). | Tile padding and figure size fixed. |
| Low | Numbers in the display font rendered as old-style figures ("7²"-like). | Lining numerals. |

### Generators (puzzle quality)

Checked by `verify.mts`: every generator at every level 1-10, 150 items each. Answers are always in range, there are no duplicate options, and each item has at least 4 options (Deduction is 2 by design). Figures are compared by appearance, so a square turned 45° counts as a diamond.

| Game | Severity | Issue | Fix |
| --- | --- | --- | --- |
| Number Series | Medium | Level 6 could still draw "×3 each time" (the window was 5 levels wide). A distractor equal to the last shown number was a giveaway. | The window is now 3 levels: each level draws from its own families. The giveaway distractor was removed. |
| Number Matrix | Medium | Levels 6-10 drew the same "multiply" rule. | Rules are tied to a level window, with two new hard rules (a×b+a+b, a²−b²). |
| Verbal Analogies | Medium | The explanation just restated the analogy. | Each analogy names its relation ("a specialist and what they produce", "opposites"…). |
| Matrix Reasoning | Low | At levels 1-3 only one or two attributes vary, so seven distractors had to break constant attributes and looked silly. | 5 options at levels 1-3 and 7 from level 4. |
| Speed games | Low | No explanation for practice or mistakes. | Each item now says why its answer is right. |
| Colour Conflict | Medium | Red and green inks are hard to tell apart with colour blindness. | Okabe-Ito-style palette: red-orange, blue, yellow, pink, teal green and grey. Each option also shows the colour's name. |

### Memory and planning games

| Game | Severity | Issue | Fix |
| --- | --- | --- | --- |
| Dual N-Back | Medium | Missed matches got no feedback, so you never learned what you missed. The start was blank. | A missed match flashes amber with "missed a match". Wrong presses say "not a match". There is a "Get ready…" lead-in and a live count of hits. Practice is 1-back with "Match: same square — press now" hints. |
| Digit Span | Low | Typed digits were a plain string. | Answer slots fill in one by one. A wrong answer shows which digits were right and reveals the sequence. |
| Block Span | Low | Tapped blocks stayed lit without saying if they were right. | Each tap chimes on a rising scale. A wrong tap shows the correct path numbered in amber. Blocks are bigger (tap targets ≥ 50 pt). |
| Tower Planning | Medium | All discs were the same colour, so matching the faded goal was hard. There was no undo. | Each disc size has its own colour. The goal sits in a framed box, larger. Added "Reset this puzzle", and a "Perfect" message when you solve it in the fewest moves. |

### Brain home

| Severity | Issue | Fix |
| --- | --- | --- |
| Medium | No clear "what do I do now". | A **Today's session** hero: 3 games (your two weakest areas plus one more), the same all day. It shows progress, then a summary with XP and accuracy. |
| Medium | Unfinished runs were invisible. | A **Continue** card. |
| Low | Area progress was only on the radar. | Six progress rings, one per area. A streak shows on the session card. An empty profile says "Play a few games to build it" rather than showing a dash. |
| Low | No volume control. | A Sound card with on/off and four volume steps. The sounds are softer (sine chimes, no square-wave clicks). |

### Difficulty calibration

The simulation in `verify.mts` models a player whose chance of a right answer falls off logistically with level. With the warm-up, a 10-item run ends at about level 1 for a weak player and about level 6 for a strong one. The stored level carries over between runs, so it keeps climbing. The staircase settles where you get about 70% right.

## Known limitations

- The IQ-style test can't be paused or resumed. That is deliberate: it is timed.
- Sound effects play in the web app only. On the native app, haptics stand in for them.
- N-Back speaks letters with the system voice. If the phone is on silent, only the shown letter is available.
- Difficulty tuning is rule-based plus simulation. It isn't calibrated against real players' data.
