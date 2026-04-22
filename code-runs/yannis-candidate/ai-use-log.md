# AI Use Log — Yannis Candidate

## Entry 1 — Initial Scaffold
Prompted Gemini to build a 3-reel slot machine with weighted probabilities,
bet sizing, $100 balance, Vegas theme, and ~92% RTP.

## Entry 2 — File Placement Issue
Gemini placed files in repo root instead of yannis-candidate. Moved them
manually. Learned Gemini uses the workspace root by default.

## Entry 3 — Animation Planning
Asked Gemini to add spin animation, win flash, near-miss, and game over screen.
Gemini entered plan mode and outlined strategy before coding.

## Entry 4 — Spin Animation
Gemini implemented staggered reel stop animation. Reels stop left to right
with 300ms delay each.

## Entry 5 — Win Flash & Near-Miss
Gemini added golden neon win flash and near-miss mechanic triggering 30% of
losses with 2 jackpot symbols.

## Entry 6 — Game Over Screen
Gemini added game over state when balance hits $0. Reset button restores $100.

## Entry 7 — Paytable
Asked Gemini to add a paytable showing symbols and payout multipliers.
Styled in neon gold and cyan to match theme.

## Entry 8 — Mobile Responsiveness
Asked Gemini to make layout responsive to 375px. Added media queries scaling
reels, text, and padding for mobile.

## Entry 9 — Win Streak Counter
Asked Gemini to add win streak counter. Shows neon magenta badge and fires
"X WINS IN A ROW 🔥" message at 3+ consecutive wins.

## Entry 10 — Unit Tests
Asked Gemini to write unit tests in tests.js for weighted random selection,
payout calculation, and balance updates. Runnable in browser console.

## Entry 11 — JSDoc Cleanup
Gemini added full JSDoc with @param and @returns to every function in script.js.

## Entry 12 — DRY Refactor
Repeated UI logic consolidated into updateUI() and toggleControls(). 
Result generation extracted into generateResults().

## Entry 13 — Error Handling
Added NaN and range checks for betAmount and balance to prevent game breaking
on unexpected input.

## Entry 14 — Max Bet Button
Added a MAX BET button that selects $10 and auto-spins. HTML and CSS updated
to accommodate it responsively.