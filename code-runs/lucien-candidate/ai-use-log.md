# Lucien Code Run candidates:
## AI-USE log:
### Log 1:
Prompt: Please finish the task specified in @improved-ai-slot-machine/code-runs/prompt.md

Response: Gemini created the original version of the slot-machine, it contains 5 files:
- audio.js
- index.html
- README.md
- script.js
- style.css

Observations: The generated slot machine looks fine at first but the functionality didn't work properly.

### Log 2:
Prompt:  I have moved all your output file in to @improved-ai-slot-machine/code-runs/lucien-candidate/slot-machine-app/ , now add debug features for example: add output of the results of the slot machine to the console.

Response: Gemini edited script.js and added multi console.log to show the actual slot machine output.

Observations: Based on the console log output, I am sure that the output shown on the page doesn't match the actual output.

### Log 3:
Prompt: There are errors in the slot machine: the spin result doesn't match what is shown

Response: Gemini edited script.js

Observations: Now the correct result is shown in the page.


### Log 4:
Prompt: Add a test function in slot-machine-app\test\test.js, use this to test the rtp

Response: Gemini added a test.js. It ran it using node.js and figured out that the RTP is significantly lower than required, and updated the specific values multiple times and guarantee that the new value matches our requirements.

Observations: Now the slot machine is much easier to gain back credits then before.