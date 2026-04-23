# Final Report - AI Slot Machine

## Overall process

We decided to do a modified approach of the first part of the AI slot machine warmup, but instead of having 50 different candidates, we narrowed it down to seven all that built up from the same initial functionality critera. The functionality critera was as following, but was very flexible in case the seven people creating candidates decided to do something different, but better. The following requirements are based on the research done prior to moving onto generating code. They also heavily influenced the rubric we used to judge the final product. 


1. 1 cent slot machine where 1 cent is eqal to 1 credit
2. Bets follow the increments 25, 50, 75, 100, 200, 500, 1000, 2000
3. Slot machine must be themed with bright images and colors
4. The RTP (return to player) must be 0.95. 
5. RNG is appropriately unpredictable
6. The UI is intuitive and responsive
7. The program should function with no bugs or crashes
8. The program must use fluid and eye catching animations
9. There must be engaging sound effects and music that is toggleable
10. The algorithm must correctly calculate wins, losses, and payouts, updating it correctly
    - "Correctly" means that the bet amount should be subtracted from a total credits counter upon clicking spin, then winnings should be added to the credits counter when displayed to the user. 


Each team member on the Code Runs Team did at least 3 modifications of their candidates, but it often required several more.


It is neccesary to note that our UI needs were left flexible in order for individual members of the team to design a slot machine that they deemed the most effective and most creative. 


## Candidate Summaries

The following section describes the process behind each of our candidate development processes:


**Candidate 1**: Angel<br>
Iteratively used AI to build a cyberpunk/8-bit video game themed slot machine app, starting with a functional but visually basic prototype that lacked engaging design, proper animations, and correct credit logic. In subsequent prompts, refined the UI, animations, audio, and especially the game logic, gradually fixing issues like incorrect win messaging and credit updates. The most critical improvement came from explicitly defining how credits should be deducted and added, which finally resolved the core functionality. While the app now works correctly from a gameplay standpoint, the visuals remain underwhelming due to limited assets and a less vibrant theme choice. Overall, the process showed that precise, targeted prompts are necessary to achieve both correct functionality and better design.


**Candidate 2**: Ben<br>
Aimed to build a Greek underworld–themed slot machine with engaging visuals, sound, and progression-based gameplay. While the initial prototype had major issues with visuals, sound, and incorrect game logic, iterative refinements improved UI clarity, fixed bugs, and introduced better mechanics like scaling rewards and a progress-based win system. Over multiple revisions, core gameplay systems such as betting limits, win distributions, and expected return values were repeatedly adjusted to create a more balanced and engaging experience. Key features like the jackpot system, escape progression, and reward probabilities were redesigned several times to improve playability and consistency. In the end, the program became functional and reasonably engaging, though visual quality remained limited due to asset constraints.


**Candidate 3**: Brenda<br>
Aimed to build a slot machine app iteratively, starting with a basic functional prototype that included core gameplay elements like reels, betting, and balance tracking. Then, progressively improved the UI to make it more visually engaging and casino-like, adding better styling, animations, and clearer feedback for wins and losses. In a later step refactored the code to separate logic from UI and introduced basic tests to improve structure and readability. Overall, working in smaller iterative steps made it easier to refine features and understand the system compared to trying to build everything at once.


**Candidate 4**: Kaung<br>
Aimed to build a pirate-themed slot machine through multiple iterative rounds, starting from a fully scaffolded prototype with modular files, sound, and game logic. While the AI produced well-structured and feature-rich code—including animations, audio, and UI enhancements—it frequently failed in critical areas like mathematical correctness (RTP), visual rendering logic, and subtle runtime bugs. Many issues required explicit, narrowly defined prompts or external verification (such as RTP calculations done outside the model) to resolve effectively. Overall, the iterative debugging process was essential, with the AI performing well at implementation but poorly at self-diagnosis and validation of correctness.


**Candidate 5**: Lucien<br>
Iteratively built and debugged the slot machine app, starting from a full initial scaffold and gradually improving functionality, UI layout, and responsiveness across multiple device formats. Early issues included mismatches between displayed and actual game results, layout misalignment, and RTP imbalance, which were progressively fixed through targeted debugging and console logging. Additional features like RTP testing, paytable integration, and responsive design were added, though some UI polishing issues (like scroll behavior and alignment) required multiple refinement cycles. Overall, the final version became a stable, functional, and well-structured slot machine with high reliability and strong code organization, achieving a near-complete rubric score.


**Candidate 6**: Sofia<br>
Attempted to develop a nature-themed slot machine through a highly iterative, plan-driven workflow, starting with an architectural design phase and progressing into modular implementation with separate files for game logic, UI, audio, and testing. A major focus of the process was repeatedly simulating and correcting RTP, where the model cycled through multiple incorrect or unstable values before eventually converging near the target range through test-driven adjustments. Alongside gameplay tuning, incrementally improved UI responsiveness, animations, background music, and visual effects, though some changes temporarily broke layout and required correction. The project ultimately evolved into a more complex 4x4 grid-based slot system with multi-directional win conditions, and enhanced visuals, but this ended up ruining the overall game mechanic and win calculation. 


**Candidate 7**: Yannis<br>
Similarly used the AI in an iterative development process to build a 3-reel Vegas-style slot machine, starting from a basic scaffold and progressively adding features like animations, near-miss mechanics, paytables, win streak tracking, and accessibility support. Each prompt incrementally improved functionality, structure, and user experience while maintaining stable core gameplay logic and weighted probability-based outcomes. Gemini also helped refactor code into cleaner, more modular functions and introduced testing and configuration improvements using constants and unit tests. Overall, the final result was a significantly more complete and polished slot machine, with the main limitation being relatively generic visual styling due to lack of custom assets.

### Which candidate was the best one?

It was a difficult pick between Ben's "Escape from the Underworld" themed slot machine and Kaung's "Pirate's Booty" themed slot machine. Both had mesmerising UI's and graphics with consistent and reliable user experience, audio, and gameplay mechanics, which set them apart from the other 5 candidates. From here, we moved onto evaluating both these candidates with the criteria of the rubric. However, both scored perfectly.They had the desired RTP, randomization in both, smooth animations, responsive buttons, and fun audio features. Even though both candidates did their selection of bet amounts differently than previously agreed upon, we did not decide to count this as a negative element of the end result because this was a flexible aspect of the functionality and not essential to the overall impact of the game. At the end the decision between the two came down to which one stood out more. Ben's "Escape from the Underworld" won in this comparison for several reasons. Ben's candidate created an end goal and progression systems with several types of wins, each with different rarities, that contributed to the user's Underworld Escape progress in an amount proportional to the betted sum and the win's rarity. If the user loses all their money, their soul is taken by Hades and they lose. Having an end goal and a consequence for losing made the game extremely engaging, addictive, and facinating. We even had a few objective users test both slot machine games and they all prefered the engagement and progression of Ben's slot machine game. Ultimately, this one was our best product.

### Extra refinement

In the future, this game could be improved by making the game easier to lose and higher stakes, as more losses would keep the user engaged for longer. In the interest of time, we could not implement these changes, but it would improve the overall addictiveness of the game, which was one of our goals with the project.

### Final Conclusion

The team collectively learned several things througout this process. The first was how essential research is. Without properly looking into what makes a slot machine game addictive and successful, and what makes a game as a whole a "good" game, the development of this process would have been like blindly trying to create an ambiguous end goal. We also learned how essential it is to review the work of AI and incrementally build up to a larger goal. AI is not the thinker, the tester, or the reviewer. It is simply the executor when given specific instructions. We as developers still must take great care to break down our large and unspecific ideas into actionable tasks for our AI assistants. 