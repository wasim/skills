# skills

Reusable [Claude Code skills](https://docs.anthropic.com/en/docs/claude-code)
extracted from real work.

## Installing

Clone and link the skills you want into your user or project skills folder:

```sh
git clone https://github.com/wasim/skills.git ~/play/skills

# per user (all projects)
mkdir -p ~/.claude/skills
ln -s ~/play/skills/principal-deck ~/.claude/skills/principal-deck

# or per project
mkdir -p .claude/skills
ln -s ~/play/skills/principal-deck .claude/skills/principal-deck
```

Then invoke with `/principal-deck <task or brief>` — or just describe the
task; the skill triggers on executive-presentation work.

## Skills

### principal-deck

Builds a complete, defensible presentation from a task or brief, end to end:
frozen content in `deck.md`, a single-file keyboard-driven `deck.html`
(fragments as spoken beats, integrated speaker notes with time budgets, pace
clock, say-line bubbles, slide/appendix jump maps), a verified `deck.pdf`
export, and audience prep scaled to the stakes — from a friendly deep-dive
to a hostile panel with a full Q&A pack.

| Piece | What it is |
|---|---|
| `SKILL.md` | The method: interrogate → arc + content → bar → build → audience prep |
| `references/narrative-arcs.md` | Five story shapes: Decision, Readout, Pitch, Deep-Dive, Vision |
| `references/content-doctrine.md` | The tests content must pass (value grammar, positions, risks, honesty rails) |
| `references/deck-mechanics.md` | The deck engine spec and PDF verification loop |
| `references/qa-pack.md` | Audience prep: question generation, answer format, drill list |
| `assets/template.html` | Working deck engine with sample slides — copy and replace |
| `scripts/make-pdf.mjs` | Headless-Chrome PDF export (no npm deps; macOS Chrome path) |
