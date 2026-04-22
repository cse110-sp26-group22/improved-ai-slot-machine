# Cyber-Slot 8000: 1-Cent Slot Machine

A high-tech, Cyberpunk/8-bit themed slot machine application designed with reliability, fair play, and immersive user experience in mind.

## Core Features
- **Currency:** 1 credit = $0.01
- **Minimum Bet:** 25 credits ($0.25)
- **Allowed Bets:** 25, 50, 75, 100, 200, 500, 1000, 2000 credits.
- **RTP:** Mathematically verified **95% Return to Player** (over time).
- **RNG:** Predictable and fair random outcomes using weighted probability.
- **Aesthetic:** Cyberpunk / 8-Bit with neon glow, scanlines, and pixel icons.
- **Audio:** 8-bit synthesized sound effects using the Web Audio API (Toggleable).

## Tech Stack
- **HTML5:** Semantic structure.
- **CSS3:** Flexbox/Grid layout, neon effects, and smooth spin animations.
- **Vanilla JavaScript:** Modular engine, state management, and audio synthesis.

## Code Structure
- `index.html`: Main entry point.
- `styles.css`: All visual styling and animations.
- `js/slot-machine.js`: Core game engine and win logic.
- `js/ui-controller.js`: Orchestrates DOM updates and spin animations.
- `js/audio-manager.js`: Handles 8-bit sound synthesis.

## Mathematical Verification (RTP)
To verify the 95% RTP, you can run the provided simulation script:
```bash
node tests/verify-rtp.js
```
This script simulates 1,000,000 spins and logs the total wagered vs. total won.

## Symbols & Payouts
| Symbol | Icon | Weight | Payout (x Line Bet) |
|--------|------|--------|----------------------|
| Glitch | 👾 | 70% | 2.5x |
| Disk   | 💾 | 20% | 10x |
| Laser  | 🔫 | 8% | 20x |
| Heart  | ❤️ | 1.5% | 400x |
| Skull  | 💀 | 0.5% | 1000x |

---
*Created for CSE 110 - Improved AI Slot Machine Project.*
