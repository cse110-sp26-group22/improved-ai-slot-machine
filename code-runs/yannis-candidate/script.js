/**
 * @typedef {Object} SymbolConfig
 * @property {string} name - The name of the symbol.
 * @property {string} emoji - The visual representation.
 * @property {number} weight - The probability weight.
 * @property {number} multiplier - The payout multiplier for a 3-of-a-kind match.
 */

/** @type {SymbolConfig[]} */
const SYMBOLS = [
    { name: 'Cherry', emoji: '🍒', weight: 45, multiplier: 5 },
    { name: 'Lemon', emoji: '🍋', weight: 30, multiplier: 10 },
    { name: 'Orange', emoji: '🍊', weight: 15, multiplier: 30 },
    { name: 'Bar', emoji: '🍫', weight: 8, multiplier: 100 },
    { name: 'Seven', emoji: '7️⃣', weight: 2, multiplier: 5000 }
];

/** @type {number} */
let balance = 100;

/** @type {number} */
let winStreak = 0;

/** @type {boolean} */
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance-amount');
const streakDisplay = document.getElementById('win-streak');
const statusMessage = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinButton = document.getElementById('spin-button');
const resetButton = document.getElementById('reset-button');
const betForm = document.getElementById('bet-form');

/**
 * Initializes the game.
 * @returns {void}
 */
function init() {
    spinButton.addEventListener('click', handleSpin);
    resetButton.addEventListener('click', resetGame);
    updateBalanceDisplay();
}

/**
 * Handles the spin button click event.
 * @returns {void}
 */
function handleSpin() {
    if (isSpinning) return;

    const betAmount = getSelectedBet();

    if (balance < betAmount) {
        updateStatusDisplay('Insufficient funds!', false);
        return;
    }

    startSpin(betAmount);
}

/**
 * Gets the currently selected bet amount from the radio buttons.
 * @returns {number} The bet amount ($1, $5, or $10).
 */
function getSelectedBet() {
    const formData = new FormData(betForm);
    return parseInt(formData.get('bet'), 10);
}

/**
 * Starts the reel spinning process with staggered stops and near-miss logic.
 * @param {number} betAmount - The amount wagered.
 * @returns {void}
 */
function startSpin(betAmount) {
    isSpinning = true;
    spinButton.disabled = true;
    updateBalance(-betAmount);
    updateStatusDisplay('Good luck...', false);

    // Clear previous win effects
    reels.forEach(reel => {
        reel.classList.remove('win-glow');
        reel.classList.add('spinning');
    });

    // Determine results immediately (pre-calculation for near-miss)
    let results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    const actualWin = calculateWin(results, betAmount);

    // Near-miss mechanic (30% chance on losses)
    if (actualWin === 0 && Math.random() < 0.3) {
        const jackpotSymbol = SYMBOLS.find(s => s.name === 'Seven');
        const otherSymbols = SYMBOLS.filter(s => s.name !== 'Seven');
        
        // Pick 2 reels for jackpot symbol, 1 for something else
        const jackpotIndices = [0, 1, 2].sort(() => 0.5 - Math.random()).slice(0, 2);
        
        results = results.map((res, i) => {
            if (jackpotIndices.includes(i)) {
                return jackpotSymbol;
            } else {
                // Ensure the third reel is NOT a Seven
                return otherSymbols[Math.floor(Math.random() * otherSymbols.length)];
            }
        });
    }

    // Staggered reel stops
    reels.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.remove('spinning');
            reel.textContent = results[index].emoji;
            
            // If it's the last reel, finalize the result
            if (index === reels.length - 1) {
                finalizeSpin(results, betAmount);
            }
        }, 1000 + (index * 300)); // 1000ms, 1300ms, 1600ms
    });
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
        winStreak++;
        updateBalance(winAmount);
        
        let message = `JACKPOT! You won $${winAmount}!`;
        if (winStreak >= 3) {
            message = `🔥 ${winStreak} WINS IN A ROW! 🔥 $${winAmount} WON!`;
        }
        updateStatusDisplay(message, true);
        reels.forEach(reel => reel.classList.add('win-glow'));
    } else {
        winStreak = 0;
        updateStatusDisplay('Better luck next time!', false);
    }

    updateStreakDisplay();
    isSpinning = false;
    spinButton.disabled = false;

    // Check for game over
    if (balance <= 0) {
        updateStatusDisplay("You're out of money!", false);
        spinButton.classList.add('hidden');
        resetButton.classList.remove('hidden');
    }
}

/**
 * Resets the game state.
 * @returns {void}
 */
function resetGame() {
    balance = 100;
    winStreak = 0;
    updateBalanceDisplay();
    updateStreakDisplay();
    updateStatusDisplay('Good luck!', false);
    
    reels.forEach(reel => {
        reel.textContent = '?';
        reel.classList.remove('win-glow');
    });

    spinButton.classList.remove('hidden');
    resetButton.classList.add('hidden');
    spinButton.disabled = false;
}

/**
 * Updates the win streak display in the DOM.
 * @returns {void}
 */
function updateStreakDisplay() {
    streakDisplay.textContent = winStreak;
}

/**
 * Selects a symbol based on weighted probability.
 * @returns {SymbolConfig} The selected symbol configuration.
 */
function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (const symbol of SYMBOLS) {
        if (randomNum < symbol.weight) {
            return symbol;
        }
        randomNum -= symbol.weight;
    }

    return SYMBOLS[0]; // Fallback
}

/**
 * Calculates the winning amount based on the results and bet.
 * @param {SymbolConfig[]} results - The symbols showing on the reels.
 * @param {number} betAmount - The amount wagered.
 * @returns {number} The total win amount.
 */
function calculateWin(results, betAmount) {
    const firstSymbol = results[0].name;
    const isMatch = results.every(s => s.name === firstSymbol);

    if (isMatch) {
        return betAmount * results[0].multiplier;
    }

    return 0;
}

/**
 * Updates the game balance.
 * @param {number} amount - The amount to add or subtract.
 * @returns {void}
 */
function updateBalance(amount) {
    balance += amount;
    updateBalanceDisplay();
}

/**
 * Updates the balance display in the DOM.
 * @returns {void}
 */
function updateBalanceDisplay() {
    balanceDisplay.textContent = `$${balance}`;
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
