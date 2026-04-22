# AI Slot Machine Pt2: Strategic use of AI

Goal: build a vastly improved version of the slot machine with a strategic use of AI

* We will be using Gemini CLI
* The assignment is split into several parts
* Research 
* User-focused activities 
* Code Runs
* Presentation and Video


Research Team: Your responsibility is to gather information about what features exist in slot machine apps, the visual themes users expect, types of users, and anything that might be helpful in creating prompts for the AI. Research should include both the task and the users it pertains to, and a rubric should be created outlining what a good slot machine looks like so that the Code Runs Team can use it to evaluate their results objectively. 
* Members: @Sirtaj Gill @tree 
* **However**, every member must contribute to research. Sirtaj and Dmitri are just the home base of this task and are responsible for making sure the research is as thorough as possible. If they want, they may reach out to individual members and ask them to look into a topic.
* DUE: Sunday night @ 11:59pm

User Scenarios Team: Your responsibility is to come up with hypothetical user scenarios and create documents regarding their needs. Come together and agree on questions and categories of interest and create thorough documentation on the needs of our target audience. Work with the research team to include a part in the rubric that evaluates user experience. 
* Members: @Sean Zemlyak @Anirudh Nayak 
* DUE: Sunday night @ 11:59pm

Code Runs Team: Your responsibility is similar to doing the candidates from the last assignment. Create a directory in the repo with the name "your_name-candidate" and in this directory create a document outlining your use of the AI in ai-plan.md and your documentation of how you used the AI incrementally in ai-use-log.md. You must do at least 3 uses of the AI/modifications of the code that you should document in ai-use-log.md, but feel free to keep going until you've come to an end product you're happy with. You may use any approach you'd like and modify your plan as you see fit. You may read, evaluate, and change the code, but try not to do so too much. At the end, your code must be checked for style, consistency, testing, documentation, and cleanliness. At the end, all of us will come together and select the one we think is best based on the rubric drafted by the research team and write our final report.
* Members: @Angel Thakur, @Benjamin Michael, @Brenda Ramirez, @Kaung Myat Han, @Sofia De Marco, @Yannis Smith, @Lucien Chen
* DUE: Wednesday afternoon @ 1:00pm


## Reasoning for choosing Gemini: 

We primarily picked Gemini CLI because it was free to use, and the team struggled with the subscription fees of Claude on our last rendition of the AI slot machine. Some tests done by Ben yielded the following information, upon which we will base our candidate-based testing:

Login: 1000 "Requests" are available free per day when using a google account for authentication/login. School email did not work during Ben's setup so a personal email was used instead.

Models: A few different models are available with independent rate limits assigned to two usable categories Flash and Lite. /model allows user to change model and check model usage.

Usage: Tested our ai-slotmachine prompts with each seeming to consume around 5-6% of available daily requests. Depending on the amount of prompting done, we might need to utilize Lite models when necessary or spread prompting throughout the week.
