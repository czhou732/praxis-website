# PRAXIS site — implementation brief

You are implementing a set of visual and interaction changes to an existing, working,
deployed website. This document is self-contained: everything you need is here.

**Work one task at a time. One commit per task. Run the verification after every task.**
Do not attempt the whole list in a single pass.

---

## 0. Context

| | |
|---|---|
| Repo | `/Users/peterzhou/Research/Labs/NSG/praxis-website` |
| Remote | `czhou732/praxis-website`, branch `main` |
| Live | https://uscpraxis.org (GitHub Pages, custom domain) |
| Stack | React 19, Tailwind CSS v4, Vite multi-page build, build-time prerender, hydration |
| Contact on site | czhou732@usc.edu |

PRAXIS is an undergraduate computational psychiatry research group — machine learning,
neuroscience, clinical mental health. Two live projects: **ClinicalWhisper** (a speech model
for clinical interview audio) and **Dopaminergic Voice** (vocal biomarkers of anhedonia).
The visual language is instrument-like: signal traces, hairlines, tabular mono labels, a dark
ground, and the Greek letter **Ψ** as the mark.

### Commands

```bash
npm run dev       # dev server
npm run build     # client build → SSR build → prerender → verify. Fails loudly.
npm run verify    # build contract check alone
npm run smoke     # health check against the LIVE site
npm run preview   # serve dist/ locally
```

### Files that matter

```
vite.config.js                  # PAGES map — every page MUST be listed here
scripts/verify-build.mjs        # build contract; fails build on violation
scripts/smoke.mjs               # live site health check
scripts/prerender.mjs           # SSR → static markup injection
src/prerender-entry.jsx         # route path → page component map
src/entries/*.jsx               # hydration entry points (hydrateRoot, NOT createRoot)
src/pages/{Home,Research,Speakers,Syllabus}.jsx
src/components/{Layout,Cursor,PsiField,ui}.jsx
src/data/{site,speakers}.js     # ALL site content lives here, not in JSX
src/styles/app.css              # Tailwind v4 @theme tokens + component CSS
index.html, research/, speakers/, syllabus/   # per-page HTML shells
```

---

## 1. Hard rules

These are not style preferences. Each one exists because breaking it already caused a
production incident on this site.

1. **`prefers-reduced-motion` means REDUCE, never REMOVE.**
   Gating an entire effect behind this query makes it vanish for anyone with macOS Reduce
   Motion on. That happened twice here — the custom cursor was invisible and the hero
   animation never played. Under reduced motion: drop *travel* and *spring easing*, keep the
   element visible and keep a motion-free entrance (opacity, staggered fades). Never `return`
   early out of a whole feature.

2. **Every page must be listed in `PAGES` in `vite.config.js`.**
   Vite's default build emits only `index.html`. Three pages once 404'd in production for
   exactly this reason. `scripts/verify-build.mjs` now fails the build if a declared page is
   missing — do not weaken that check.

3. **Do not break prerendering.** Pages render to static markup at build time and hydrate on
   the client. Entries use `hydrateRoot`, not `createRoot`. Content must be readable with
   JavaScript disabled. Any new visual effect is a *progressive enhancement* layered on top.

4. **Never fabricate data.** No invented metrics, sparkline values, result curves, dates, or
   citations. This is a research group's site; a fabricated number is a fabricated result.
   If real data isn't available, do not ship the component.

5. **No institutional affiliation claims.** PRAXIS is not a registered student organization.
   Do not add USC branding, logos, or wording implying affiliation, endorsement, or
   sponsorship. Do not add the phrase "first student organization at a U.S. research
   university" — it is unverified and was deliberately left out.

6. **Never publish a speaker's name against a date they haven't confirmed.**
   In `src/data/speakers.js`, only entries with `status: 'confirmed'` carry `name`/`topic`.
   Unconfirmed slots render as held dates only. Preserve this.

7. **Hide the native cursor only after a frame has actually painted.** A throttled tab or a
   canvas failure would otherwise leave the page with no pointer at all. See `Cursor.jsx`.

8. **Canvas guard:** never call `getImageData` on a zero-width or zero-height canvas — it
   throws and takes down every script after it. Bail if `w < 2 || h < 2`.

---

## 2. Verification after every task

```bash
npm run build        # must end with: verify: ok — 4 pages, links resolved, prerender present, CNAME intact
npm run preview      # then check the page in a browser at 1280x900
```

Manually confirm, in a real browser:
- The change renders and animates.
- With **Reduce Motion ON** (macOS: System Settings → Accessibility → Display), the affected
  element is **still visible** and still has a motion-free entrance.
- With **JavaScript disabled**, page content is still fully present.
- No console errors; no horizontal page scroll.

After deploying (`git push origin main`), wait for the Actions run, then:

```bash
npm run smoke        # must print: smoke: 8/8 passed
```

---

## 3. Tasks, in order

### TASK 1 — Delete the two generic components

**Why:** the travelling gradient beam and the radial-masked grid are stock Magic UI /
shadcn landing-page components. They are decorative only and make the site look templated.

- Remove `BorderBeam` usage from `src/pages/Speakers.jsx` (line ~73) and its definition and
  `beam-arc` CSS/`@keyframes beam` from `src/components/ui.jsx` and `src/styles/app.css`.
- Remove `GridPattern` usage from `src/pages/Home.jsx` (line ~10) and its definition and
  `.grid-pattern` CSS.
- Remove any now-unused imports.

**Acceptance:** no `BorderBeam` / `GridPattern` / `beam-arc` / `grid-pattern` references remain
anywhere in `src/`. Build passes. Pages look intentionally quieter, not broken.

---

### TASK 2 — Rewrite the hero as multichannel signal folding into Ψ

**File:** `src/components/PsiField.jsx` (replace the particle logic; keep the component shape,
the reduced-motion handling, the `document.hidden` sync paint, and the resize/visibility
listeners).

**Concept:** at rest the hero shows **8 channels of EEG-like trace**, alive and scrolling. As
the hero scrolls (or on load), the traces **fold into the Ψ glyph left-to-right, like a
playhead**. The same points that draw the waves become the glyph — nothing is discarded.

**Verified algorithm.** This exact code has been tested and works. Adapt it into the component;
do not re-derive it.

```js
var CHANNELS = 8, PER_CHANNEL = 150;

// Two slow sines carry the rhythm; the fifth-power term fires rarely and
// sharply, which is what gives a real trace its spikes.
function waveAt (x, phase, clock) {
  return Math.sin(x * 0.021 + clock * 1.6 + phase) * 0.55 +
         Math.sin(x * 0.052 - clock * 2.3 + phase * 1.7) * 0.26 +
         Math.pow(Math.sin(x * 0.011 + clock * 0.9 + phase * 0.5), 5) * 0.5;
}

// --- sampling the glyph ---
function sampleGlyph (w, h) {
  if (w < 2 || h < 2) return [];            // RULE 8
  var off = document.createElement('canvas');
  off.width = Math.round(w); off.height = Math.round(h);
  var o = off.getContext('2d');
  o.fillStyle = '#000';
  var size = Math.min(w * 0.42, h * 0.8);
  o.font = '500 ' + size + 'px ' + serifStack;   // read --font-serif from :root
  o.textAlign = 'center'; o.textBaseline = 'middle';
  o.fillText('Ψ', w / 2, h / 2);
  var data = o.getImageData(0, 0, off.width, off.height).data;
  var targets = [];
  for (var y = 0; y < off.height; y += 3)
    for (var x = 0; x < off.width; x += 3)
      if (data[(y * off.width + x) * 4 + 3] > 128) targets.push({ x: x, y: y });

  // Sorted top-to-bottom so the top trace folds into the top of the mark.
  targets.sort(function (a, b) { return a.y - b.y || a.x - b.x; });

  // Centre on the glyph's real ink box. textBaseline "middle" centres the em
  // box, not the letterform, which leaves Ψ visibly high in the frame.
  if (targets.length) {
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (var t = 0; t < targets.length; t++) {
      var q = targets[t];
      if (q.x < minX) minX = q.x; if (q.x > maxX) maxX = q.x;
      if (q.y < minY) minY = q.y; if (q.y > maxY) maxY = q.y;
    }
    var ox = w / 2 - (minX + maxX) / 2, oy = h / 2 - (minY + maxY) / 2;
    for (var u = 0; u < targets.length; u++) { targets[u].x += ox; targets[u].y += oy; }
  }
  return targets;
}

// --- building points ---
// gap = h / (CHANNELS + 1); total = CHANNELS * PER_CHANNEL; k increments across all points
var p = {
  x0:    (i / (PER_CHANNEL - 1)) * w,
  base:  gap * (c + 1),
  amp:   gap * 0.38,
  ph:    c * 1.7 + i * 0.045,
  tx: tgt.x, ty: tgt.y,
  // Left-to-right, so the fold sweeps like a playhead. A uniform morph just
  // squeezes the traces inward and the mark never appears to emerge.
  delay: (i / (PER_CHANNEL - 1)) * 0.82 + Math.random() * 0.18,
  x: 0, y: 0, lp: 0, wy: 0
};
// tgt = targets[min(targets.length - 1, floor(k * targets.length / total))]

// --- per frame, s = overall progress 0..1 ---
var lp = (s - p.delay * 0.5) / 0.5;
lp = lp < 0 ? 0 : lp > 1 ? 1 : lp;
lp = lp * lp * (3 - 2 * lp);                       // smoothstep

var wy = p.base + waveAt(p.x0, p.ph, clock) * p.amp * (1 - lp);
var x  = p.x0 + (p.tx - p.x0) * lp;
var y  = wy + (p.ty - wy) * lp;
p.x = x; p.y = y; p.lp = lp; p.wy = wy;

// --- drawing the traces ---
// Drawn through the UNDISPLACED wave position (x0, wy), and only where the fold
// has not arrived — otherwise the line is dragged into the glyph as diagonal streaks.
if (calm > 0.01) {                                  // calm = 1 - s
  ctx.strokeStyle = mutedToken; ctx.lineWidth = 1;
  ctx.globalAlpha = Math.pow(calm, 1.5) * 0.55;
  for (each channel row) {
    var open = false; ctx.beginPath();
    for (var j = 0; j < row.length; j++) {
      if (row[j].lp < 0.5) {
        if (open) ctx.lineTo(row[j].x0, row[j].wy);
        else { ctx.moveTo(row[j].x0, row[j].wy); open = true; }
      } else open = false;
    }
    ctx.stroke();
  }
}

// --- drawing the samples ---
// Coloured by their OWN progress; quantised into 8 buckets so fillStyle is set
// 8 times a frame instead of 1200 times.
var BUCKETS = 8;
for (var b = 0; b < BUCKETS; b++) {
  var f = b / (BUCKETS - 1);
  ctx.fillStyle = mixRgb(mutedRgb, coolRgb, f);
  ctx.globalAlpha = 0.45 + f * 0.45;
  var rr = 1.15 + f * 0.85;
  ctx.beginPath();
  for (var m = 0; m < pts.length; m++) {
    var q = pts[m];
    if (Math.min(BUCKETS - 1, Math.floor(q.lp * BUCKETS)) !== b) continue;
    ctx.moveTo(q.x + rr, q.y);
    ctx.arc(q.x, q.y, rr, 0, Math.PI * 2);
  }
  ctx.fill();
}
```

**Pointer reactivity** (ties the custom cursor and the hero into one system):

```js
if (!reduce && mx > -900) {
  var dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
  if (d2 < 7000 && d2 > 0.01) {
    var f = (1 - d2 / 7000) * 16 / Math.sqrt(d2);
    x += dx * f; y += dy * f;
  }
}
```

Listen on `pointermove` / `pointerleave` at the window (the hero canvas is behind text and is
`pointer-events: none`), converting to canvas-local coordinates.

**Scroll driving:** `s` should be driven by scroll position as it currently is — resolve as the
hero enters, dissolve as it leaves.

**Reduced motion:** keep `clock` frozen (waves hold still) and let `s` still animate, so the
fold still happens. Never skip rendering.

**Acceptance:** at rest, 8 legible traces. Mid-scroll, a frame exists that is half raw trace
and half resolved mark. Fully resolved, a clean Ψ. No diagonal streaks at any point. With
Reduce Motion on, waves are static but the fold still occurs and the mark is visible.

---

### TASK 3 — View Transitions + Speculation Rules

Cross-document view transitions work on multi-page sites — which this is. Do **not** convert
to a single-page app.

- In `src/styles/app.css`, add `@view-transition { navigation: auto; }`.
- Give the nav and the Ψ mark stable `view-transition-name` values in `Layout.jsx` so they
  persist across navigations.
- Add a Speculation Rules script to each HTML shell to prerender same-origin links on hover:

```html
<script type="speculationrules">
{"prerender":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}
</script>
```

- Wrap transition styling in `@media (prefers-reduced-motion: no-preference)`.

**Acceptance:** navigating Home → Speakers morphs rather than flashing. In a browser without
support, navigation behaves exactly as it does today.

---

### TASK 4 — Curriculum as a dependency graph

**File:** `src/pages/Syllabus.jsx`

Replace the stacked module cards with an SVG graph generated from `MODULES` in
`src/data/site.js`. Modules form a vertical prerequisite spine; each module's readings hang
off it. Do not hardcode content — read it from the data module so it cannot drift.

Layout that works: `viewBox="0 0 720 H"`, spine at x=116, row pitch 98, module node = circle
r=5 stroked in `--color-cool`, module number in mono to the left, title in serif to the right,
readings in small mono below with hairline elbow connectors.

Wrap in a container with `overflow-x: auto` and give the SVG `min-width: 34rem` so it scrolls
on narrow screens instead of forcing the page sideways. Give the `<svg>` `role="img"` and a
descriptive `aria-label` naming the modules and their order.

**Acceptance:** graph renders from live data; adding a module to `site.js` adds a node with no
other edit. No horizontal page scroll at 375px wide.

---

### TASK 5 — The title sequence ("noise, then boom, the site")

**This is the highest-risk task. Its conditions are non-negotiable.**

**Concept — continuity of the mark.** The loader resolves particles into Ψ at the *exact
position and scale the hero's Ψ occupies*. When the loader hands off, there is no cut: the
mark is already where it belongs. Then everything else arrives around it.

Sequence:
1. **0–350ms** — channels come online one at a time, mono labels ticking in the corner.
2. **350–1000ms** — traces fold into Ψ, using the same left-to-right sweep as Task 2.
3. **1000–1200ms** — handoff. Overlay fades out over ~200ms while the resolved Ψ stays put.
   Particles retain outward momentum. Nav, headline, subhead, and buttons stagger up
   (~40ms apart, 250ms each). This is the "boom".

Implementation constraints:

1. The overlay is **created by JavaScript** and appended to `<body>` — never present in the
   prerendered HTML, so a no-JS visitor never sees it.
2. **Hard cap 1.4s.** A `setTimeout` force-completes and removes the overlay regardless of
   animation state. It must be impossible to get stuck.
3. **Skip on repeat visits** via `sessionStorage.getItem('praxis:seen')`.
4. **Skip entirely under `prefers-reduced-motion`** — this is the one case where skipping is
   correct, because the alternative is a large motion sequence with no motion-free equivalent.
   The page simply renders normally.
5. **Never blocks interaction.** Content sits behind the overlay, already parsed and hydrated.
   The overlay must be `pointer-events: none` once fading.
6. If the loader throws for any reason, catch it and remove the overlay immediately.

To match hero position: compute the hero canvas's bounding box and use the same
`size = Math.min(w * 0.42, h * 0.8)` and ink-box centring as Task 2, so both glyphs land
identically.

**Acceptance:** first visit plays the sequence, ends within 1.4s, and the Ψ does not jump
position at handoff. Reload in the same tab → no sequence. Reduce Motion on → no sequence.
JS disabled → no overlay, page normal. Throwing an error inside the loader still leaves a
usable page.

---

### TASK 6 — Scroll-driven animations

Replace the JavaScript `IntersectionObserver` reveal in `src/components/ui.jsx` with CSS
`animation-timeline: view()`. Keep the existing `html.js` guard pattern so a no-JS page shows
everything. Feature-detect with `@supports (animation-timeline: view())` and leave the current
implementation as the fallback.

**Acceptance:** reveals still work; no regression without support; less JavaScript than before.

---

### TASK 7 — Next-talk readout on the speakers page

Compute the next upcoming session from `SPEAKERS` in `src/data/speakers.js` and render a live
state at the top of the speakers page: `next talk in N days`, plus date, time, and either the
confirmed speaker name or "speaker to be announced".

Dates in that file are display strings (`'Sep 10'`) for the Fall 2026 series. Add a real ISO
date field to each entry rather than parsing the display string.

Handle all three states: upcoming, today/tomorrow (special wording), and series concluded
(after the last date — say so, do not count down to nothing).

**Because this is prerendered**, the countdown must be computed on the client after hydration,
or the static markup will show a stale number. Render a neutral placeholder in SSR.

**Acceptance:** number is correct against today's date; the page still prerenders without a
misleading stale count.

---

### TASK 8 — Texture (lowest priority; nothing breaks without it)

**8a. Footer phase portrait.** Replace the static Ψ watermark in `Layout.jsx` with a
slow-drifting bistable phase portrait — trajectories in a 2D state space falling into one of
two attractors. This is meaningful, not decorative: modelling mood as a dynamical system with
competing stable states is a live idea in the literature the curriculum covers.

```js
// Double-well oscillator: dx/dt = y, dy/dt = -c*y + x - x^3
// Stable states at x = ±1 — two competing attractors.
var DAMP = 0.26, DT = 0.03;
ax = p.y;
ay = -DAMP * p.y + p.x - p.x * p.x * p.x;
p.x += ax * DT; p.y += ay * DT;
```

~44 particles, trail length ~26 points, respawn at a randomised lifetime so they desynchronise.
Colour each trajectory by which well it's heading for. Under reduced motion, integrate ~220
steps once and render a static portrait.

**8b. Section numerals.** Set section numbers in tabular mono against a hairline rule rather
than as oversized serif digits. Only keep numbering where the order is real — the curriculum
modules are a genuine sequence; unordered cards should not be numbered just because it looks
technical.

---

## 4. Blocked — do not implement without written permission

### Advisors band (Dr. Laurent Itti — faculty sponsor; Phil Newsome — graduate advisor)

Proposed treatment: a separate **Advisors** section below the team, *not* in the team grid.
Hairline rows — name in serif, role in mono, the whole row linking to their own page.
**No photos.**

**This must not ship until both have confirmed the exact wording in writing.** Agreeing to
give a talk (which is what the speakers page reflects) is not agreeing to be listed as a
sponsor. Faculty headshots are typically the university's copyrighted asset. Do not infer or
invent affiliation lines — use whatever wording they supply.

### Per-project sparklines and "real signal" traces

Held until there is real, publishable data. See rule 4. A generated sine wave is acceptable as
*ornament* but must not be described anywhere as real data.

---

## 5. Commit format

Conventional Commits. Scope is the area touched.

```
feat(site): fold multichannel traces into the psi mark on the hero
fix(site): stop the trace polyline being dragged into the glyph
perf(site): quantise sample colouring into 8 buckets
```

Do not commit or push unless asked. If asked, branch first if on `main`.
