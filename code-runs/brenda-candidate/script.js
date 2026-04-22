
// 1. GAME LOGIC

let state = {
    balance: 1000,
    allowedBets: [25, 50, 75, 100, 200, 500, 1000, 2000],
    currentBetIndex: 0,
    isSpinning: false,
    symbols: ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣']
};

function calculatePayout(reelsResult, betAmount) {
    if (reelsResult[0] === reelsResult[1] && reelsResult[1] === reelsResult[2]) {
        return betAmount * 10;
    }
    return 0;
}

function canAffordBet(balance, betAmount) {
    return balance >= betAmount;
}

function generateReelsResult() {
    return [
        state.symbols[Math.floor(Math.random() * state.symbols.length)],
        state.symbols[Math.floor(Math.random() * state.symbols.length)],
        state.symbols[Math.floor(Math.random() * state.symbols.length)]
    ];
}

// ==========================================
// 2. UI LOGIC
// ==========================================
const machineEl = document.getElementById('machine');
const balanceEl = document.getElementById('balance');
const betEl = document.getElementById('bet');
const messageEl = document.getElementById('message');

const reelEls = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

const buttons = {
    decrease: document.getElementById('btn-decrease-bet'),
    increase: document.getElementById('btn-increase-bet'),
    spin: document.getElementById('btn-spin')
};

updateDisplay();

buttons.increase.addEventListener('click', () => changeBet(1));
buttons.decrease.addEventListener('click', () => changeBet(-1));
buttons.spin.addEventListener('click', handleSpin);

function updateDisplay() {
    balanceEl.textContent = state.balance;
    const currentBet = state.allowedBets[state.currentBetIndex];
    betEl.textContent = currentBet;

    buttons.decrease.disabled = (state.currentBetIndex === 0) || state.isSpinning;
    buttons.increase.disabled = (state.currentBetIndex === state.allowedBets.length - 1) || state.isSpinning;
    buttons.spin.disabled = state.isSpinning || !canAffordBet(state.balance, currentBet);
}

function resetMessage(text, color = '#e74c3c') {
    machineEl.classList.remove('win-flash');
    messageEl.textContent = text;
    messageEl.style.color = color;
    messageEl.style.textShadow = `0 0 5px ${color}`;
}

function changeBet(direction) {
    if (state.isSpinning) return;

    const newIndex = state.currentBetIndex + direction;
    if (newIndex >= 0 && newIndex < state.allowedBets.length) {
        state.currentBetIndex = newIndex;
        resetMessage("Bet Updated!");
        updateDisplay();
    }
}

function handleSpin() {
    const currentBet = state.allowedBets[state.currentBetIndex];

    if (!canAffordBet(state.balance, currentBet)) {
        resetMessage("sorry, Insufficient balance!");
        return;
    }

    state.isSpinning = true;
    state.balance -= currentBet;
    resetMessage("SPINNING...");
    updateDisplay();

    const spinInterval = setInterval(() => {
        reelEls.forEach(reel => {
            reel.textContent = state.symbols[Math.floor(Math.random() * state.symbols.length)];
        });
    }, 100);

    setTimeout(() => {
        clearInterval(spinInterval);

        const finalResult = generateReelsResult();
        reelEls.forEach((reel, index) => {
            reel.textContent = finalResult[index];
        });

        const winnings = calculatePayout(finalResult, currentBet);

        if (winnings > 0) {
            state.balance += winnings;
            resetMessage(`WIN ${winnings}¢!`, '#f1c40f');
            machineEl.classList.add('win-flash');
        } else {
            resetMessage(`No win this spin. You lost ${currentBet}¢.`);
        }

        state.isSpinning = false;
        updateDisplay();
    }, 1500);
}