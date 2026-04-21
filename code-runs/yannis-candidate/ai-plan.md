# AI Plan — Yannis Candidate

## Overview

My strategy is to use Gemini CLI to build a significantly improved slot machine by leveraging the team's research as structured input before each prompt. Rather than prompting Gemini blindly, I will front-load each session with domain knowledge (RTP targets, weighted probability structures, UX patterns) so the AI produces informed, specific output rather than a generic slot machine.

## Chosen Harness

**Gemini CLI** (Gemini 3 Flash — Preview Features enabled)

Reasoning: Free tier with preview features enabled gives access to Gemini 3 Flash,
which offers strong code generation with fast response times suitable for
iterative development.

## Core Strategy: Research-Informed Incremental Prompting

Instead of one large prompt, I will break the build into small, focused increments — each building on the last. Each prompt will include relevant context from the team's research so Gemini understands the design goals before writing code.

### Phase 1 — Scaffold (Runs 1–2)
- Prompt Gemini to generate the base HTML/CSS/JS structure for a 3-reel slot machine
- Specify: single self-contained file, semantic HTML, no external dependencies
- Evaluate output against basic functionality checklist

### Phase 2 — Probability & Game Logic (Runs 3–5)
- Provide Gemini with the weighted random function pattern from the research doc
- Prompt it to implement weighted symbol probabilities targeting ~92% RTP
- Add a near-miss mechanic (jackpot symbols appear above/below payline more often)
- Add bet sizing control

### Phase 3 — UX & Visual Polish (Runs 6–8)
- Prompt Gemini to add spin animations and win/loss feedback
- Add a balance display, win amount flash, and streak counter
- Ensure responsive layout (mobile + desktop)
- Apply a consistent visual theme (Classic Vegas or Fantasy TBD based on team research)

### Phase 4 — Code Quality (Runs 9–11)
- Prompt Gemini to add JSDoc comments to all functions with type annotations
- Ask it to refactor for DRY principles and meaningful naming
- Request unit tests for core game logic (spin result, payout calculation, balance update)
- Run HTML validator and JS linter, feed errors back to Gemini to fix

### Phase 5 — Final Review & Cleanup (Runs 12+)
- Read through all code manually and evaluate against team rubric
- Use Gemini to fix any remaining issues found in evaluation
- Only hand-edit if Gemini fails to fix after 2 prompt attempts (log this if it happens)

## Documentation Plan

- Log every Gemini interaction in `ai-use-log.md` immediately after it happens
- Note: prompt used, what was generated, what worked, what didn't, and next steps
- Commit after every meaningful change so the repo history reflects the process

## Success Criteria

Final candidate should score well on the team rubric across:
- Visual polish and theme consistency
- Win/loss feedback clarity
- Correct weighted probability logic
- JSDoc documentation on all JS functions
- Unit tests passing
- Clean, DRY, readable code
- Responsive on mobile and desktop
