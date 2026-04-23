import {
    SYMBOLS,
    PAYTABLE,
    REEL_CONFIG,
    INITIAL_STATE,
    BET_OPTIONS
} from './constants.js';
import * as audio from './audio.js';

let isAudioInitialized = false;

const gameState = {
    balance: INITIAL_STATE.balance,
    currentBet: INITIAL_STATE.currentBet,
    lastWin: 0,
    isSpinning: false,
    isMuted: false,
};

// DOM Elements
const balanceDisplay = document.getElementById('balance-display');
const winDisplay = document.getElementById('win-display');
const betDisplay = document.getElementById('bet-display');
const spinButton = document.getElementById('spin-button');
const betOptions = document.querySelectorAll('.bet-option');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
];
const emergencyDepositButton = document.getElementById('emergency-deposit-button');
const muteButton = document.getElementById('mute-button');
const splashContainer = document.getElementById('splash-container');
const bigWinSplash = document.getElementById('big-win-splash');
const jackpotSplash = document.getElementById('jackpot-splash');
const doubleDownPopup = document.getElementById('double-down-popup');
const doubleDownYes = document.getElementById('double-down-yes');
const doubleDownNo = document.getElementById('double-down-no');
const doubleDownTimer = document.getElementById('double-down-timer');


function createReel(reelEl, reelConfig) {
    reelEl.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 3; i++) {
        const symbolEl = document.createElement('div');
        symbolEl.classList.add('symbol');
        const randomSymbol = reelConfig[getSecureRandom(reelConfig.length)];
        symbolEl.textContent = SYMBOLS[randomSymbol];
        symbolEl.setAttribute('data-symbol', randomSymbol);
        fragment.appendChild(symbolEl);
    }
    reelEl.appendChild(fragment);
}


function init() {
    reelElements.forEach((reelEl, i) => {
        createReel(reelEl, REEL_CONFIG[i]);
    });
    updateUI();
    setupEventListeners();
}

function setupEventListeners() {
    spinButton.addEventListener('click', spin);
    betOptions.forEach(button => {
        button.addEventListener('click', () => handleBetChange(parseInt(button.dataset.bet)));
    });
    emergencyDepositButton.addEventListener('click', () => {
        if (!isAudioInitialized) {
            audio.initAudio();
            isAudioInitialized = true;
        }
        gameState.balance += 500;
        emergencyDepositButton.classList.add('hidden');
        updateUI();
    });
    muteButton.addEventListener('click', () => {
        if (!isAudioInitialized) {
            audio.initAudio();
            isAudioInitialized = true;
        }
        gameState.isMuted = !gameState.isMuted;
        muteButton.classList.toggle('muted', gameState.isMuted);
        muteButton.textContent = gameState.isMuted ? 'Unmute' : 'Mute';
        audio.toggleMute(gameState.isMuted);
    });
}

function handleBetChange(newBet) {
    if (gameState.isSpinning) return;
    if (!isAudioInitialized) {
        audio.initAudio();
        isAudioInitialized = true;
    }
    gameState.currentBet = newBet;
    updateUI();
}

function handleDoubleDown() {
    return new Promise(resolve => {
        doubleDownPopup.classList.remove('hidden');
        let timeLeft = 3;
        doubleDownTimer.textContent = timeLeft;

        let countdown;

        const cleanup = (didDouble) => {
            clearInterval(countdown);
            doubleDownPopup.classList.add('hidden');
            doubleDownYes.removeEventListener('click', yesListener);
            doubleDownNo.removeEventListener('click', noListener);
            resolve(didDouble);
        };

        const yesListener = () => cleanup(true);
        const noListener = () => cleanup(false);

        doubleDownYes.addEventListener('click', yesListener);
        doubleDownNo.addEventListener('click', noListener);

        countdown = setInterval(() => {
            timeLeft--;
            doubleDownTimer.textContent = timeLeft;
            if (timeLeft <= 0) {
                cleanup(false);
            }
        }, 1000);
    });
}

async function spin() {
    if (gameState.isSpinning || gameState.balance < gameState.currentBet) return;
    if (!isAudioInitialized) {
        audio.initAudio();
        isAudioInitialized = true;
    }

    gameState.isSpinning = true;
    const originalBet = gameState.currentBet;
    gameState.balance -= gameState.currentBet;
    gameState.lastWin = 0;
    clearWinEffects();
    updateUI();
    audio.playSound('spin');

    const finalResult = generateSpinResult();
    const flickerIntervals = [];

    reelElements.forEach((reelEl, i) => {
        reelEl.classList.add('flicker');
        flickerIntervals[i] = setInterval(() => {
            const symbols = reelEl.children;
            for (const symbolEl of symbols) {
                const randomSymbol = REEL_CONFIG[i][getSecureRandom(REEL_CONFIG[i].length)];
                symbolEl.textContent = SYMBOLS[randomSymbol];
            }
        }, 80);
    });

    // Reel 1
    await new Promise(resolve => setTimeout(resolve, 600));
    clearInterval(flickerIntervals[0]);
    reelElements[0].classList.remove('flicker');
    setFinalReelPosition(reelElements[0], finalResult[0], REEL_CONFIG[0]);
    audio.playSound('reel-stop');

    // Reel 2
    await new Promise(resolve => setTimeout(resolve, 300));
    clearInterval(flickerIntervals[1]);
    reelElements[1].classList.remove('flicker');
    setFinalReelPosition(reelElements[1], finalResult[1], REEL_CONFIG[1]);
    audio.playSound('reel-stop');
    
    // Double Down Logic
    let didDoubleDown = false;
    if (finalResult[0] === finalResult[1] && gameState.balance >= gameState.currentBet) {
        didDoubleDown = await handleDoubleDown();
        if (didDoubleDown) {
            gameState.balance -= gameState.currentBet;
            gameState.currentBet *= 2;
            updateUI();
        }
    }

    // Reel 3
    await new Promise(resolve => setTimeout(resolve, 300));
    clearInterval(flickerIntervals[2]);
    reelElements[2].classList.remove('flicker');
    setFinalReelPosition(reelElements[2], finalResult[2], REEL_CONFIG[2]);
    audio.playSound('reel-stop');


    const { payout, winningSymbol } = calculatePayout(finalResult);
    if (payout > 0) {
        gameState.lastWin = payout * gameState.currentBet;
        gameState.balance += gameState.lastWin;
        handleWinEffects(payout, finalResult, winningSymbol);
    }

    if (didDoubleDown) {
        gameState.currentBet = originalBet;
    }
    
    gameState.isSpinning = false;
    if (gameState.balance === 0) {
        emergencyDepositButton.classList.remove('hidden');
    }
    updateUI();
}

function setFinalReelPosition(reelEl, resultSymbol, reelConfig) {
    const symbolElements = reelEl.children;
    const resultIndex = reelConfig.indexOf(resultSymbol);
    
    const topIndex = (resultIndex - 1 + reelConfig.length) % reelConfig.length;
    const bottomIndex = (resultIndex + 1) % reelConfig.length;

    const topSymbol = reelConfig[topIndex];
    const middleSymbol = resultSymbol;
    const bottomSymbol = reelConfig[bottomIndex];

    symbolElements[0].textContent = SYMBOLS[topSymbol];
    symbolElements[0].setAttribute('data-symbol', topSymbol);
    symbolElements[1].textContent = SYMBOLS[middleSymbol];
    symbolElements[1].setAttribute('data-symbol', middleSymbol);
    symbolElements[2].textContent = SYMBOLS[bottomSymbol];
    symbolElements[2].setAttribute('data-symbol', bottomSymbol);
}

function generateSpinResult() {
    return REEL_CONFIG.map(reelSymbols => {
        const randomIndex = getSecureRandom(reelSymbols.length);
        return reelSymbols[randomIndex];
    });
}

function getSecureRandom(max) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

function calculatePayout(symbols) {
    const [s1, s2, s3] = symbols;
    if (s1 === s2 && s2 === s3) {
        return { payout: PAYTABLE[s1] || 0, winningSymbol: s1 };
    }
    const counts = {};
    symbols.forEach(s => counts[s] = (counts[s] || 0) + 1);
    for (const symbol in counts) {
        if (counts[symbol] === 2) {
            return { payout: PAYTABLE.ANY_TWO, winningSymbol: symbol };
        }
    }
    return { payout: 0, winningSymbol: null };
}

function handleWinEffects(payout, resultSymbols, winningSymbol) {
    reelElements.forEach((reelEl, i) => {
        const middleSymbol = reelEl.children[1];
        if (middleSymbol.getAttribute('data-symbol') === winningSymbol) {
             middleSymbol.classList.add('winning-symbol');
        }
    });

    if (payout >= 10) {
        splashContainer.classList.remove('hidden');
        bigWinSplash.classList.remove('hidden');
        audio.playSound('big-win');
        if (resultSymbols.every(s => s === 'PIRATE_CAPTAIN')) {
            jackpotSplash.classList.remove('hidden');
            bigWinSplash.classList.add('hidden');
            audio.playSound('jackpot');
        }
    } else if (payout > 0) {
        audio.playSound('small-win');
    }
}

function clearWinEffects() {
    splashContainer.classList.add('hidden');
    bigWinSplash.classList.add('hidden');
    jackpotSplash.classList.add('hidden');
    document.querySelectorAll('.winning-symbol').forEach(el => el.classList.remove('winning-symbol'));
}

function updateUI() {
    balanceDisplay.textContent = `$${gameState.balance}`;
    winDisplay.textContent = `$${gameState.lastWin}`;
    betDisplay.textContent = `$${gameState.currentBet}`;
    spinButton.disabled = gameState.isSpinning || gameState.balance < gameState.currentBet;
    betOptions.forEach(button => {
        button.classList.toggle('active', parseInt(button.dataset.bet) === gameState.currentBet);
        button.disabled = gameState.isSpinning;
    });
}

document.addEventListener('DOMContentLoaded', init);
