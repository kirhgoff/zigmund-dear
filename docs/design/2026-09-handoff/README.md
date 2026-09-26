# zigmund-dear: Design System & Redesign Handoff

## For the implementing agent

You are applying a visual redesign to **https://zigmund-dear.kirill-lastovirya.workers.dev**. The site's structure, routes, data and copy stay the same. What changes is how it looks, plus three small interactions (sorting, subscale filter, collapsible session notes).

- `reference/zigmund-dear.dc.html` is a **design reference built in HTML**, not production code. It uses inline styles only because of how the prototype tool works. Rebuild it in the site's existing stack and conventions, using `tokens.css` as the single source of values.
- **Fidelity: high.** Match colours, type, spacing and radii exactly.
- The reference only shows the **DASS-21** page. Every other instrument page (GAD-7, K10, PHQ-9, PSS-10, UCLA-20, RSES, SWLS, IPIP-50, MFQ-30, SD3) uses the same templates. Scales, bands and subscale counts come from each test's own data.
- **Do not rewrite copy.** Every sentence on the current site stays verbatim. The only new strings are listed under [New UI copy](#new-ui-copy).

---

## 1. Principles

1. **The analyst's office, at night.** Dark, calm and quiet. The personality comes from type (an italic serif voice for "the analyst") and from restraint, not from decoration.
2. **Three voices.**
   - *Serif italic* (Instrument Serif) is the analyst: the hero line, test title, model names and questions.
   - *Sans* (Geist) is the reader: body text, UI, and the models' replies.
   - *Mono* (Geist Mono) is the instrument: numbers, scores, timestamps, model slugs and eyebrow labels.
3. **One accent.** Lavender `#a59ddb` is the only brand colour. Colour otherwise appears only as meaning: the five severity bands.
4. **Data stays honest.** Scores are computed from the answers. Meters show the true 0–42 range, and each band segment is drawn at its real width.
5. **No slop.** No gradients beyond the one faint hero glow, no emoji, no icon sets, no coloured left-border cards, no drop shadows.

---

## 2. Tokens

All values live in `tokens.css` as `--zd-*` custom properties. Summary:

**Surfaces:** page `#090c14` → header `#0b0e17` → sunken `#0c1019` → card `#0f131e` → card-2 `#10141f` → hover `#131826` → selected `#171c2c`. The callout surface is `#16192a` with border `#2b2e4a`.

**Lines:** card border `#1f2433`, row separator `#191d2a`, page rule `#171b27`, strong `#2a3042`, dashed `#262b3b`.

**Text:** hi `#eef0f6`, default `#e8e9f0`, body `#d4d6e0`, reply `#cdd0db`, secondary `#c3c6d3`, lede `#aeb2c2`, muted `#8b90a3`, faint `#7f8599`, ghost `#5d6378`.

**Accent:** `#a59ddb`; soft `#c9c3ee`; ink on accent `#0b0e17`.

**Bands:**

| Band | Hex |
|---|---|
| normal | `#4fd1b0` |
| mild | `#e2d35c` |
| moderate | `#f4a14b` |
| severe | `#ee6a6a` |
| extremely severe | `#d466d8` |

Meter track `#1c2131`, unfilled dot `#262b3b`.

**Radius:** 2 (meter) · 6 (tag) · 8 (chip) · 14 (inner card) · 18 (panel) · 20 (section card) · 999 (pill).

**Spacing:** 4-based. Common values are 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 56, 64, 72, 88. Page gutter is 32px, max content width 1240px, centred.

### Type scale

| Role | Font | Size / line-height | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| Hero line 1 ("Lie down.") | Geist | clamp(56px, 8.4vw, 118px) / 0.95 | 600 | -0.045em | text-hi |
| Hero line 2 | Instrument Serif *italic* | clamp(60px, 9vw, 128px) / 0.95 | 400 | -0.02em | accent |
| Hero lede | Geist | 20 / 1.55 | 400 | 0 | lede, max-width 600px |
| Test title ("DASS-21") | Instrument Serif | 64 / 1 | 400 | -0.01em | text-hi |
| Section title | Instrument Serif | 40 / 1.05 | 400 | 0 | text-hi |
| Model name (session) | Instrument Serif | 52 / 1 | 400 | 0 | text-hi |
| Question | Instrument Serif *italic* | 25 / 1.25 | 400 | 0 | text-hi |
| Callout title | Instrument Serif *italic* | 30 / 1.1 | 400 | 0 | accent-soft |
| Wordmark | Geist | 20 | 600 | -0.02em | text |
| Card heading | Geist | 20 | 500 | 0 | text |
| Body long-form | Geist | 17 / 1.6 | 400 | 0 | body |
| Reply | Geist | 16 / 1.6 | 400 | 0 | reply |
| Row name | Geist | 17 (table) / 15 (list) | 500 | 0 | text |
| UI / pill | Geist | 15 | 400 (active 500) | 0 | secondary |
| Eyebrow | Geist Mono | 12, UPPERCASE | 400–500 | 0.14em | muted (accent inside About) |
| Table header | Geist Mono | 12, UPPERCASE | 400 | 0.12em | muted |
| Big score | Geist Mono | 24 (table) / 30 (session) | 500 | 0 | text-hi |
| Meta / slug / time | Geist Mono | 12–13 | 400 | 0 | muted / ghost |

Use `text-wrap: pretty` on paragraphs and `text-wrap: balance` on the hero serif line.

---

## 3. Components

### 3.1 Header
- Full-width bar: background `#0b0e17`, bottom border 1px `#171b27`. Inner row max 1240px, padding 18px 32px, flex space-between, wraps on narrow screens.
- **Logo:** a 34px circle with a 1px `#a59ddb66` border containing "Ψ" (Instrument Serif, 21px, accent), gap 12px, then "zigmund-dear" (wordmark style).
- **Right side:** a 7px dot in `#4fd1b0` with a 4px ring `#4fd1b01f`, then "on the couch:" (14px, muted) and the test code (Geist Mono, text). Gap 10px.

### 3.2 Hero
- Flex row that wraps, gap 56px, `align-items: flex-end`, padding 88px 0 72px.
- Left column (flex 1 1 560px): h1 line 1, serif line 2 (margin-top 6px), then the lede (margin-top 36px).
- Faint glow: an absolute 720×520px box at left -240px, top -80px, filled with `radial-gradient(closest-side, #a59ddb14, transparent)`, pointer-events none. This is the only gradient on the site.
- **Case file card** on the right (flex 0 1 340px, min 280px):
  - Surface `#0f131e`, border `#1f2433`, radius 18, padding 22px 24px.
  - Header row: "CASE FILE" eyebrow on the left, the test code in Instrument Serif italic 18px accent on the right.
  - Key/value rows at 14px: each row has padding 10px 0 and a 1px dashed `#262b3b` top border. The key is muted and the value is text; numbers and dates are in mono.
  - Rows: Patients · *N language models* / Protocol · *one question at a time* / Temperature · *0* / Runs · *one per model* / Session date · *run date* / Scoring · *strictly by the manual*.

### 3.3 Instrument nav
- Block with padding 28px 0 and 1px `#171b27` rules above and below. Rows stack with a 14px gap.
- Each row is flex-wrap: a 220px group label (eyebrow style), then the pills (gap 8px).
- **Pill:** padding 9px 18px, radius 999, 15px, text `#c3c6d3`, background `#0f131e`, border 1px `#232838`. On hover the border becomes `#a59ddb88` and the text `#fff`.
- **Active pill:** background and border `#a59ddb`, text `#0b0e17`, weight 500.

### 3.4 Test heading ("Now on the couch")
- Padding 64px 0 28px. Flex space-between, wraps, `align-items: flex-end`.
- Left: the eyebrow "NOW ON THE COUCH", then an h2 with the test code (serif 64px) followed by the full test name (Geist 20px, lede colour). The two sit on a shared baseline, gap 18px.
- Right: meta chips built from the existing meta line (e.g. "21 items", "0–3", "past week"). Each chip is Geist Mono 13px, padding 6px 12px, radius 8, background `#10141f`, border `#1f2433`. The full test name that used to lead the meta line now lives in the h2.

### 3.5 About card (collapsible)
- Surface `#0f131e`, border `#1f2433`, radius 20, overflow hidden. **Collapsed by default.**
- **Toggle row** (the whole row is a button): padding 22px 28px, hover background `#121726`. It holds "About this test" (20px, 500) and the subtitle "What it measures, how it is scored, how we ran it" (15px, muted). On the right is a 34px round button (border `#2a3042`) showing `+` or `−`.
- **Open body:** 1px top border, padding 36px 28px, blocks separated by 40px.
  - Top row wraps. Left column (flex 1 1 480px) holds:
    - **What it measures:** accent eyebrow, body paragraph, and the citation (14px, faint).
    - **How it is scored:** keep the first two sentences verbatim, then replace the inline band list with a **band table**. Rows are the subscales; columns are Band plus the five bands. The table has border `#1f2433`, radius 14, and a header row on `#0c1019` in Geist Mono 11px uppercase with a 7px band-coloured dot before each band name. Ranges are Geist Mono `#c3c6d3` and row labels are Geist `#e8e9f0`. Cell padding is 12px 14px (label) and 12px 10px (values).
  - Right column (flex 1 1 320px): the **Read this first** callout. Background `#16192a`, border `#2b2e4a`, radius 16, padding 24px. Serif-italic title at 30px, body 16/1.6.
  - Full-width **How we put a model on the couch**, with a 36px top padding and a top border. It has an eyebrow and the paragraph (max-width 880px), then a **prompt block**: a figure with background `#0b0e17`, border `#1f2433`, radius 14. Its caption bar reads "system · framing" on the left and "verbatim" on the right (mono 12px, muted, bottom border). The prompt itself is a `pre` in Geist Mono 14/1.7, colour `#c9c3ee`, `white-space: pre-wrap`, padding 20px 18px. Below it goes the existing closing sentence (15px, muted).

### 3.6 Score meter (key component)
- A flex row with a 3px gap, height 6px (5px inside the session score cards).
- **One segment per band.** Segment flex = band width in points, on a 0–42 scale. For example, DASS depression gives normal 10, mild 4, moderate 7, severe 7, extreme 15.
- Segments have a `#1c2131` track, radius 2, overflow hidden. Each has an inner fill whose width is `clamp((score + 1 − segStart) / segWidth, 0, 1)`.
- **Every fill uses the colour of the score's band**, not the segment's own band. The meter reads as a single colour whose length shows how far into the scale the score reaches.
- A score of 0 shows a small sliver in the first segment. This is intentional.

### 3.7 Results table (default state)
- Section heading: eyebrow "SESSIONS", serif title "Eight models, one run each" (count from data). A band legend sits on the right: five 8px squares (radius 2) with labels at 13px, lede colour.
- Card: `#0f131e`, border `#1f2433`, radius 20.
- Grid columns: `minmax(0,1.3fr) repeat(3, minmax(0,1fr)) 28px`, gap 28px, padding 20px 28px. Rows are separated by 1px `#191d2a` top borders.
- **Header row** (background `#0c1019`, padding 16px 28px): the column headers are buttons that sort. The active column is `#e8e9f0` with a trailing "↓"; inactive columns are muted. Clicking the active column again resets it. "Model" resets to the default order.
- **Row:**
  - Name (17px, 500) with "Provider · slug" underneath in mono 12px faint, ellipsised.
  - Per subscale: the big score (mono 24px, 500), the band label (14px, band colour, baseline-aligned, gap 10px), and the meter below (gap 10px).
  - A "→" in `#5d6378` in the last column.
  - Hover background `#131826`, `cursor: pointer`. Clicking opens the session view.
- Caption under the card: "Select a model to read its full session." (14px, faint, margin-top 14px).

### 3.8 Session view (a model is selected)
The session view replaces the table. It is a flex row that wraps, gap 32px, `align-items: flex-start`.

- **Model list** (flex 1 1 280px, max 340px, `position: sticky; top: 24px`): card `#0f131e`, radius 18.
  - Rows have padding 14px 18px. Name is 15px 500, provider 13px faint.
  - On the right: `D 10  A 2  S 20`. Letters are ghost `#5d6378`; numbers use the band colour (mono 13px).
  - The selected row has background `#171c2c` and `box-shadow: inset 3px 0 0 #a59ddb`.
- **Transcript** (flex 999 1 520px):
  - Eyebrow "PROVIDER · PATIENT FILE", the serif model name at 52px, and a 40px round close button "✕" (border `#2a3042`, hover border accent) in the top right.
  - Meta line in mono 13px muted: slug, date, duration, "X / Y tokens" (gap 14px).
  - **Three score cards** in a grid, 3 equal columns, gap 10px. Each card is `#0f131e`, border `#1f2433`, radius 14, padding 14px 16px. It holds an eyebrow with the subscale name, the score (mono 30px) plus band label, and the meter.
  - **Session notes:** a bordered box (radius 14) with a toggle row "Session notes · system prompt" and `+`/`−` (mono 13px). When open it shows the full system prompt on `#0b0e17`, mono 13/1.7: the framing paragraph in `#c9c3ee`, and the instruction, answer scale and format rule in `#aeb2c2`.
  - **Subscale filter:** pills reading "All 21", "Depression · 7", "Anxiety · 7", "Stress · 7" (labels and counts come from the test). Each pill is padding 7px 14px, 14px text. Inactive pills are `#0f131e` with a `#232838` border; the active pill is filled accent with ink text.
  - **Transcript item:** a grid with columns `52px minmax(0,1fr)`, gap 18px, padding 24px 0, top border `#191d2a`.
    - Left column: the item number, zero-padded ("01"), in mono 15px accent. Under it, the subscale tag (D/A/S) in mono 11px with padding 2px 7px, border `#2a3042`, radius 6, muted text.
    - Right column: the question in serif italic 25px, with its sent time on the right (mono 12px ghost).
    - Under the question, the **answer card**: `#10141f`, border `#1f2433`, radius 14, padding 16px 18px. It holds the reply text (the leading "N —" / "N." is stripped, because the score is shown separately). Below a 1px dashed `#232838` divider (padding-top 12px) is a footer: three 9px dots (filled accent up to the score, otherwise `#262b3b`), then "N — Scale label" (mono 13px lede), and the reply time on the right (mono 12px ghost).
    - Unparseable replies should keep the site's existing "unscored" treatment: dots all off, and "unscored" in place of the label.

### 3.9 Footer
Top border `#171b27`, max 1240px, padding 32px, flex space-between. On the left, "Scored by the book." in serif italic 20px accent. On the right, "Not medical advice — they are language models." (14px, faint).

---

## 4. Interactions & state

| State | Default | Trigger |
|---|---|---|
| `aboutOpen` | false | About toggle row |
| `sortKey` | null (site order) | Table header click; toggles off on second click |
| `selectedModel` | null | Table row / list row click. Consider syncing to the URL hash (`#claude-haiku-4.5`) as the current site does |
| `notesOpen` | false | Session notes toggle; resets when the session is closed |
| `subscaleFilter` | "all" | Filter pills; resets to "all" when switching model |

- Hover states are instant (no transitions needed). If you add transitions, keep them at 120–160ms ease-out on background, border-color and color only.
- The model list is sticky while the transcript scrolls.
- **Responsive:** every row uses flex-wrap or `minmax(0, …)` grid tracks. Below about 720px:
  - The hero case file drops under the headline.
  - The nav group labels stack above their pills.
  - The session model list goes full width above the transcript. Remove the sticky positioning there.
  - The results table can collapse each row into a stacked card: the name, then three score blocks in a row.

---

## 5. New UI copy
Everything else is the site's existing text, verbatim.
- "Case file", "Patients", "Protocol", "Temperature", "Runs", "Session date", "Scoring", "N language models", "one question at a time", "one per model", "strictly by the manual"
- "Now on the couch"
- "What it measures, how it is scored, how we ran it" (About subtitle)
- "Sessions", "Eight models, one run each", "Session transcript", "Select a model to read its full session."
- "patient file" (session eyebrow suffix), "Session notes · system prompt"
- "system · framing", "verbatim" (prompt block caption)
- Filter labels "All N", "<Subscale> · N"

## 6. Assets
No image or icon assets. The logo is the "Ψ" glyph set in Instrument Serif. All fonts come from Google Fonts (Geist, Geist Mono, Instrument Serif); see `tokens.css`.

## 7. Files
- `tokens.css`: design tokens, font import and base resets.
- `reference/zigmund-dear.dc.html`: the interactive HTML reference for the DASS-21 page. Open it in a browser to see the table, sorting, session view, filters and the collapsible sections. The data in it is copied from the live site for fidelity only; the site's own data source remains the truth.
