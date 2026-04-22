import { SYMBOLS } from './game-logic.js';

export class UI {
    constructor(state) {
        this.state = state;
        this.cacheDOM();
        this.initReels();
    }

    cacheDOM() {
        this.balanceDisplay = document.getElementById('balance-display');
        this.totalWonDisplay = document.getElementById('total-won-display');
        this.currentBetDisplay = document.getElementById('current-bet-display');
        this.spinButton = document.getElementById('spin-button');
        this.betIncrease = document.getElementById('bet-increase');
        this.betDecrease = document.getElementById('bet-decrease');
        this.muteToggle = document.getElementById('mute-toggle');
        this.reels = document.querySelectorAll('.reel-symbols');
        this.errorToast = document.getElementById('error-message');
        this.winOverlay = document.getElementById('win-overlay');
        this.winMessage = document.getElementById('win-message');
        this.winAmountDisplay = document.getElementById('win-amount');
    }

    initReels() {
        this.reels.forEach((reel, i) => {
            this.setReelSymbols(i, this.getRandomSymbolChars(10));
        });
    }

    getRandomSymbolChars(count) {
        const chars = SYMBOLS.map(s => s.char);
        return Array.from({ length: count }, () => chars[Math.floor(Math.random() * chars.length)]);
    }

    setReelSymbols(reelIndex, chars) {
        const container = this.reels[reelIndex];
        container.innerHTML = chars.map(char => `<div class="symbol">${char}</div>`).join('');
    }

    updateStats() {
        this.balanceDisplay.textContent = this.state.balance.toLocaleString();
        this.totalWonDisplay.textContent = this.state.totalWon.toLocaleString();
        this.currentBetDisplay.textContent = this.state.currentBet.toLocaleString();
    }

    showError(msg) {
        this.errorToast.textContent = msg;
        this.errorToast.classList.remove('hidden');
        setTimeout(() => this.errorToast.classList.add('hidden'), 3000);
    }

    async animateSpin(results) {
        const baseDuration = 1200; // Base time for the first reel
        const reelContainers = document.querySelectorAll('.reel');
        const symbolHeight = 100; // Updated to match CSS
        
        this.spinButton.disabled = true;
        this.winOverlay.classList.add('hidden');

        const promises = Array.from(reelContainers).map((reel, i) => {
            return new Promise(resolve => {
                const symbolList = reel.querySelector('.reel-symbols');
                const finalThree = results.reels[i].map(id => SYMBOLS.find(s => s.id === id).char);
                
                const currentSymbols = Array.from(symbolList.children).map(s => s.textContent);
                
                // Use a slightly smaller filler to fit the shorter duration while maintaining speed
                const fillerCount = 20 + (i * 5);
                const filler = this.getRandomSymbolChars(fillerCount);
                const allChars = [...currentSymbols, ...filler, ...finalThree];
                
                this.setReelSymbols(i, allChars);

                symbolList.style.transition = 'none';
                symbolList.style.transform = 'translateY(0)';
                
                void symbolList.offsetHeight;

                // Subtle blur that fades as it slows down would be ideal, 
                // but for now we'll just keep it very light.
                symbolList.style.filter = 'blur(1px)';

                const scrollDistance = (allChars.length - 3) * symbolHeight;
                
                // Adjusted duration to finish all reels within ~2 seconds
                // Reel 0: 1.2s, Reel 1: 1.5s, Reel 2: 1.8s
                const duration = baseDuration + (i * 300);
                
                // Stronger easing-out (0.15, 0, 0.15, 1) to make the slowdown very visible and "heavy"
                symbolList.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0, 0.15, 1.02)`;
                symbolList.style.transform = `translateY(-${scrollDistance}px)`;

                setTimeout(() => {
                    symbolList.style.filter = 'none';
                    symbolList.style.transition = 'none';
                    this.setReelSymbols(i, finalThree);
                    symbolList.style.transform = 'translateY(0)';
                    resolve();
                }, duration + 50);
            });
        });

        await Promise.all(promises);
        this.spinButton.disabled = false;
        this.state.isSpinning = false;
    }

    showWin(amount, details) {
        if (amount <= 0) return;

        this.winAmountDisplay.textContent = `+${amount.toLocaleString()}`;
        
        const multiplier = amount / this.state.currentBet;
        if (multiplier >= 10) {
            this.winMessage.textContent = "BIG WIN!";
            this.winMessage.style.color = "var(--color-accent)";
        } else {
            this.winMessage.textContent = "WIN!";
            this.winMessage.style.color = "white";
        }

        this.winOverlay.classList.remove('hidden');
        
        // Highlight paylines (simplified for now)
        details.winDetails.forEach(detail => {
            const lineEl = document.getElementById(`payline-${detail.line}`);
            if (lineEl) {
                lineEl.classList.add('active');
                setTimeout(() => lineEl.classList.remove('active'), 2000);
            }
        });
    }
}
