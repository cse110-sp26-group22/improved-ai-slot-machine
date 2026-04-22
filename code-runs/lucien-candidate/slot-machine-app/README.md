# 🎰 1-Cent Slot Machine App

A realistic, high-fidelity slot machine application built with HTML, CSS, and JavaScript.

## Features
- **Realistic RTP**: 95% Return to Player (RTP) achieved through weighted symbol distribution.
- **Multiple Bet Levels**: Choose from 25, 50, 75, 100, 200, 500, 1000, or 2000 credits.
- **Smooth Animations**: CSS-powered reel spins and win highlights.
- **Responsive Design**: Works beautifully on both desktop and mobile devices.
- **Audio Effects**: Dynamic sound effects for spins, wins, and interactions (uses Web Audio API).
- **Interactive Controls**: Easy-to-use interface for adjusting bets and spinning.

## How to Play
1. **Open `index.html`** in any modern web browser.
2. **Set your bet** using the **+** and **-** buttons. Each credit is worth $0.01.
3. **Click SPIN** to start the game!
4. **Win Conditions**:
   - 3 of a kind: Highest payout based on symbol rarity.
   - 2 of a kind (first two): Partial payout.
   - Any 🍒 Cherry: Small consolation prize.

## Credits & Symbols
| Symbol | Value |
| :--- | :--- |
| 💎 Jackpot | ⭐⭐⭐⭐⭐ |
| 7️⃣ Seven | ⭐⭐⭐⭐ |
| ➖ Bar | ⭐⭐⭐ |
| 🍇 Plum | ⭐⭐ |
| 🍊 Orange | ⭐ |
| 🍋 Lemon | ⭐ |
| 🍒 Cherry | (Small Win) |

## Implementation Details
- **HTML5**: Semantic structure and game container.
- **CSS3**: Animations, gradients, and flexbox layout.
- **JavaScript**: RNG logic, payout calculations, and state management.
- **Web Audio API**: Real-time sound generation (no external assets required).
