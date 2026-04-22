/**
 * @typedef {Object} SymbolConfig
 * @property {string} name - The name of the symbol.
 * @property {string} emoji - The visual representation.
 * @property {number} weight - The probability weight.
 * @property {number} multiplier - The payout multiplier for a 3-of-a-kind match.
 */

const GAME_CONFIG = {
    INITIAL_BALANCE: 100,
    MAX_BET: 10,
    NEAR_MISS_PROBABILITY: 0.3,
    BASE_SPIN_DELAY_MS: 1000,
    STAGGER_DELAY_MS: 300,
    WIN_STREAK_SPECIAL_THRESHOLD: 3,
    JACKPOT_SYMBOL_NAME: 'Seven'
};

/** @type {SymbolConfig[]} */
const SYMBOLS = [
    { name: 'Cherry', emoji: '🍒', weight: 45, multiplier: 5 },
    { name: 'Lemon', emoji: '🍋', weight: 30, multiplier: 10 },
    { name: 'Orange', emoji: '🍊', weight: 15, multiplier: 30 },
    { name: 'Bar', emoji: '🍫', weight: 8, multiplier: 100 },
    { name: 'Seven', emoji: '7️⃣', weight: 2, multiplier: 5000 }
];

/** @type {number} */
let balance = GAME_CONFIG.INITIAL_BALANCE;

/** @type {number} */
let winStreak = 0;

/** @type {boolean} */
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance-amount');
const streakDisplay = document.getElementById('win-streak');
const statusMessage = document.getElementById('status-message');
const ariaAnnouncer = document.getElementById('aria-announcer');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinButton = document.getElementById('spin-button');
const maxBetButton = document.getElementById('max-bet-button');
const resetButton = document.getElementById('reset-button');
const betForm = document.getElementById('bet-form');

/**
 * Initializes the game by setting up event listeners and UI.
 * @returns {void}
 */
function init() {
    spinButton.addEventListener('click', handleSpin);
    maxBetButton.addEventListener('click', handleMaxBet);
    resetButton.addEventListener('click', resetGame);
    updateUI();
}

/**
 * Automatically selects the maximum bet and triggers a spin.
 * @returns {void}
 */
function handleMaxBet() {
    if (isSpinning) return;
    
    const maxBetInput = betForm.querySelector(`input[value="${GAME_CONFIG.MAX_BET}"]`);
    if (maxBetInput) {
        maxBetInput.checked = true;
    }
    handleSpin();
}

/**
 * Handles the spin button click event with validation.
 * @returns {void}
 */
function handleSpin() {
    if (isSpinning) return;

    const betAmount = getSelectedBet();

    if (isNaN(betAmount) || betAmount <= 0) {
        const msg = 'Invalid bet amount!';
        updateStatusDisplay(msg, false);
        announceToScreenReader(msg);
        return;
    }

    if (balance < betAmount) {
        const msg = 'Insufficient funds!';
        updateStatusDisplay(msg, false);
        announceToScreenReader(msg);
        return;
    }

    startSpin(betAmount);
}

/**
 * Gets the currently selected bet amount from the radio buttons.
 * @returns {number} The bet amount, or NaN if invalid.
 */
function getSelectedBet() {
    const formData = new FormData(betForm);
    const value = formData.get('bet');
    return value ? parseInt(value, 10) : NaN;
}

/**
 * Starts the reel spinning process with staggered stops and near-miss logic.
 * @param {number} betAmount - The validated amount wagered.
 * @returns {void}
 */
function startSpin(betAmount) {
    isSpinning = true;
    toggleControls(true);
    updateBalance(-betAmount);
    
    const status = 'Good luck...';
    updateStatusDisplay(status, false);
    announceToScreenReader('Spinning the reels...');

    reels.forEach((reel, index) => {
        reel.classList.remove('win-glow');
        reel.classList.add('spinning');
        reel.setAttribute('aria-label', `Reel ${index + 1} spinning`);
    });

    const results = generateResults(betAmount);

    reels.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.remove('spinning');
            reel.textContent = results[index].emoji;
            reel.setAttribute('aria-label', `Reel ${index + 1}: ${results[index].name}`);
            
            const isLastReel = index === reels.length - 1;
            if (isLastReel) {
                finalizeSpin(results, betAmount);
            }
        }, GAME_CONFIG.BASE_SPIN_DELAY_MS + (index * GAME_CONFIG.STAGGER_DELAY_MS));
    });
}

/**
 * Generates the outcome of a spin, applying near-miss logic if applicable.
 * @param {number} betAmount - The amount wagered.
 * @returns {SymbolConfig[]} The array of resulting symbols.
 */
function generateResults(betAmount) {
    let results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const winAmount = calculateWin(results, betAmount);

    const shouldTriggerNearMiss = winAmount === 0 && Math.random() < GAME_CONFIG.NEAR_MISS_PROBABILITY;
    if (shouldTriggerNearMiss) {
        const jackpotSymbol = SYMBOLS.find(s => s.name === GAME_CONFIG.JACKPOT_SYMBOL_NAME);
        const otherSymbols = SYMBOLS.filter(s => s.name !== GAME_CONFIG.JACKPOT_SYMBOL_NAME);
        
        // Randomly choose 2 reels to show the jackpot symbol
        const jackpotIndices = [0, 1, 2].sort(() => 0.5 - Math.random()).slice(0, 2);
        
        results = results.map((res, i) => 
            jackpotIndices.includes(i) 
                ? jackpotSymbol 
                : otherSymbols[Math.floor(Math.random() * otherSymbols.length)]
        );
    }
    return results;
}

/**
 * Finalizes the spin result, updates balance, and checks for game over.
 * @param {SymbolConfig[]} results - The final reel symbols.
 * @param {number} betAmount - The amount wagered.
 * @returns {void}
 */
function finalizeSpin(results, betAmount) {
    const winAmount = calculateWin(results, betAmount);
    
    if (winAmount > 0) {
        handleWin(winAmount);
    } else {
        handleLoss();
    }

    isSpinning = false;
    toggleControls(false);
    updateUI();

    checkGameOver();
}

/**
 * Handles the logic when the player wins.
 * @param {number} winAmount - The amount won.
 * @returns {void}
 */
function handleWin(winAmount) {
    winStreak++;
    updateBalance(winAmount);
    
    let message = `JACKPOT! You won $${winAmount}!`;
    if (winStreak >= GAME_CONFIG.WIN_STREAK_SPECIAL_THRESHOLD) {
        message = `🔥 ${winStreak} WINS IN A ROW! 🔥 $${winAmount} WON!`;
    }
    updateStatusDisplay(message, true);
    announceToScreenReader(message);
    reels.forEach(reel => reel.classList.add('win-glow'));
}

/**
 * Handles the logic when the player loses.
 * @returns {void}
 */
function handleLoss() {
    winStreak = 0;
    const msg = 'Better luck next time!';
    updateStatusDisplay(msg, false);
    announceToScreenReader(msg);
}

/**
 * Checks if the player is out of funds and updates UI accordingly.
 * @returns {void}
 */
function checkGameOver() {
    if (balance <= 0) {
        const msg = "You're out of money!";
        updateStatusDisplay(msg, false);
        announceToScreenReader(msg + " Click reset to play again.");
        spinButton.classList.add('hidden');
        maxBetButton.classList.add('hidden');
        resetButton.classList.remove('hidden');
    }
}

/**
 * Toggles the interactivity of game controls.
 * @param {boolean} disabled - Whether to disable the controls.
 * @returns {void}
 */
function toggleControls(disabled) {
    spinButton.disabled = disabled;
    maxBetButton.disabled = disabled;
    const radioButtons = betForm.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => radio.disabled = disabled);
}

/**
 * Resets the game to its initial state.
 * @returns {void}
 */
function resetGame() {
    balance = GAME_CONFIG.INITIAL_BALANCE;
    winStreak = 0;
    updateUI();
    const msg = 'Good luck!';
    updateStatusDisplay(msg, false);
    announceToScreenReader('Game reset. ' + msg);
    
    reels.forEach((reel, index) => {
        reel.textContent = '?';
        reel.classList.remove('win-glow');
        reel.setAttribute('aria-label', `Reel ${index + 1} ready`);
    });

    spinButton.classList.remove('hidden');
    maxBetButton.classList.remove('hidden');
    resetButton.classList.add('hidden');
    toggleControls(false);
}

/**
 * Announces a message to screen readers using the aria-live region.
 * @param {string} message - The message to announce.
 * @returns {void}
 */
function announceToScreenReader(message) {
    if (ariaAnnouncer) {
        ariaAnnouncer.textContent = '';
        // Small timeout to ensure the change is detected if the message is the same
        setTimeout(() => {
            ariaAnnouncer.textContent = message;
        }, 50);
    }
}


/**
 * Selects a symbol based on weighted probability.
 * @returns {SymbolConfig} The selected symbol configuration.
 */
function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (const symbol of SYMBOLS) {
        if (randomNum < symbol.weight) return symbol;
        randomNum -= symbol.weight;
    }
    return SYMBOLS[0];
}

/**
 * Calculates the winning amount based on the results and bet.
 * @param {SymbolConfig[]} results - The symbols showing on the reels.
 * @param {number} betAmount - The amount wagered.
 * @returns {number} The total win amount.
 */
function calculateWin(results, betAmount) {
    const firstSymbolName = results[0].name;
    const isMatch = results.every(s => s.name === firstSymbolName);
    return isMatch ? betAmount * results[0].multiplier : 0;
}

/**
 * Updates the game balance with validation.
 * @param {number} amount - The amount to add or subtract.
 * @returns {void}
 */
function updateBalance(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return;
    balance += amount;
    // Ensure balance doesn't stay as NaN if something went wrong
    if (isNaN(balance)) balance = 0;
    updateUI();
}

/**
 * Refreshes the balance and streak displays in the DOM.
 * @returns {void}
 */
function updateUI() {
    balanceDisplay.textContent = `$${balance}`;
    streakDisplay.textContent = winStreak;
}

/**
 * Updates the status message display.
 * @param {string} message - The message to show.
 * @param {boolean} isWin - Whether the outcome was a win.
 * @returns {void}
 */
function updateStatusDisplay(message, isWin) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + (isWin ? 'status-win' : 'status-loss');
}

// Initialize the game on load
document.addEventListener('DOMContentLoaded', init);

