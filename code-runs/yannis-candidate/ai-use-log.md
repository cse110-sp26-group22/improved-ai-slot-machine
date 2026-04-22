# AI Use Log — Yannis Candidate

## Entry 1 — Run 1: Initial Scaffold
**Date:** April 21, 2026
**Prompt:** Asked Gemini to build a 3-reel slot machine with weighted probabilities,
bet sizing ($1/$5/$10), balance display starting at $100, dark Vegas theme,
JSDoc comments, and ~92% RTP target.
**Result:** Gemini generated index.html, style.css, and script.js. Files were
placed in the repo root instead of yannis-candidate — moved them manually.
**Observations:** Game works on first try. Neon dark theme looks polished.
Symbols display correctly after spin. Balance deducts properly. Win/loss
message shows. Gemini calculated ~91.8% RTP using Cherry(5x), Lemon(10x),
Orange(30x), Bar(100x), Seven(5000x).
**Issues:** No spin animation yet. No near-miss mechanic. No unit tests.
**Next:** Add spin animation and win flash effect.