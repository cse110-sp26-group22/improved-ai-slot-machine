/**
 * Escape From the Underworld - Refined Logic v9
 * Engine: Pre-Roll Outcome System (49.1% Win Rate, 1.6x ER)
 * Victory: Cumulative Escape Progress Bar (Ladder) + 0.1% Instant Win Key
 */

// --- Constants & Configuration ---
const SYMBOLS = [
    { char: '🗝️', name: 'Golden Key', multiplier: 0, winRate: 0.001, isJackpot: true }, // 0.1% Instant Win
    { char: '⚡', name: 'Lightning', multiplier: 35, winRate: 0.01 }, // 1% (0.35)
    { char: '🔥', name: 'Hades', multiplier: 20, winRate: 0.02 },     // 2% (0.40)
    { char: '💀', name: 'Skull', multiplier: 10, winRate: 0.04 },      // 4% (0.40)
    { char: '🔱', name: 'Trident', multiplier: 5, winRate: 0.05 },     // 5% (0.25)
    { char: '🍷', name: 'Chalice', multiplier: 1, winRate: 0.10 },     // 10% (0.10)
    { char: '📜', name: 'Scroll', multiplier: 0.5, winRate: 0.12 },   // 12% (0.06)
    { char: '⛰️', name: 'Rock', multiplier: 0.3, winRate: 0.15 },     // 15% (0.045)
];

// TOTAL Gold ER = 0.35 + 0.40 + 0.40 + 0.25 + 0.10 + 0.06 + 0.045 = 1.605x

const ESCAPE_PROGRESS_MAX = 100.0;
const ESCAPE_BOOST_DIVISOR = 1000;

// --- Sound Manager ---
class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playWin() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playLoss() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playJackpot() {
        [440, 554.37, 659.25, 880].forEach((f, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.frequency.value = f;
                gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 2);
            }, i * 200);
        });
    }

    playSpin() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.1);
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
}

const audio = new SoundManager();

// --- Game State ---
let gameState = {
    gold: 500,
    bet: 10,
    spins: 0,
    totalWon: 0,
    totalLost: 0,
    escapeProgress: 0.0, // Start at 0%
    isSpinning: false,
    currentTurnBet: 10,
    symbolWins: {}
};

SYMBOLS.forEach(s => gameState.symbolWins[s.char] = 0);

// --- DOM Elements ---
const dom = {
    gold: document.getElementById('stat-gold'),
    spins: document.getElementById('stat-spins'),
    won: document.getElementById('stat-won'),
    lost: document.getElementById('stat-lost'),
    bet: document.getElementById('current-bet'),
    escapePercent: document.getElementById('escape-percent'),
    progressFill: document.getElementById('progress-fill'),
    hades: document.getElementById('hades-svg'),
    spinBtn: document.getElementById('spin-button'),
    betPlus: document.getElementById('bet-plus'),
    betMinus: document.getElementById('bet-minus'),
    betHalf: document.getElementById('bet-half'),
    betDouble: document.getElementById('bet-double'),
    reels: [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ],
    winLine: document.getElementById('win-line'),
    paytableBody: document.getElementById('paytable-body'),
    symbolStatsList: document.getElementById('symbol-stats-list'),
    victoryOverlay: document.getElementById('victory-overlay'),
    gameoverOverlay: document.getElementById('gameover-overlay'),
    vicReplay: document.getElementById('victory-replay'),
    goReplay: document.getElementById('gameover-replay'),
};

// --- Initialization ---
function init() {
    updatePaytable();
    updateSymbolStats();
    populateInitialReels();
    updateUI();
    bindEvents();
}

function bindEvents() {
    dom.spinBtn.addEventListener('click', () => {
        audio.ctx.resume();
        spin();
    });
    dom.betPlus.addEventListener('click', () => adjustBet(10));
    dom.betMinus.addEventListener('click', () => adjustBet(-10));
    dom.betHalf.addEventListener('click', () => adjustBet('half'));
    dom.betDouble.addEventListener('click', () => adjustBet('double'));
    dom.vicReplay.addEventListener('click', resetGame);
    dom.goReplay.addEventListener('click', resetGame);
}

function populateInitialReels() {
    dom.reels.forEach(reel => {
        reel.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const sym = getRandomVisualSymbol();
            reel.appendChild(createSymbolDiv(sym.char));
        }
    });
}

function createSymbolDiv(char) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = char;
    return div;
}

// --- Core Mechanics ---

function getRandomVisualSymbol() {
    const symbolsOnly = SYMBOLS.filter(s => !s.isJackpot);
    return symbolsOnly[Math.floor(Math.random() * symbolsOnly.length)];
}

function determineOutcome() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const sym of SYMBOLS) {
        cumulative += sym.winRate;
        if (rand < cumulative) return sym;
    }
    return null; // Loss
}

function adjustBet(action) {
    if (gameState.isSpinning) return;
    
    let newBet = gameState.bet;
    
    if (action === 'half') {
        newBet = Math.floor(newBet / 2);
    } else if (action === 'double') {
        newBet = newBet * 2;
    } else {
        newBet += action;
    }
    
    const minBet = Math.min(10, Math.max(1, gameState.gold));
    newBet = Math.max(minBet, Math.min(newBet, gameState.gold));
    newBet = Math.floor(newBet);
    
    gameState.bet = newBet;
    updatePaytable();
    updateUI();
}

async function spin() {
    if (gameState.isSpinning || gameState.gold <= 0) return;

    let actualBet = Math.floor(Math.min(gameState.bet, gameState.gold));
    gameState.currentTurnBet = actualBet;

    gameState.isSpinning = true;
    gameState.gold -= actualBet;
    gameState.spins++;
    gameState.totalLost += actualBet;
    updateUI();
    resetVisuals();

    // Determine Result via Pre-Roll
    const winSymbol = determineOutcome();

    let grid = [[], [], []];
    
    if (winSymbol) {
        grid[1] = [winSymbol, winSymbol, winSymbol];
    } else {
        let s1 = getRandomVisualSymbol();
        let s2 = getRandomVisualSymbol();
        let s3 = getRandomVisualSymbol();
        while (s1.char === s2.char && s2.char === s3.char) {
            s3 = getRandomVisualSymbol();
        }
        grid[1] = [s1, s2, s3];
    }

    for (let i = 0; i < 3; i++) {
        grid[0][i] = getRandomVisualSymbol();
        grid[2][i] = getRandomVisualSymbol();
    }

    await animateSpin(grid);

    evaluateGrid(grid);
    gameState.isSpinning = false;
    updateUI();
}

async function animateSpin(grid) {
    const promises = dom.reels.map((reel, i) => {
        return new Promise(resolve => {
            reel.classList.add('spinning');
            audio.playSpin();
            
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.innerHTML = '';
                reel.appendChild(createSymbolDiv(grid[0][i].char));
                reel.appendChild(createSymbolDiv(grid[1][i].char));
                reel.appendChild(createSymbolDiv(grid[2][i].char));
                resolve();
            }, 600 + (i * 300));
        });
    });
    await Promise.all(promises);
}

function evaluateGrid(grid) {
    const middleRow = grid[1];
    const isWin = middleRow[0].char === middleRow[1].char && middleRow[1].char === middleRow[2].char;
    const winSym = middleRow[0];

    if (isWin) {
        gameState.symbolWins[winSym.char]++;
        updateSymbolStats();

        if (winSym.isJackpot) {
            triggerVictory();
            return;
        }

        if (winSym.multiplier > 0) {
            const amountWon = Math.floor(gameState.currentTurnBet * winSym.multiplier);
            gameState.gold += amountWon;
            gameState.totalWon += amountWon;
            
            const boost = (gameState.currentTurnBet * winSym.multiplier) / ESCAPE_BOOST_DIVISOR;
            gameState.escapeProgress += boost;
            
            triggerWinEffect();

            // Progress Victory check
            if (gameState.escapeProgress >= ESCAPE_PROGRESS_MAX) {
                gameState.escapeProgress = ESCAPE_PROGRESS_MAX;
                triggerVictory();
                return;
            }
        }
    } else {
        triggerLossEffect();
    }

    if (gameState.gold <= 0) {
        triggerGameOver();
    }
}

function triggerWinEffect() {
    dom.winLine.classList.add('winning-line');
    dom.hades.classList.add('hades-angry');
    document.body.classList.add('win-flash');
    audio.playWin();

    setTimeout(() => {
        document.body.classList.remove('win-flash');
    }, 1200);
}

function triggerLossEffect() {
    dom.hades.classList.add('hades-happy');
    audio.playLoss();
}

function resetVisuals() {
    dom.winLine.classList.remove('winning-line');
    dom.hades.className.baseVal = '';
}

function triggerVictory() {
    audio.playJackpot();
    dom.hades.classList.add('hades-furious');
    setTimeout(() => {
        dom.victoryOverlay.classList.remove('hidden');
    }, 1500);
}

function triggerGameOver() {
    dom.gameoverOverlay.classList.remove('hidden');
}

function updateUI() {
    if (gameState.bet > gameState.gold && gameState.gold > 0) {
        gameState.bet = Math.floor(gameState.gold);
    }

    dom.gold.textContent = Math.floor(gameState.gold);
    dom.spins.textContent = gameState.spins;
    dom.won.textContent = Math.floor(gameState.totalWon);
    dom.lost.textContent = Math.floor(gameState.totalLost);
    
    dom.bet.textContent = Math.floor(gameState.bet);
    
    dom.escapePercent.textContent = gameState.escapeProgress.toFixed(3);
    dom.progressFill.style.width = (gameState.escapeProgress / ESCAPE_PROGRESS_MAX * 100) + '%';
    
    dom.spinBtn.disabled = gameState.gold <= 0 || gameState.isSpinning;
}

function updatePaytable() {
    dom.paytableBody.innerHTML = '';
    SYMBOLS.forEach(sym => {
        if (sym.isJackpot) return;
        
        const row = document.createElement('tr');
        const displayBet = Math.floor(gameState.bet);
        const win = Math.floor(displayBet * sym.multiplier);
        const boost = (displayBet * sym.multiplier) / ESCAPE_BOOST_DIVISOR;
        row.innerHTML = `
            <td><span class="sym-icon">${sym.char}</span></td>
            <td><span class="win-val">${win}</span></td>
            <td><span class="esc-val">+${boost.toFixed(5)}%</span></td>
        `;
        dom.paytableBody.appendChild(row);
    });
}

function updateSymbolStats() {
    dom.symbolStatsList.innerHTML = '';
    
    SYMBOLS.forEach(s => {
        const label = s.isJackpot ? `${s.char} ${s.name} Wins` : `${s.char} ${s.name} Wins`;
        const row = document.createElement('div');
        row.className = 'symbol-stat-row';
        row.innerHTML = `<span>${label}</span> <span>${gameState.symbolWins[s.char]}</span>`;
        dom.symbolStatsList.appendChild(row);
    });
}

function resetGame() {
    gameState = {
        gold: 500,
        bet: 10,
        spins: 0,
        totalWon: 0,
        totalLost: 0,
        escapeProgress: 0.0,
        isSpinning: false,
        currentTurnBet: 10,
        symbolWins: {}
    };
    SYMBOLS.forEach(s => gameState.symbolWins[s.char] = 0);
    
    dom.victoryOverlay.classList.add('hidden');
    dom.gameoverOverlay.classList.add('hidden');
    updateUI();
    updatePaytable();
    updateSymbolStats();
    resetVisuals();
    populateInitialReels();
}

init();
