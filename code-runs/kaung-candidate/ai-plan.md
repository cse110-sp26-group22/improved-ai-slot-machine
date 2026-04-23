# AI Plan — Kaung Myat Han

## Tool & Model Selection

**Harness:** Gemini CLI (v0.38.2, installed via Homebrew)  
**Model:** Gemini 2.5 Pro (manually selected via `/model` → Pro)  
**Rationale:** Pro is the most capable model available in Gemini CLI, with stronger reasoning and higher code quality than Flash. Since I have Google AI Pro, I have sufficient quota to run Pro for the full session. I chose Pro over Auto routing because Auto sometimes sends prompts to Flash, and I want consistent quality across all rounds — especially for the paytable math and RTP/hit rate calculations where reasoning matters. If I run low on quota toward the end, I'll switch to Flash for minor fixes and log the change.

## Overall Strategy

**Approach: Scaffold first, then iterate in focused passes.**

Rather than trying to get everything perfect in one prompt, I'll break the build into rounds. Each round targets a specific area so I can evaluate what the AI did well or poorly before moving on. I'll feed the full prompt as a file using `@prompt.md` to give Gemini clean context.

### Round 1 — Core Game (Initial Prompt)
Feed Gemini the full prompt covering game mechanics, paytable, UI layout, and code structure. Goal: get a working 3-reel pirate-themed slot machine with correct betting ($25–$500 presets), spin logic, and basic payout calculations. Expect this to need cleanup.

### Round 2 — Visual Polish
Focus on animations (reel spin, win highlights, BIG WIN splash), the pirate theme styling, and making the UI look and feel like an actual slot machine. Bold colors, weathered ocean aesthetic, satisfying visual feedback on wins.

### Round 3 — Audio
Add looping pirate background music, spin sounds, and win sound effects (distinct for small/big/jackpot wins). Add a mute toggle. This is its own round because browser audio can be tricky and I want to evaluate it separately.

### Round 4 — Reliability & Edge Cases
Stress-test the game: rapid clicking during spin, zero balance, bet boundary issues. Prompt the AI to add defensive checks and fix any bugs I find during testing.

### Round 5 — Code Quality Pass
Ask Gemini to add JSDoc comments with type annotations, refactor messy functions, ensure DRY principles, and clean up naming. Run a linter and have the AI fix any issues it flags.

### Round 6 — Testing
Generate unit tests for core game logic (payout calculation, balance updates, bet validation, RNG fairness). Attempt Playwright end-to-end tests if time allows.

### Stretch Goal — Double Down Feature
If the base game is solid and time permits, prompt the AI to add a "double down" mechanic: when 2 of 3 reels match, offer the player a chance to double their bet before the third reel stops.

## What I'm Watching For

- How well Gemini Pro handles a detailed initial prompt vs. needing hand-holding
- Whether the math (RTP ~95%, hit rate ~65%, symbol weights) is correct or needs manual verification
- How much the code quality improves or degrades across multiple iterations
- Whether I need to hand-edit code and how often
- How Pro compares to what teammates using Flash/Auto experience

## Rules I'm Following

- Let the AI do the work — only hand-edit after prompting fails, and log it
- Commit after each meaningful round, not all at the end
- I commit manually, not the agent
- Document everything in `ai-use-log.md` as I go
- Stay neutral — report what happens, don't force a narrative

## Updates

*This section will be updated if my strategy changes during the process.*
