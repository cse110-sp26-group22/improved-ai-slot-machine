# AI Use Log — Brenda Candidate

## Entry 1 — The Initial Build
**Prompt used:**  
I asked Gemini to generate a simple first version of a browser-based slot machine using separate HTML, CSS, and JavaScript files. I asked for a 1-cent slot machine with allowed bet values, a balance display, bet controls, a spin button, a smooth spin animation, and beginner-friendly code.

**What Gemini produced:**  
Gemini was able to create the first initial playable slot machine structure and in this incorporated three reels, a balance display, bet controls, and a simple spin behavior.

**What worked:**  
The first version was able to give me a functional base quickly and also included the core game loop that we wanted.

**What needed improvement:**  
The styling was basic and the visual feedback after spins was still limited. Needed to be more enhanced.



## Entry 2 — UI / UX Improvement
**Prompt used:**  
After the first prompt I asked Gemini to then iterate and improve the slot machine so it felt more like a real casino machine and i did this by improving the layout, spacing, colors, reel appearance, and win/loss feedback while still focusing on keeping the code simple.

**What Gemini changed:**  
Gemini was able tp update the UI in order to make it feel more like a real slot machine. It did this by now adding a marquee header, darker cabinet styling, LED-style displays, improved reel visuals, as well as a flashing animation whenevery you win.

**What worked:**  
Compared to my first version the slot machine now looked more enhanced and professional, it also was able to be more visually enganging. 

**What I adjusted:**  
I had kept most of the design improvements since I felt like they enhanced the previous versions, but I also made small edits so the balance, text, and messages were able to stay consistent with my previous version.



## Entry 3 — Logic Cleanup and Tests
**Prompt used:**  
I asked Gemini to improve the code quality by separating game logic from UI logic, reducing repetition, and being able to also help in creating a simple test file.

**What Gemini changed:**  
Gemini reorganized the JavaScript by moving payout and balance logic into separate functions, grouping DOM elements more cleanly, and generating a `tests.js` file.

**What worked:**  
The code now became easier to read and more organized. It was also easier to understand how the payout and balance logic worked.

**What I adjusted:**  
I kept the improved structure, but made a few small changes to keep the messages and balance values consistent with my version.



## Final Reflection
Using Gemini in smaller steps worked better than trying to do everything in one prompt. It made it easier to focus on one improvement at a time, review the changes, and keep the code clean and understandable. If i tried to do it all in one go being able to iterate and look at issues was way more difficult and didnt allow me to fully understand all of it 