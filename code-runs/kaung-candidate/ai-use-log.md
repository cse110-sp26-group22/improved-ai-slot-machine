# AI Use Log — Kaung Myat Han

**Harness:** Gemini CLI v0.38.2 (Homebrew)
**Model:** Gemini 2.5 Pro (manually selected via `/model` → Pro)
**Date:** April 22, 2026

---

## Round 1 — Initial Scaffold

**Prompt:** Fed Gemini the full `prompt.md` spec (pirate-themed slot machine with 95% RTP, 65% hit rate, separate HTML/CSS/JS files, Web Audio API sounds, emergency deposit, JSDoc comments) along with the team's `RUBRIC.md` for evaluation criteria. Used `@prompt.md @RUBRIC.md Build this slot machine app`.

**What Gemini produced:** Five files — `index.html`, `style.css`, `script.js`, `audio.js`, and `constants.js`. Clean file separation, game state object, JSDoc annotations on most functions, `crypto.getRandomValues()` for RNG. The code structure followed the prompt closely.

**Result:** Complete failure on launch. The reels were completely blank — no symbols visible. Clicking SPIN did nothing. No sound played. Bet buttons had no visible effect. The screen appeared frozen. The UI was minimal — just the title "Pirate's Booty" with no pirate theming.

**Root cause:** The reel rendering used a `translateY` approach on a massive strip of 10× cloned symbol elements. The `init()` function populated the DOM but never set an initial `translateY` position, so all symbols were rendered off-screen. The pixel-position math in `animateReels()` was fragile and broke when symbol heights didn't match the hardcoded 50px assumption.

**Observation:** Gemini Pro produced well-structured code with good separation of concerns, but the visual rendering logic was fundamentally broken. The AI generated code that looked correct in structure but didn't work in practice — it never tested whether symbols were actually visible in the viewport.

---

## Round 2 — Bug Fix Attempt

**Prompt:** Described the specific issues (blank reels, no animation, no sound, frozen UI) and asked Gemini to fix the reel display and animation system. Suggested keeping it simple and reliable.

**What changed:** Gemini added a `setInitialReelState()` function with a `setTimeout` to position reels after DOM render. Minor CSS improvements — added a parrot emoji decoration, anchor emoji, gold glow on display boxes, and text shadows. The background got subtle radial gradients.

**Result:** Reels still blank. The core `translateY` calculation was still broken. The CSS polish was the only visible improvement — the parrot and anchor decorations appeared, and the display boxes had a gold glow effect.

**Observation:** Gemini patched around the problem instead of replacing the broken approach. When asked to "fix" something, it tends to add code rather than rewrite the fundamentally broken part. Being vague in the prompt ("keep it simple") wasn't directive enough.

---

## Round 3 — Reel System Rewrite

**Prompt:** Explicitly told Gemini the `translateY` approach was not working and to completely replace it. Specified a simpler architecture: each reel contains exactly 3 symbol divs, use `setInterval` to rapidly cycle random symbols during spin, stop each reel sequentially. Said "Do NOT keep the old translateY system."

**What changed:** Gemini rewrote `script.js` with the new approach — `createReel()` now makes 3 symbol divs, `animateReels()` uses `setInterval` with 80ms flickering, reels stop one at a time with 300ms delays. Updated CSS for 80px symbol height and 240px reel container.

**Result:** The code logic was now correct, but the reels were STILL blank in Safari. After investigation, the issue was that `script.js` uses ES module imports (`import { SYMBOLS } from './constants.js'`) and the HTML loads it with `<script type="module">`. Safari blocks ES modules when opened via `file://` protocol for security reasons.

**Fix:** Opened the project using VS Code's Live Server extension (localhost) instead of opening the HTML file directly. The game immediately worked — reels displayed symbols, spinning animation worked, bet selection functional, balance updates correct.

**Observation:** This was not a Gemini code quality issue — it was an environment/browser compatibility issue. The code was correct but the deployment context (local file) broke it. This is a good lesson about testing environment assumptions.

---

## Round 4 — Audio Overhaul

**Prompt:** Described that the game had no background music and only basic beep sounds. Requested pirate-themed sea shanty music in 6/8 time, distinct win sounds (coin clinks for small wins, brass fanfare + cannon boom for big wins, shimmering arpeggio + multiple cannons for jackpot), mechanical lever-pull spin sound, satisfying reel-stop thunks, and proper mute toggle.

**What changed:** Gemini rewrote `audio.js` extensively. Added a looping sea shanty melody using Web Audio API oscillators in 6/8 time (D-F-F-G-G-A-G-F sequence). Created distinct sound effects: sawtooth lever-pull for spin, square wave thunk for reel stops, sine coin clinks for small wins, sawtooth brass fanfare + low-frequency cannon boom for big wins, layered arpeggio + multiple cannons for jackpot. Added a `createBrownNoise` helper for a pirate "argh" sound on small wins. Added a `reel-stop` sound that plays each time a reel lands.

**Result:** Background music played on first interaction. Sound effects triggered correctly on spins, reel stops, and wins. The music was simple but recognizably nautical. The cannon boom on big wins was satisfying. The sounds were generated entirely via Web Audio API with no external files.

**Observation:** Gemini handled the Web Audio API well — the oscillator scheduling, gain ramping, and frequency modulation were all correct. The music is repetitive but functional. Web Audio API-generated music has inherent limitations in richness compared to recorded audio, but it meets the assignment requirement of no external dependencies.

---

## Round 5a — RTP Fix + Speed

**Prompt:** Informed Gemini that I independently calculated the RTP and found it was only ~70%, not the target 95%. Provided exact reel configuration (12-position reel: 6×SKULL, 2×ANCHOR, 1×GOLD_COIN, 1×PARROT, 1×TREASURE_CHEST, 1×PIRATE_CAPTAIN) and exact paytable values (Captain=250x, Chest=20x, Parrot=12x, Coin=4x, Anchor=3x, Skull=2x, Any Two=1x) that I verified give 95.02% RTP and 65.28% hit rate. Also requested faster spin timing (0.6s, 0.9s, 1.2s per reel).

**What changed:** Gemini replaced the `REEL_CONFIG` and `PAYTABLE` in `constants.js` with the exact values I provided. Updated spin timing in `script.js` to use the specified delays. Added a comment noting the RTP/hit rate values.

**Result:** The game now has mathematically correct 95.02% RTP and 65.28% hit rate. Spins feel faster and more responsive. Over extended play testing (~50 spins), the balance fluctuated naturally rather than draining consistently.

**Observation:** Gemini's original reel configuration was not mathematically validated — it placed symbols without calculating the actual probability distribution. The RTP math is non-trivial (requires computing all 1,728 possible outcomes for a 12×12×12 reel combination). This was a case where I had to do the work externally (using a Python script to brute-force the optimal configuration) and feed the AI the correct answer. The AI could not reliably do this calculation itself.

---

## Round 5b — Double Down + UI Overhaul

**Prompt:** Requested two major features: (1) Double down mechanic — when first two reels match, pause before third reel and show a popup with Yes/No and 3-second countdown, doubling the bet if accepted; (2) Pirate island UI transformation — ocean gradient background, wave animation, decorative emoji elements (palm trees, flags, treasure), gold dashed rope borders, rename UI labels (Balance→Treasure, Bet→Wager, Spin→FIRE! 💣), gold payline.

**Note:** Initially sent both features in one prompt, which crashed VS Code due to the massive response. Split into two separate prompts (5a for RTP/speed, 5b for features/UI).

**What changed:** Gemini added a complete double down system — `handleDoubleDown()` returns a Promise, shows/hides a popup with countdown timer, deducts additional bet if accepted, restores original bet after spin resolves. UI was transformed: ocean blue gradient background, gold dashed border (rope effect), palm tree and treasure chest emoji decorations, pirate flag and sailboat in header, renamed labels, gold FIRE! button, gold dashed payline, wave animation CSS at bottom of page.

**Result:** Double down works correctly — triggers when first two reels match, countdown timer displays and counts down, bet doubles on Yes, resolves normally on No or timeout. UI is dramatically improved — looks like a pirate-themed game rather than a generic app. The gold FIRE! button, treasure/wager labels, and decorative elements create a cohesive theme.

**Observation:** The double down implementation was clean on the first try — Gemini handled the async Promise-based flow, event listener cleanup, and state management well. The UI transformation was also successful, though the wave animation didn't render (broken SVG base64 data URL). Splitting the large prompt into two prevented VS Code from crashing.

---

## Round 6 — Symbol Fix + Animations

**Prompt:** Reported that PIRATE_CAPTAIN rendered as a policeman emoji (platform-dependent emoji rendering issue). Requested symbol changes (Diamond, Crown, Sea Turtle instead). Also requested: fix payline position (between rows instead of centered), replace broken SVG wave with pure CSS waves, add pulsing animation to FIRE! button, add swaying palm tree animation, waving pirate flag animation, and sparkle effect on gold border.

**What changed:** Gemini updated symbols in `constants.js` (💎, 👑, 🐢, 💰, ⚓, ☠️). Added CSS animations: `pulse-fire-button` (scale + box-shadow pulse on enabled state, stops when disabled), `sway-palm-tree` (gentle rotation), `wave-flag` (skew transform), `sparkle-border` (box-shadow shimmer). Replaced broken SVG wave with pure CSS `radial-gradient` wave effect on `body::before/::after`. Moved payline inside `.reels` div and set `top: 127.5px` to center on middle symbol.

**Result:** All symbols now render correctly across platforms. FIRE! button pulses attractively when enabled, palm tree sways, flag waves, border sparkles. The CSS waves animate at the bottom of the screen. Payline is closer to center but still slightly off.

**Observation:** Emoji rendering is platform-dependent — what looks like a pirate captain on one OS appears as a policeman on another. Using universal symbols (diamond, crown, etc.) avoids this issue entirely. The CSS-only animations are lightweight and effective — no JavaScript needed for the decorative effects.

---

## Round 7 — Mute Bug Fix

**Prompt:** Reported that clicking Mute froze the entire game. Identified two bugs: (1) the background music scheduler's `scheduleNote` function returned early when muted and never rescheduled itself, killing the loop permanently; (2) the `createBrownNoise` function was defined inside `playBackgroundMusic` but called in the small-win sound, causing a crash if the function wasn't yet defined.

**What changed:** Gemini fixed the music loop to always run the scheduling `setTimeout` regardless of mute state — it just skips creating oscillators when muted. Removed the `createBrownNoise` call from the small-win sound entirely (kept just the coin clink sounds). The loop now continues running silently when muted and resumes playing when unmuted.

**Result:** Mute/unmute works correctly without freezing. Background music stops when muted and resumes when unmuted. All sound effects still trigger correctly when unmuted.

**Observation:** This was a subtle timing/scoping bug that Gemini introduced in Round 4 and didn't catch. The `createBrownNoise` being defined inside a music function but used in a sound effect function is a clear scoping error. Gemini fixed it cleanly once the specific bugs were identified, but it required manual debugging to find the root causes.

---

## Summary of Findings

**Total rounds:** 8 prompts (Rounds 1, 2, 3, 4, 5a, 5b, 6, 7)

**What worked well with Gemini Pro:**
- Code structure and organization — clean separation of concerns from the start
- JSDoc annotations and modular function design
- Implementing async game logic (double down Promise flow, sequential reel stops)
- CSS animations and visual theming
- Web Audio API sound generation
- Following specific, prescriptive instructions (exact reel configs, exact paytable values)

**What did NOT work well:**
- Mathematical calculations — Gemini could not design a reel configuration that actually achieved 95% RTP. Required external verification with a Python brute-force script
- Visual rendering — the initial reel animation approach was fundamentally broken and took 2 rounds to replace
- Self-correction — when asked to "fix" a broken approach, Gemini patched around the problem rather than replacing it (Round 2). Required explicit instruction to rewrite entirely (Round 3)
- Subtle bugs — introduced a scoping issue (`createBrownNoise`) and a mute-kills-loop bug that required manual debugging to identify
- Single-prompt overload — a large prompt with many changes crashed VS Code; needed to be split

**Key takeaway:** Gemini Pro is effective as a code generator when given precise, specific instructions, but it struggles with mathematical correctness and self-diagnosis of broken code. The iterative human-in-the-loop approach (test → identify issues → prompt specific fixes) was essential. The AI could not independently verify that its code worked correctly.

**Hand edits:** None. All changes were made through AI prompting. The only manual intervention was switching from Safari file:// to VS Code Live Server to resolve the ES module loading issue.
