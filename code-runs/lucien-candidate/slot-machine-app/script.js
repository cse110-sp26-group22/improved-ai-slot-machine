// Game Configuration
const SYMBOLS = [
    { name: 'CHERRY', icon: '🍒', weight: 45, payout: 80 },
    { name: 'LEMON', icon: '🍋', weight: 35, payout: 150 },
    { name: 'ORANGE', icon: '🍊', weight: 25, payout: 250 },
    { name: 'PLUM', icon: '🍇', weight: 15, payout: 500 },
    { name: 'BAR', icon: '➖', weight: 8, payout: 1500 },
    { name: 'SEVEN', icon: '7️⃣', weight: 4, payout: 3500 },
    { name: 'JACKPOT', icon: '💎', weight: 1, payout: 15000 }
];

const BET_VALUES = [25, 50, 75, 100, 200, 500, 1000, 2000];
const SPIN_DURATION = 1500; // ms

// Game State
let balance = 1000; // 1000 credits = $10.00
let currentBetIndex = 0;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance-display');
const betDisplay = document.getElementById('bet-display');
const winMessage = document.getElementById('win-message');
const spinButton = document.getElementById('spin-button');
const decreaseBetBtn = document.getElementById('decrease-bet');
const increaseBetBtn = document.getElementById('increase-bet');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize
function init() {
    updateUI();
    setupReels();
}

function updateUI() {
    const dollars = (balance / 100).toFixed(2);
    balanceDisplay.textContent = `$${dollars}`;
    betDisplay.textContent = BET_VALUES[currentBetIndex];
    
    // Disable buttons if spinning or insufficient balance
    const currentBet = BET_VALUES[currentBetIndex];
    spinButton.disabled = isSpinning || balance < currentBet;
    decreaseBetBtn.disabled = isSpinning || currentBetIndex === 0;
    increaseBetBtn.disabled = isSpinning || currentBetIndex === BET_VALUES.length - 1;
}

function setupReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Add 5 random symbols initially
        for (let i = 0; i < 5; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            strip.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

async function spin() {
    if (isSpinning || balance < BET_VALUES[currentBetIndex]) return;

    // Deduct bet
    const currentBet = BET_VALUES[currentBetIndex];
    balance -= currentBet;
    isSpinning = true;
    updateUI();
    
    winMessage.textContent = 'SPINNING...';
    winMessage.classList.remove('big-win');
    
    // Play spin sound
    if (typeof playSpinSound === 'function') playSpinSound();

    // Determine outcomes
    const outcomes = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Debug Logging
    console.log('--- SPIN RESULTS ---');
    console.log('Reels:', outcomes.map(o => o.icon).join(' | '));
    console.log('Bet:', currentBet);

    // Start animation
    reelStrips.forEach((strip, i) => {
        strip.classList.add('spinning');
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, SPIN_DURATION));

    // Stop animation and show results
    reelStrips.forEach((strip, i) => {
        strip.classList.remove('spinning');
        // Update the visible symbol (index 0 because translateY resets to 0)
        strip.children[0].textContent = outcomes[i].icon;
        
        // Also update other symbols in the strip to make it look consistent
        for (let j = 1; j < strip.children.length; j++) {
            strip.children[j].textContent = getRandomSymbol().icon;
        }
    });

    const winAmount = calculateWin(outcomes, currentBet);
    console.log('Calculation:', outcomes.map(o => o.name).join(' + '));
    console.log('Win Amount:', winAmount);
    console.log('New Balance:', balance + winAmount);
    console.log('--------------------');
    
    if (winAmount > 0) {
        balance += winAmount;
        displayWin(winAmount);
        if (typeof playWinSound === 'function') playWinSound(winAmount >= currentBet * 5);
        
        // Highlight reels
        reelStrips.forEach(strip => strip.parentElement.classList.add('win-highlight'));
        setTimeout(() => {
            reelStrips.forEach(strip => strip.parentElement.classList.remove('win-highlight'));
        }, 1500);
    } else {
        winMessage.textContent = 'TRY AGAIN!';
    }

    isSpinning = false;
    updateUI();
}

function calculateWin(outcomes, bet) {
    const scale = bet / 25;
    let win = 0;

    // 1. Check for 3 of a kind (Highest Priority)
    if (outcomes[0].name === outcomes[1].name && outcomes[1].name === outcomes[2].name) {
        win = outcomes[0].payout * scale;
        console.log(`Debug: 3x ${outcomes[0].name} detected!`);
    } 
    // 2. Check for 2 of a kind (First two)
    else if (outcomes[0].name === outcomes[1].name) {
        win = Math.floor(outcomes[0].payout * 0.4 * scale);
        console.log(`Debug: 2x ${outcomes[0].name} detected!`);
    }
    
    // 3. Special Case: Cherry (Anywhere)
    // We add this to any other win or as a standalone
    const cherryCount = outcomes.filter(o => o.name === 'CHERRY').length;
    if (cherryCount > 0 && outcomes[0].name !== 'CHERRY') { // Don't double count if 3x or 2x Cherry
        const cherryWin = cherryCount * 2 * scale;
        win += cherryWin;
        console.log(`Debug: ${cherryCount}x Cherry bonus!`);
    }

    return Math.floor(win);
}

function displayWin(amount) {
    const dollars = (amount / 100).toFixed(2);
    winMessage.textContent = `WIN: $${dollars}!`;
    if (amount >= BET_VALUES[currentBetIndex] * 5) {
        winMessage.classList.add('big-win');
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);

decreaseBetBtn.addEventListener('click', () => {
    if (currentBetIndex > 0) {
        currentBetIndex--;
        updateUI();
        if (typeof playClickSound === 'function') playClickSound();
    }
});

increaseBetBtn.addEventListener('click', () => {
    if (currentBetIndex < BET_VALUES.length - 1) {
        currentBetIndex++;
        updateUI();
        if (typeof playClickSound === 'function') playClickSound();
    }
});

// Initialize on load
init();
