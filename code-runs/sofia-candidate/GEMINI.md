# Gemini AI Instructions

## Ground Rules

- **Do NOT push to git.** 
- **Stay within the current directory.** All reads, writes, and operations must stay within the directory `sofia-candidate` and its subdirectories.
- **Do not install dependencies without explicit approval.** Ask first and wait for confirmation
- **Do not run build or deploy scripts** 

---

## Project Overview

You are assisting in building a self-contained browser-based slot machine game. The goal is a polished game that adheres to software engineering best practices.

---

## Stack Choice 

You are free to choose the tech stack but HTML/CSS/JS is preferred. However:

- Before writing any code, state your chosen stack and explain why it is the best fit for this project.
- Consider: bundle size, testability, separation of concerns, and how well it supports the features below.
- Your rationale will be logged in the project's `ai-use-log` as part of the assignment, so be specific.

Whatever stack you choose, the code quality standards below apply universally.

---

## Game Specifications

### Currency & Betting
- Starting balance: 1,000 credits
- Minimum bet: 25 credits
- Valid bet values: 25, 50, 75, 100, 200, 500, 1000, 2000
- Prevent spins when balance is below the current bet

### RNG & Fairness
- Use a sufficiently unpredictable RNG
- Maintain a Return to Player (RTP) of ~95%

### Theme: Animals & Plants

The slot machine has a **nature / wildlife theme**. Use animals and plants as the symbols. All other design decisions, which specific symbols, how many, payouts, color palette, and visual style, are yours to decide.

### Win Conditions
- Center payline is the primary win condition
- Optionally support top and bottom paylines for higher bets

---

## Code Quality Standards

### General
- **Separate concerns** game logic, UI rendering, RNG, audio, and utilities must each live in their own module or file. Do not mix them.
- **Meaningful names**: names that make reviewing code clear and easy
- Keep functions small and well defined
- **No duplicate code** extract shared logic into a utils module
- **Handle all edge cases**: insufficient balance, mid-spin clicks, and any else
- No commented-out dead code in final files

### Markup & Styling
- Semantically valid markup (passes W3C validation or framework equivalent)
- No inline styles, all styling in dedicated style files or styled components
- No inline event handlers, all listeners attached in JS/component logic
- Use attributes for accessibility
- CSS custom properties or design tokens for all repeated values
- Spin animation duration: 2-3 seconds
- All clickable elements must have hover and active states

### Linting
- Fix lint errors as they appear — do not accumulate them

---

## UX Requirements

- **Spin button**: primary action, large and prominent
- **Bet controls**: increase/decrease buttons cycling through valid bet values only
- **Balance display**: always visible, updates immediately after each spin
- **Win feedback**:
  - Highlight the winning payline visually
  - Show win amount with a "BIG WIN" splash for multipliers, "WIN" for smaller wins
  - Distinct sound for small wins vs big wins
- **Insufficient balance**: show a clear error message, do not silently fail
- No placeholder buttons in the final UI

---

## Audio

- Background music
- Sound effects
- Mute toggle button 
- All audio logic isolated in its own module

---

## Testing

- **Unit tests are required** — use whatever fits the chosen stack
- End-to-end tests with **Playwright** are encouraged
- Tests live in a `tests/` directory
- Run tests before declaring any feature complete

---

## Logging for ai-use-log

The human operator maintains an `ai-use-log`. End each response with a brief summary of:
- What was done
- Any files created or modified
- Any errors encountered
- Any decisions made and why

You do not write the log, just provide the summary.

