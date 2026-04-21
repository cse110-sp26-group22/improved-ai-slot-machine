# 🎰 Slot Machine App Development Prompt

Design and implement a **1-cent slot machine application** with a focus on functionality, user experience, reliability, and clean code structure.

---

##  Core Game Specifications

- **Currency:** 1 credit = $0.01  
- **Minimum bet:** 25 credits  
- **Allowed bet values:**
  - 25, 50, 75, 100, 200, 500, 1000, 2000  
- The slot machine must simulate a **realistic casino experience**.

---

## 1.  Functionality Requirements

The slot machine must:

- Spin reels and produce outcomes using a **Random Number Generator (RNG)** that is:
  - Unpredictable
  - Fair
- Maintain a **Return to Player (RTP) of 95%**
  - Over time, for every $1 spent, the player should receive approximately $0.95 back
- Correctly calculate:
  - Wins
  - Losses
  - Balance updates
- Support:
  - Multiple paylines *(or at least a clear win condition)*

---

## 2. User Experience (UX/UI)

The interface should:

- Be **visually intuitive and responsive**
- Have a **smooth spin animation** *(~1–2 seconds ideal)*
- Include clearly labeled buttons:
  - Spin
  - Increase Bet
  - Decrease Bet
  - Balance display

Ensure:

- All clickable elements respond immediately
- No unnecessary or non-functional buttons

Provide visual feedback:

- Highlight winning lines
- Animate reels during spins

---

## 3. Reliability & Stability

The app should:

- Handle edge cases *(e.g., insufficient balance)*
- Prevent invalid bets
- Avoid crashes or freezes during rapid interactions
- Keep game state consistent:
  - Balance
  - Bet
  - Results

---

## 4. Code Structure & Clarity

Separate code into:

- **HTML** → layout and structure  
- **CSS** → styling and animations  
- **JavaScript** → logic and game mechanics  

Use:

- Clear variable and function names
- Modular functions:
  - `spinReels()`
  - `calculatePayout()`
  - `updateBalance()`

Optional:

- Additional files for organization:
  - `audio.js`
  - `utils.js`

---

## 5. Graphics & Audio Design

### Visuals

- Use **bold, colorful slot symbols**:
  - Fruits 
  - Bars
  - Sevens 7️⃣

Include:

- Reel animations
- Win splash effects *(e.g., flashing “BIG WIN”)*

### Audio

Add:

- Background music *(looped, not distracting)*
- Sound effects for:
  - Button clicks
  - Reel spins
  - Wins *(distinct sounds for small vs big wins)*

Ensure:

- Audio can be **muted/toggled**

---

## Additional Expectations

- The app should feel like a **real casino slot machine**, but simplified for clarity
- Prioritize:
  - Smooth interaction
  - Strong visual feedback
- Keep the implementation:
  - Clean
  - Readable
  - Extendable