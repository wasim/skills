---
name: principal-deck
description: Build a complete, defensible presentation from a task or brief — a single-file HTML deck with keyboard-driven delivery, integrated speaker notes, a presenter pace clock, and PDF export. Works for any scenario: executive panel, steering review, architecture board, conference talk, sales pitch, team deep-dive, interview case. Use whenever asked to prepare a presentation, deck, or talk.
---

# Principal Deck

Produce a presentation the presenter can **stand behind under questioning**,
not just read aloud. Scale the machinery to the scenario — a hostile panel
gets the full treatment; a team deep-dive gets a lighter one — but the
quality bar never scales down.

Deliverables (always the first two; the rest as the scenario demands):

1. `deck.md` — the content, frozen before styling.
2. `deck.html` — the deck, built from `assets/template.html`.
3. `deck.pdf` — export/fallback via `scripts/make-pdf.mjs`.
4. `q-and-a.md` — audience-prep pack, scaled to hostility.

References: `references/narrative-arcs.md` (pick the story shape),
`references/content-doctrine.md` (the bar content must pass),
`references/deck-mechanics.md` (the deck engine),
`references/qa-pack.md` (audience prep and rehearsal).

## Phase 0 — Interrogate the brief

Establish before writing (ask the user only what the brief doesn't say):

- **Audience**: who is in the room, what they already know, what each
  persona cares about or attacks.
- **The outcome sought**: what should be true when the presenter stops
  talking — a decision approved, a status trusted, a concept understood, a
  deal advanced? Every deck has an outcome; a deck without one is a lecture.
- **Time budget**: total minutes, and whether questions come during or after.
- **Stakes and hostility**: friendly readout ↔ adversarial panel. This sets
  how much of Phase 4 to build. When unsure, prepare one notch more hostile
  than expected — it only improves the deck.
- **What the presenter can truthfully own**: never put a claim on a slide
  the presenter cannot defend three follow-ups deep.

## Phase 1 — Content before pixels

Pick the narrative arc from `references/narrative-arcs.md` (Decision,
Readout, Pitch, Deep-Dive, or Vision — or a deliberate hybrid), then write
`deck.md`: every slide's argument in prose, appendix cards for predictable
questions. Get it approved, then treat it as **frozen** — wording and
visuals may improve afterwards, but arguments and structure change only as
a documented exception. The freeze is what makes the deck rehearsable.

Universal spine regardless of arc: **lead with the point** (the answer,
result, or idea in the first minute), earn it through the middle, **end
with the echo and the outcome** (the 3–4 takeaways the room must remember
an hour later, then the ask or call to action — then stop).

## Phase 2 — The bar every component passes

- **Altitude**: matched to the audience; detail lives in the appendix.
- **Money/evidence**: every value claim carries baseline → projected →
  tracked with an owner; every factual claim carries a checkable source.
  Demand the noun (which KPI, what baseline, who tracks it).
- **Ownership**: decisions, KPIs, and risks have named roles attached.
- **Brevity**: each beat speakable in 60–90 seconds, answer first.
- **Strong case**: every component argues; cut self-referential copy,
  legends the visual already explains, and anything the presenter wouldn't
  say aloud.
- **Honesty**: no invented statistics; personal claims at defensible
  strength ("seen first-hand" ≠ "delivered"); keep and enforce a kill-list.

When reviewing the user's content, **flag, don't remove** — the presenter
decides cuts. Full detail in `references/content-doctrine.md`.

## Phase 3 — Build

Copy `assets/template.html`; follow `references/deck-mechanics.md`.
Non-negotiables: single self-contained file; fragments as keypress beats
(count them); speaker notes in the notes grammar (`TT m:ss`, `||` beats,
'quoted' = spoken); presenter chrome hidden in print; **verify the PDF by
reading its pages as images**, never by trusting the CSS.

## Phase 4 — Audience prep, scaled

Follow `references/qa-pack.md` and scale to the Phase-0 hostility read:

- **Hostile / high-stakes** (panel, board, interview): full pack — ~20
  persona-attributed questions with 60–90s answers, kill-list, drill list,
  timed mocks against the pace clock.
- **Standard** (steering, review): the 8–10 likely questions with answers,
  plus one timed run.
- **Friendly** (talk, deep-dive): anticipated questions inline in the
  speaker notes, one timing pass.

## Working style

- One question at a time when interrogating the user; short, bold-led replies.
- Commit progress often if in a git repo.
- The presenter originates positions; you red-team, stress-test, assemble,
  and polish. Never let the deck say something the presenter didn't decide.
