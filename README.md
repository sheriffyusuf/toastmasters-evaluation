# Evaluating Speeches at Toastmasters

A self-study course on evaluating speeches at Toastmasters club meetings — built from
Toastmasters International's own published criteria, not from opinion.

**Read it here: <https://sheriffyusuf.github.io/toastmasters-evaluation/>**

---

## What this is

The evaluation role is the highest-leverage seat in a Toastmasters meeting. It forces
analytical listening, structured thinking and unrehearsed eloquence at the same moment.
This course treats it as a discipline with mechanisms, not a set of etiquette rules.

Everything is grounded in primary sources. Where a technique is this course's own
framing rather than Toastmasters', it says so.

## Contents

| | Document | What it is |
|---|---|---|
| **Lesson 01** | [You Are Not a Judge](lessons/0001-you-are-not-a-judge.html) | What an evaluation actually is: the feedback-versus-advice distinction, the three ingredients, and the two failure modes. 4 drills. |
| **Lesson 02** | [The Anatomy of a Speech](lessons/0002-the-anatomy-of-a-speech.html) | The map of everything you judge: the seven core criteria, content versus delivery, the reconstruction test, and the order of repair. 4 drills. |
| **Lesson 03** | [Purpose and Structure](lessons/0003-purpose-and-structure.html) | The content half in depth: topic versus purpose, the four general purposes and the specific-purpose standard, the seven organisational structures, and the five checks for deliberate structure. 4 drills. |
| **Lesson 04** | [Voice: Pitch, Tone, Volume, Pace](lessons/0004-voice-pitch-tone-volume-pace.html) | The delivery half begins: the voice as a second text, the five tools and their failure signatures, the six distinctions that decide which advice helps, the Speech Profile, and the symptom-to-cause diagnosis. 4 drills. |
| **Reference 01** | [Glossary of Terms](reference/0001-glossary.html) | Canonical vocabulary. Pitch, tone, inflection, articulation, the four gesture types, the eight organisational structures. |
| **Reference 02** | [The Excellence Ladder](reference/0002-what-makes-an-evaluation-excellent.html) | Good, great and excellent — defined in Toastmasters' own words, for both the speech and the evaluation of it. |
| **Reference 03** | [Evaluator's Quick Card](reference/0003-evaluators-quick-card.html) | The operational checklist. Fits on one phone screen. Open this at the meeting. |

Lessons 05–09 are planned. The roadmap is on the [course home page](index.html).

## How it is built

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no CDN, no
analytics, no external font requests. It runs offline once loaded and prints cleanly.

- `assets/course.css` — one shared stylesheet for every page
- `assets/quiz.js` — the interactive components (quizzes, reveal, rewrite, checklist, tally, recall)
- `assets/course-map.js` — single source of truth for course navigation
- `assets/components.html` — component gallery; copy markup from here before inventing new styles

Drill answers and notes save to `localStorage`, which means **progress is per-device** and
will not follow you between phone and laptop.

## Sources

All knowledge is drawn from Toastmasters International published material:

- *Effective Evaluation* (Item 202)
- *Evaluation and Feedback* (Item 8100)
- *Ice Breaker* (Item 8101), *Writing a Speech With Purpose* (Item 8103),
  *Introduction to Vocal Variety and Body Language* (Item 8104)
- *Your Speaking Voice* (Item 199)
- *Fundamentals of Public Speaking*
- *Evaluation Contest Judge's Guide and Ballot* (Item 1179) — the definition of an
  excellent evaluation

Full annotated list in [RESOURCES.md](RESOURCES.md).

## Note on copyright

Toastmasters International materials are quoted and cited for personal study. The
extracted source texts used to verify citations are deliberately **not** included in this
repository — see `.gitignore`. Every citing page links to the official Toastmasters URL.

Toastmasters International, the Toastmasters International logo and all other
Toastmasters International trademarks and copyrights are the sole property of
Toastmasters International and may be used only with permission.
