# Slot Machine — Gemini CLI Prompt

Build a single-page slot machine web app with a **pirate & parrots** theme using HTML, CSS, and JavaScript in separate files.

## Theme & Symbols

Use pirate-themed symbols — parrot, treasure chest, skull and crossbones, anchor, gold coin, and a pirate captain (jackpot symbol). The visual style should be bold and colorful with a weathered ocean/treasure island feel. Use CSS gradients, textures, or emoji/SVG for symbols — no external image dependencies.

## Core Mechanics

- 3-reel, single-payline slot machine
- Starting balance: $1,000
- Bet options: $25, $50, $100, $250, $500 (fixed preset buttons, not free-form input)
- RNG must be fair and unpredictable (use `crypto.getRandomValues()`)
- **RTP of ~95%** — design the paytable and symbol weights so the weighted expected return per spin is approximately 0.95
- **Hit rate of ~65%** — roughly 2 out of 3 spins should return something (mostly small wins to keep the player engaged)

## Paytable

Design the symbol weights and payouts to hit the 95% RTP and 65% hit rate targets. Suggested starting point:

| Combination         | Payout   |
|---------------------|----------|
| 3x Pirate Captain   | 50x bet  |
| 3x Treasure Chest   | 20x bet  |
| 3x Parrot           | 10x bet  |
| 3x Gold Coin        | 5x bet   |
| 3x Anchor           | 3x bet   |
| 3x Skull            | 2x bet   |
| Any 2 matching      | 1x bet   |

Adjust symbol weights (how often each symbol appears on each reel) so that:
- The sum of (probability × payout) across all outcomes ≈ 0.95
- The total probability of any win ≈ 0.65

## UI/UX Requirements

- Smooth reel spin animation (1–2 seconds per spin)
- Clearly labeled buttons: Spin, bet selection (highlight the active bet)
- Persistent display of: current balance, current bet, last win amount
- Highlight winning combinations visually (glow, flash, or border effect)
- "BIG WIN" splash animation for payouts of 10x or higher
- Disable Spin button during animation and when balance is below the current bet
- **Emergency deposit button:** appears when balance hits $0, adds $500 so the player can keep going
- **Jackpot celebration:** distinct over-the-top animation and sound when 3x Pirate Captain hits

## Audio

- Looping pirate-themed background music (use Web Audio API to generate or use a royalty-free source)
- Sound effects for: spin start, each reel stopping, small win, big win, jackpot
- Mute/unmute toggle button visible at all times
- Wins should sound satisfying and rewarding — make it feel like a real payout

## Code Quality

- **Separate files:** `index.html`, `style.css`, `script.js` (add `audio.js` or `utils.js` if needed for modularity)
- **JSDoc comments** with type annotations on every function
- **Modular design:** small, single-purpose functions with clear names
  - Examples: `spinReels()`, `calculatePayout()`, `updateBalance()`, `playSound()`, `checkWin()`
- Use a single game state object or module pattern — no scattered global variables
- Meaningful variable names, DRY principles, proper error handling
- Code should read as if one person wrote it — consistent style throughout

## Reliability

- Handle edge cases: insufficient balance, rapid clicking during spin, min/max bet boundaries
- Game state (balance, bet, spin result) must stay consistent at all times — no desync between display and internal state
- No crashes or freezes under any user interaction pattern
- Validate all state transitions before applying them
