# Teaching Notes

## Preferences (stated by Sheriff)

- **No summarising.** "Don't be lazy in giving me details, don't summarize."
  Explanations should be complete. If a concept has five parts, cover all five and say
  what each part does.
- **Always answer "why is this essential?"** for every speech element. Not just "what to
  look for" but "what it adds to a speech and why it matters."
- **Every lesson needs exercises.** Sheriff explicitly asked for exercises to solidify
  each topic. Prefer interactive, self-scoring drills over passive reading.
- **Eloquence is a stated goal**, so the evaluations Sheriff writes must themselves be
  models of good speaking — teach the delivery of an evaluation, not just its content.
- **Step by step, basic → good → great → excellent.** He wants an explicit ladder, not a
  flat list of criteria.

## Design decisions

- Course structure climbs: *mindset → anatomy of what you're judging → each criterion in
  depth → the rubric ladder → structuring the evaluation speech → delivering it →
  contest level.*
- Every reference document uses the official Toastmasters vocabulary. The glossary
  (`reference/0001-glossary.html`) is canonical: later lessons must not invent competing
  terms for the same idea.
- Rubric levels use Toastmasters' own words: **5 Exemplary / 4 Excels / 3 Accomplished /
  2 Emerging / 1 Developing**.
- Contest-level ladder uses the Judge's Guide bands: **Excellent / Very Good / Good /
  Fair**.
- Where a technique is this course's invention rather than Toastmasters', say so explicitly
  in the lesson. Applied so far to the **three coordinates** (WHAT / WHEN / SO WHAT) and the
  word **anchor**. The underlying rules are official (“be specific”); the framing is mine.
  Sheriff reads closely and will notice uncited claims — do not blur the line.
- **Lesson 01 revised (2026-09-11)** after Sheriff flagged that “locate it in time” was
  introduced in passing and never explained. It is now a full section (Section 4) with its
  own research grounding and its own drill. Lesson went from 4 drills to 5.

## UI preferences (learned the hard way)

- **Never hide a question inside a `placeholder` attribute.** Sheriff had to copy and paste
  repeatedly to keep the prompt visible while writing. In the first version of Drill 3, five
  prompts lived in one textarea's placeholder — unusable.
- **One answer field per prompt.** Built the `.rewrite` component for this
  (`assets/course.css` + `initRewrite` in `assets/quiz.js`). Use `.rewrite` instead of
  `.recall` whenever the learner must respond to *specific* items. `.recall` is only for
  open free-recall with no per-item structure.
- Long lessons are welcome; long *unstructured* lessons are not. Break production work into
  per-item cards.

## Working notes

- Primary sources are stored as plain text in `.sources/` so citations can be checked
  without re-downloading. `pdftotext -layout` was used on the official PDFs.
- Toastmasters brand colours used for the course stylesheet: maroon `#772432`,
  Loyal Blue `#004165`. Keeps the material feeling native to the organisation.
- Lessons are self-contained HTML that open directly from the filesystem — no build
  step, no server required, no external CDN dependencies (so they still work offline at
  a club meeting).
- `preview_export` mis-renders HTML files as source code — do not use it to QA lessons.
  Use headless Chrome instead:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu
  --hide-scrollbars --window-size=1500,9000 --screenshot=/tmp/x.png "file://$PWD/path.html"`
  then crop with `sips -c H W --cropOffset Y X`.
- To test JS behaviour, copy the page to `/tmp`, rewrite the asset paths to absolute
  `file://` paths, append a script that `.click()`s the widgets, and screenshot with
  `--virtual-time-budget=4000`.
