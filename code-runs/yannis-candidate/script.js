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

/** @type {boolean} */
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance-amount');
const statusMessage = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinButton = document.getElementById('spin-button');
const betForm = document.getElementById('bet-form');

/**
 * Initializes the game.
 * @returns {void}
 */
function init() {
    spinButton.addEventListener('click', handleSpin);
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
 * Starts the reel spinning process.
 * @param {number} betAmount - The amount wagered.
 * @returns {void}
 */
function startSpin(betAmount) {
    isSpinning = true;
    spinButton.disabled = true;
    updateBalance(-betAmount);
    updateStatusDisplay('Spinning...', false);

    // Add spinning class for animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulate spin delay
    setTimeout(() => {
        stopSpin(betAmount);
    }, 1500);
}

/**
 * Stops the reels and calculates the result.
 * @param {number} betAmount - The amount wagered.
 * @returns {void}
 */
function stopSpin(betAmount) {
    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    // Update UI with results
    reels.forEach((reel, index) => {
        reel.classList.remove('spinning');
        reel.textContent = results[index].emoji;
    });

    const winAmount = calculateWin(results, betAmount);
    
    if (winAmount > 0) {
        updateBalance(winAmount);
        updateStatusDisplay(`JACKPOT! You won $${winAmount}!`, true);
    } else {
        updateStatusDisplay('Better luck next time!', false);
    }

    isSpinning = false;
    spinButton.disabled = false;
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
