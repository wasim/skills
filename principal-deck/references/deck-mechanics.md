# Deck mechanics

How `assets/template.html` works and how to build on it. The template is a
complete, working deck engine — copy it, replace the sample slides, keep the
engine script and presenter chrome intact.

## The contract

- **One self-contained file.** No CDNs, no fonts to load, no build step. It
  must present from `file://` on a borrowed laptop.
- **16:9 discipline.** The deck is designed at 1280×720 CSS px. Verify layout
  at that aspect; a taller window will show more whitespace, never overflow.
- **Every slide is a `<section class="slide">`** with `data-notes` speaker
  notes. Appendix slides additionally carry `data-apx` — that's what routes
  them to the `a`+digit quick-jump and labels them A1, A2, … in the chrome.
- **Optional `data-map`** overrides the label shown in the jump map
  (defaults to the slide's kicker, then its heading).

## Fragments = keypress beats

A `class="fragment" data-frag="N"` element reveals on a keypress; equal `N`s
reveal together; `→`/space advances fragments then slides; `←` unwinds; `↓`
or `.` completes the slide. `class="fragment stagger"` on a table cascades
its rows on one keypress.

Design rule: **one keypress = one spoken beat.** After building, count total
keypresses for the main run and record it in the title slide's notes — it is
the rehearsal contract. Keep fragments off the appendix (jumping there mid-Q&A
should land a complete card; the jump auto-completes fragments anyway).

## Speaker notes grammar (`data-notes`)

The notes panel parses this grammar, so keep to it:

- `TT m:ss` anywhere in the first beat = the slide's time budget; it renders
  as a badge in the panel header.
- `||` separates beats; each beat renders as a card.
- Text in single quotes = **the words actually spoken**; the panel highlights
  them so the eye separates *say-this* from stage direction.
- A leading ALL-CAPS run (`POCKET AMMO`, `PHASE STORY SPINE`) renders as a
  small header — use it for depth-if-probed material and untanglers.

Content conventions that earn their keep: an `Open:` line (the lede, verbatim)
and an `Exit:` line (the handoff to the next slide); locked phrases the
presenter must land; pocket ammo the presenter volunteers only if asked.

## Presenter chrome (all hidden in print)

| Key | Behavior |
|-----|----------|
| `→` / space / PgDn | next beat, then next slide |
| `←` / PgUp | unwind beat, then previous slide (arrives complete) |
| `↓` / `.` | complete the current slide's fragments |
| `1–9`, `0` | jump to main slide (0 = tenth); arrives complete |
| `s` | toggle the slide map (numbers + titles, current highlighted) |
| `a` then `1–9` | appendix legend + jump to card N |
| `n` | notes panel: closed → open → tall |
| `t` | pace clock: show → start → hide; `r` re-arms |
| `f` | fullscreen (hides the key-hint line only) |
| `p` | print / save PDF (browser fallback path) |
| Esc | close overlays |

**The pace clock** paints elapsed vs. a cumulative per-slide target and says
`m:ss over/under`. Set `TOTAL` (seconds) and `TARGET` (cumulative seconds by
the END of each main slide) in the engine script; leave `TARGET` empty to
distribute `TOTAL` evenly. Tune targets to the rehearsed talk track, not to
even splits — some slides deserve 3× the time of others.

## Diagrams

Draw architecture figures as inline SVG inside `figure.sheet` (white card,
FIG-number caption). Use the provided SVG grammar classes: `band-*` for
layer bands, `cell`/`cell-strong`/`cell-ink` for boxes, `dg-flow`/
`dg-flow-accent` for arrows (markers included), `dg-boundary` for dashed
governance boundaries. Label every flow's *meaning*, not just its endpoints.
No legend for anything the drawing already says.

## PDF export

```
node scripts/make-pdf.mjs /abs/path/deck.html /abs/path/deck.pdf
```

Drives installed Chrome headless over CDP (no npm deps; Chrome path is set
for macOS at the top of the script). It reveals all fragments, forces one
16:9 page per slide, and prints with backgrounds.

**Verify by looking, not by trusting CSS**: read the generated PDF pages as
images and check for overflow, collisions, and shrunken figures. The classic
failure is a dense slide whose cards collide with a figure caption only in
print layout. Fix by tightening paddings/font sizes for that slide, re-export,
re-look. Iterate until every page is clean.

## Editing discipline

- The engine script and chrome CSS are shared machinery — extend, don't fork.
- Slide-specific CSS goes in clearly-commented sections; keep selectors
  scoped to that slide's class so late-night fixes can't bleed across slides.
- After any visual change: re-export the PDF and re-check the touched pages.
