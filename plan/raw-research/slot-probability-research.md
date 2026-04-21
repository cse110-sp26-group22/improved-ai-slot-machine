# Slot Machine Probability & House Edge Research

---

## The House Edge

Every slot machine is designed so the house wins over time. This is measured by **RTP (Return to Player)** — the percentage of all wagered money a machine pays back over time.

- Typical RTP range: **85% – 98%**
- A 94% RTP means for every $100 wagered, the machine pays out $94 on average
- The remaining 6% is the **house edge**
- For our slot machine, targeting an RTP of around **90–95%** feels realistic and engaging

---

## How Probabilities Are Rigged (Legally)

### Weighted Reels
Symbols don't appear with equal probability. Each symbol on a reel is assigned a **weight** — higher-value symbols appear less frequently. The specific weights should be decided once final symbols are chosen, but the structure looks like this:

| Symbol Tier | Example Weight | Notes |
|-------------|---------------|-------|
| Common (low value) | 10 | Appears most often |
| Uncommon (mid value) | 5 | Moderate frequency |
| Rare (high value) | 2 | Infrequent |
| Jackpot | 1 | Very rare |

Probability of a 3-reel jackpot at weight 1 out of 30 total = (1/30)³ ≈ **0.004%**

### Virtual Reels (Modern Slots)
Modern digital slots use a **virtual reel** mapped to a larger RNG pool. The visual reel might show 20 stops, but internally it maps to 256+ positions — making jackpot symbols even rarer than they visually appear.

---

## Psychological Tactics Slot Companies Use

### Near Misses
The machine is programmed to show jackpot symbols just above or below the payline more often than pure chance would dictate. This creates the illusion that the player "almost won," encouraging them to keep spinning.

### Losses Disguised as Wins (LDW)
On a multi-line machine, a player bets $1 and wins $0.25 — but the machine still plays a win animation and sound. Technically a loss, but psychologically registered as a win.

### Variable Ratio Reinforcement
Wins are unpredictable in timing and size, which is the most psychologically addictive reward schedule (same principle as social media likes). The randomness keeps players engaged far longer than predictable rewards would.

### Bet Sizing Illusion
Letting users choose their bet creates a sense of control and agency, making them feel like skill or strategy is involved when it isn't.

---

## Implications for Our Slot Machine

- Implement **weighted symbol probabilities** rather than uniform random selection
- Set a target RTP (e.g. 92%) and tune weights once symbols are finalized
- Include a **near-miss mechanic** where 2/3 jackpot symbols appear slightly more often than pure math would suggest
- Play win animations even for small wins to maximize engagement feel
- Give the user a **bet sizing option** to create perceived agency

---

## Weighted Random — Code Structure for Gemini

This is a reusable pattern to give to the AI regardless of final symbol choices:

```js
// Plug in finalized symbols + weights here
const symbols = [
  { name: "symbol_a", weight: 10, payout: 2 },
  { name: "symbol_b", weight: 5,  payout: 5 },
  { name: "symbol_c", weight: 2,  payout: 20 },
  { name: "jackpot",  weight: 1,  payout: 100 },
];

function weightedRandom(symbols) {
  const total = symbols.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * total;
  for (const s of symbols) {
    rand -= s.weight;
    if (rand <= 0) return s;
  }
}
```

---

## Sources
- General knowledge of casino game design and probability theory
- Concepts from behavioral psychology (variable ratio reinforcement schedules)
- Common patterns in mobile gambling app design

- Strickland, L.H. & Grote, F.W. (1967). *Temporal presentation of winning symbols and slot machines.* — Original study on near-miss reel weighting (70/50/30% across reels).  
  https://www.stat.berkeley.edu/~aldous/157/Papers/near_miss.pdf

- Witts, N. et al. (2019). *The Near-Miss Effect in Slot Machines: A Review and Experimental Analysis Over Half a Century Later.* PubMed / PMC.  
  https://pubmed.ncbi.nlm.nih.gov/31522339/

- Easy Vegas (2025). *How Slot Machines Work.*  
  https://easy.vegas/games/slots/how-they-work

- Study Breaks (2020). *The Psychology Behind Slot Games.*  
  https://studybreaks.com/thoughts/slots-games-psychology/

-Also this link is a good link n stuff for looking at idk lol
  https://easy.vegas/games/slots/program
