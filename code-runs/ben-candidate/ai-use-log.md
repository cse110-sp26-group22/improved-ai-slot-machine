# AI Use Log

## Part 1: Initial Prompt

Finalized Initial Prompt:

- Overview + Output
    - Generate a working prototype for slot machine program, "Escape From the Underworld" written in HTML/CSS/JS. This will be a slot machine built for entertainment purposes with the goal of having the player spend the most amount of time on the slot machine as possible. The goal of the player is to hit the jackpot and to not run out of coins. 
    - Slot machine should be highly visually and auditorily stimulating similar to other online casino slot machines.
    - This slot is intended to be viewed in desktop rather than mobile.
    - Import any needed images and media from online as necessary.
    - Include tests for possible user inputs in different environments to make sure program runs as intended
- Theme:
    - Slot machine will be "Greek Underworld" themed
    - An imposing image of Hades will be large and present on the interface, reacting concerned during successful spins, and happy during failed spins.
    - Lightning and coin sounds will play during successful spins scaling with the amount won. Fire and Hades laughing sounds will play scaling with amount lost.
    - Lighting and bright effects will appear visually during successful spins, and fire and darkness during failed spins.
    - If the jackpot is hit, Hades will scream and disappear, and a victory screen will appear with a grand olympus theme and Zeus smiling.
    - Game over screen has Hades laughing with a firey dark theme
    - Background will consist of a rendition of the underworld covering the entire page
    - Reel images will be greek underworld themed
- User Experience
    - 3x3 reel format with only 3 middle elements affecting results
    - Color pallete will be mostly red and black in the background and interface. This will contrast with blue and white themes of victory screen and successful spins
    - Bet button, bet increase button, bet decrease button
    - Replay button on game over or victory screen.
    - Escape chance % will be displayed above the reel corresponding to jackpot chance.
    - Include a table for win amounts on the right of the interface
    - Include stats for this run to the left of the interface
- Game mechanics
    - Each successful spin will increase the jackpot chance by an amount scaling with the amount won. 
    - Losses will not descrease jackpot chance
    - If player runs out of gold coins, they get the game over screen
    - If player hits the jackpot the get the victory screen
    - Win % should be relatively high relative to other slot machines to allow player to eventually win the jackpot most play iterations. 60-65%.

Practice clean code as if a senior software engineer will be reviewing the program. Focus on clarity over fluff when possible. Code should be runable with minimlal setup. 

## Part 2: Run 1 + Review

# Evaluation:

The resulting program is pretty much a pile of hot garbage. No images are properly rendering aside from emojis in the rewards and reel section. Sound is inappropriate to put it lightly. It's like listening to someone getting stabbed to death. Interface is generally passable but barebones. Spinning display is incorrect with icons not matching wins/losses. Escape chance scales too quickly leading to quick and unsatisfying victories.

I was prompted for approval during Gemini "Planning phase"

# Refinement Prompt:

Images:
    - Replace all internet-gathered images with generative art approximating what the image was supposed to be.
    - Use a unique icon for jackpot elements. This icon's appearance rate should scale with the jackpot chance. 
- Game mechanics:
    - Reduce the scaling rate for escape chance by 80%
- User Experience:
    - Utilize gradients to give the background a less static appearance. 
    - Color Current Gold Icon and value the color Gold.
    - Fix sounds. Effects should match the existing theme, but should be high energy rather than dreary. Avoid reverb.
    - Fix reel displays. Currently, icons do not match backend behavior. Make the reel a 3x3 display.
    - Move the current gold element beneath the bet adjustment buttons.
    - List escape chance adjustment as a visible element in the rewards table scaling as bet increases
    - Add art in blank areas with no elements.

# Usage 

25% - Gemini 3 Flash

## Part 3: Run 2 + Review

# Evaluation:

Sound is still broken. Escape chance does not scale with bet. UI looks a bit better but is difficult to see at lower resolutions. Hades is some weird vector art thing but is probably okay for now. Several positive changes have been made but several bugs remained that were mentioned in the previous refinement prompt.

# Refinement Prompt:

- Game mechanics:
    - Make escape chance and Win amount scale correctly with bet. There should be a linear relationship between bet and escape chance/win amount
    - Jackpot should not give gold or esc%. It should be the key icon and spinning it should go straight to victory screen. Chance of spinning the keys should be proportional to escape chance %. 
    - change the existing icon for 1000 win to a different icon.
    - Escape chance % should max out at 10%
    - Reduce escape chance scaling by a multiple of 10
- User Experience:
    - Make the escape chance and win amount correctly scale in the Fates' Rewards section with bet.
    - Give the key icon a seperate sectin above the rest of symbols in Fate's Rewards showing key = Escape!
    - Add key icon next to current escape chance % listed under hades image.
    - Make the Hades image angry during normal wins
    - Make the Hades image furious during win screen/jackpot
    - Add size scaling to reel and hades image to allow better rendering on lower resolution screens
    - Rewrite code for sound from scratch as it is still broken. If possible add lighting sounds during wins and fire sound during losses

# Usage

33% - Gemini 3 Flash

## Part 4: Run 2 + Review

# Evaluation:

Sound is fixed for the most part but is not thematically appropriate. Mountain emoji has no corresponding win value and is considered a loss when spun. Linear escape chance scaling is a poor idea with current win rates (super low). Interface breaks when gold < bet. Loss screen does not show up under and circumstance. 

# Refinement Prompt:

- Game mechanics:
    - Make escape chance cap at 20%
    - Ensure losing screen appears only when gold = 0. Currently game softlocks when bet > current gold. 
    - Ensure bets can be made until gold hits 0. 
    - Increase win rates significantly. Total Won should typically scale faster than Total Lost. 
    - Mountain icon is currently broken and does not provide a win when spun. 
    - Reduce escape chance scaling with bet by a factor of 100
- User Experience:
    - Add mountain icon to rewards table

# Usage

43% - Gemini 3 Flash

## Part 5: Run 3 + Review

# Evaluation:

Overall UI is in passable state but game logic is still not conducive to long play. Winnings scale far faster than losses resulting in escape chance quickly exploding. Despite this, keys dont seem to ever hit despite maxxed escape chance. Need to redo winnings logic,

# Refinement Prompt:

- Game mechanics:
    - Winnings scale too fast currently. Rewrite reward table and rates such that Expected return on each spin is 1.2x bet. 
    - Ensure high win icons occur far less frequently thatn low win icons. 
    - Bug: Game over screen does not appear at 0 gold.
    - Bug: Bet amount can surpass current gold
    - Bug: Escape roll never occurs. Check spin logic
- User Experience:
    - Change the key icon next to escape chance and in fate rewards to be 3 keys in a row to better explain behavior to user
    - Add How many times symbol has been spun in Mortal Stats section.

# Usage

49% - Gemini 3 Flash

## Part 6: Run 4 + Review

# Evaluation:

Return rates are broken. Are far too low. Difficult to test behavior as can progress the slot.

# Refinement Prompt:

- Game mechanics:
    - Total lost far surpasses Total won on average. This is unintended behavior. 
    - The expected value return per spin should be 1.2x the bet amount. Rewrite current values to ensure this property is true for this slot machine
    - Include rates and math done to ensure 1.2x expected return in tests file.
    - Escape chance should be independent from these calculations. Escape should be calcualted prior. If escape is rolled than 3 keys should appear in a row during the spin and prompt win screen.
- User Experience:
    - Bug: Symbol count shows number of times icon appears not the number of 3 in-a-row wins per icon. Change behavior so that the latter implementation is used.

# Usage

54% - Gemini 3 Flash

## Part 7: Run 5 + Review

# Evaluation:

Return rates are better but not great. Distribution has to be smoothed with a higher expected return.

# Refinement Prompt:

- Game mechanics:
    - Redo spin distribution such that expected return is AT LEAST 1.4. Also smooth distribution such that rarest spin only occurs at 1/10 the rate of the most commonly occuring icon.
    - Double check expected return using tests before returning.

# Usage

57% - Gemini 3 Flash

## Part 8: Run 6 + Review

# Evaluation:

Return rates still need adjustment.

# Refinement Prompt:

- Game mechanics:
    - Redo reward distribution such that a win occurs 50% of spins. lightning win must occur at least 1% of spins. Hades 2% of spins, Skull 4% of spins. Trident 5% of spins, Wine 10% of spins, Scroll 12% of wins, Rock 15% of wins.
    - Adjust win amounts accordingly to ensure expected return of 1.4x per spin.
    - Reduce the scaling of escape percentage by a factor of 100

# Usage

65% - Gemini 3 Flash

## Part 8: Run 6 + Review

# Evaluation:

Changing game behavior to have a progress bar rather than escape chance. Also need to scale up return to 1.6x expected value. Will be changing keys to be a jackpot that causes instant escape.

# Refinement Prompt:

- Game mechanics:
    - Change escape chance to instead represent a progress bar. When this bar hits 100% victory screen is displayed with associated behavior. 
    - Add key to normal reward table appearing at a 0.1% rate that causes an instant victory.
    - Change esc% in fates rewards to Escape Progress
    - Change key in symbol counts to be one key instead of 3. Rename to Golden Key Wins
    - Change three keys next to escape chance to say Escape Progress with a ladder emoji to the left instead of 3 keys
    - Start escape progress to 0% instead of 0.5%
    - Double check expected value after key is added to normal rewards table at 1.6x return
    - Remove escape chance calcualtions as this is removed behavior.

# Usage

65% - Gemini 3 Flash

## Part 8 : Final Review

Program is overall much better implemented relative to the intitial prompt. Iterative improvements were successful although a significant number of features are broken during this process. Thankfully, fixes seem to outnumber breaks in each refinement step. Program is useable and somewhat engaging with the progress meter giving the player a reason to keep spinning. UI could be better but the inability to use elements gathered from the internet puts a hard barrier regarding how interesting the interface can be. 
