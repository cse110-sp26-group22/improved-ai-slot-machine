# AI Use Log

## Part 1: Prototype generation

AI Use #1:


**Prompt:** (Specific, but with some vagueness)
Design and implement a 1-cent slot machine application with a focus on functionality, user experience, reliability, and clean code structure. It also must meet the following requirements;


Core Game Specifications: Currency: 1 credit = $0.01, Minimum bet: 25 credits, Allowed bet values: 25, 50, 75, 100, 200, 500, 1000, 2000. The slot machine must simulate a realistic casino experience.


Functionality Requirements
The slot machine must spin reels and produce outcomes using a Random Number Generator (RNG) that is unpredictable and fair, maintain a Return to Player (RTP) of 95% (over time, for every $1 spent, the player should receive approximately $0.95 back) It also should correctly calculate wins, losses, balance updates, and total winnings. 


User Experience (UX/UI)
The interface should be visually intuitive and responsive, have a smooth spin animation (not too slow, ~1–2 seconds ideal), include clearly labeled buttons. All clickable elements should respond immediately without unnecessary or non-functional buttons. Provide visual feedback like highlight winning lines


Code Structure & Clarity:
Separate code into different files for HTML, CSS, and JS. Make sure it is clear, modular, and uses functions and variables appropriately.


Graphics & Audio Design:
Use bold, colorful slot symbols (fruits, bars, sevens, etc.) with win splash effects and lots of movement. There should also be fun but not distracting background music and sound effects. The audio should be able to be toggled.


* Observations:
  * It was, for lack of anything else to say, boring. It was missing so much of what makes a good slot machine
* What needed to be fixed:
  * Brighter colors, bolder fonts, need spinning animation that takes some time but not too long. Everything just needed to be more. The Cyberpunky 8-bit game vibe I told it to create was also really bare bones. There was no music, there was no flashing lights or animations on wins, and there were no fun sound effects. There was no place to see net winnings which was needed. It was also confusing because it always said Win! but the number of credits would go down. . If there is a win, then the number of credits should increase and if there is a loss then the number of credits should decrease. there also needs to be more movement on the screen and more animations as a whole. All this needs to be changed
* What was already good
  * The buttons worked, the UI was easy to navigate, there was audio that could be toggled on or off 

## Part 2: Case-by-Case Functionality Refinement

AI Use #2:
**Prompt** (Specifically targets what needs to be improved)

Update the visual design to use brighter, more vibrant colors with a strong cyberpunk, neon 8-bit aesthetic, and incorporate bolder, more stylized fonts that match an arcade theme. Add glow effects, neon highlights, and greater visual depth, and improve the layout so key information such as credits and winnings is clearly visible at all times.


Enhance the animations by implementing a slot reel spinning effect that lasts a satisfying amount of time, not too fast but not too slow, and feels smooth and engaging. Introduce more motion throughout the interface, including subtle idle animations and pulsing or flashing lights. When the player wins, include distinct celebratory animations such as flashing lights, highlighted winning symbols, and possibly screen shake or similar effects to make the moment feel rewarding.


Incorporate sound design to make the game more immersive. Add background music that fits a cyberpunk arcade vibe, along with sound effects for spinning, button presses, wins, and losses. Win sounds should feel rewarding and distinct, while loss sounds should provide clear but subtle feedback.


Fix the core game logic so that the outcome messaging and credit changes are accurate. The game should no longer always display “Win!” incorrectly. Wins must increase the player’s credits, while losses must decrease them, and the distinction between a win and a loss should be clearly communicated through both text and visuals.


Add a clear display for net winnings or balance changes. The interface should show the player’s current credits as well as how much was won or lost on each spin, presented in a way that is easy to understand at a glance. Overall, the game should feel lively, responsive, and engaging, avoiding a bare-bones presentation and instead emphasizing polish, feedback, and an enjoyable arcade-style experience.


* What got fixed:
  * The colors are brighter and there is a spinning animation now. There is also a feature that shows what the last result was, which is a step closer to having a total winnings counter but not quite there yet. The audio is also substantially better. Also, credits are still not being updated correctly.
* What still needs to be fixed:
  * I will specify adding a current winnings counter
  * I will have to be very specific with how credits must be updated 


AI Use #3: 
**Prompt**: Add more moving colors and visuals and animations in the background. Instead of the feature that shows what the last result was, replace this with a feature that keeps a running score of how much money the user wins in all their spins. Furthermore, vary the different types of images that show up on the slots and the different types of wins. 


Here is the exact functionality that must exist for credit updates on a win or a loss:
- First, subtract the bet from the number of credits upon the spin number being pressed
- Next, calculate the multipliers based on the win and when the result is shown to the user, THEN add the value won from the slot to the current counter of credits and to the total wins display

* What got fixed?
  * It now properly deducts the bet amount upon the spin button being pressed. The UI looks the same, however, which makes sense because we have not created the types of flashy assets seen in typical slot machine games
* What still needs to be fixed?
  *  it never properly updates the current number of credits with the winnings, which is a major problem because in essence, the user isn't visibly winning anything at all, which makes it harder for them to remain engaged


AI Use #4:

**Prompt**: Fix the update of credits won. After the number of credits won is shown to the user, add that amount immediately both to the current credits count and the total winnings counter, but make sure this adding only executes directly after the number of credits won is shown to the user.

* What got fixed?
  * It finally correctly updates the counter of credits and the total winnings. It doesn't need anything to be technically correct at this point.


## Final Conclusion:

The slot machine technically works as intended with all the functionality features we decided were important for this software. However, the UI is still quite boring. The problem with simply asking the AI to make it look better, even if it is a detailed ask, is that it has no assets to pull from that we have created and given to it, so the flashy and bright nature of usual slot machine apps is missing from this rendition of our software. I also think that the theme I gave it was maybe not the most ideal. I gave it the prompt for a cyberpunk or 8-bit video game theme which is a bit dark and simple. This is very different from the bright and bold themes of casinos. It has room for improvement for sure, but seeing as the functionality is finally passable, I decided to conclude my runs with the AI model here. 