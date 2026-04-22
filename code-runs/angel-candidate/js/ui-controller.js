/**
 * UIController v2.0
 * Handles high-performance animations and reactive UI updates.
 */

class UIController {
    constructor(game, audio) {
        this.game = game;
        this.audio = audio;
        this.isSpinning = false;

        this.symbolIcons = {
            'glitch': '👾',
            'disk': '💾',
            'laser': '🔫',
            'heart': '❤️',
            'skull': '💀'
        };

        this.initDOMElements();
        this.initEventListeners();
        this.setupReels();
        this.updateStats();
    }

    initDOMElements() {
        this.strips = [
            document.getElementById('strip-0'),
            document.getElementById('strip-1'),
            document.getElementById('strip-2')
        ];

        this.balanceEl = document.getElementById('balance');
        this.betEl = document.getElementById('bet');
        this.totalWonEl = document.getElementById('total-won');
        this.totalWinnings = 0; // This will be updated by applyWinnings
        this.winEl = document.getElementById('win-display');
        this.spinBtn = document.getElementById('spin-btn');
        this.audioBtn = document.getElementById('audio-toggle');
        this.betSelector = document.getElementById('bet-selector');
        this.cabinet = document.querySelector('.game-container');
    }

    initEventListeners() {
        this.spinBtn.addEventListener('click', () => this.handleSpin());
        
        this.audioBtn.addEventListener('click', () => {
            const enabled = this.audio.toggle();
            this.audioBtn.innerHTML = enabled ? '<span class="icon">🔊</span> MUSIC: ON' : '<span class="icon">🔈</span> MUSIC: OFF';
            this.audioBtn.classList.toggle('off', !enabled);
            this.audio.playClick();
        });

        this.betSelector.addEventListener('change', (e) => {
            const bet = parseInt(e.target.value);
            if (this.game.setBet(bet)) {
                this.updateStats();
                this.audio.playClick();
            }
        });
    }

    setupReels() {
        // Create initial reel strips with random symbols
        this.strips.forEach(strip => {
            strip.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const symbol = this.game.getRandomSymbol();
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = this.symbolIcons[symbol.id];
                strip.appendChild(div);
            }
        });
    }

    updateStats() {
        // Update balance and bet display
        this.balanceEl.textContent = (this.game.balance / 100).toFixed(2);
        this.betEl.textContent = (this.game.currentBet / 100).toFixed(2);
        
        // Update total winnings display
        this.totalWonEl.textContent = (this.totalWinnings / 100).toFixed(2);
        
        if (this.totalWinnings > 0) {
            this.totalWonEl.classList.add('highlight');
        } else {
            this.totalWonEl.classList.remove('highlight');
        }
    }

    async handleSpin() {
        if (this.isSpinning) return;
        
        if (this.game.balance < this.game.currentBet) {
            this.winEl.textContent = 'INSUFFICIENT CREDITS';
            this.winEl.style.color = 'var(--neon-pink)';
            return;
        }

        this.isSpinning = true;
        this.clearHighlights();
        this.winEl.textContent = 'SPINNING...';
        this.winEl.style.color = 'var(--neon-blue)';
        
        this.audio.playSpin();

        // 1. Initiate spin: Deduct bet, get results, but NOT update balance with winnings yet.
        // The slotMachine instance's balance is updated to balanceBeforeWinnings in game.spin().
        const spinResult = this.game.spin(); 
        
        // 2. Update balance immediately to reflect bet deduction.
        //    Calling updateStats() here shows the balance after the bet.
        this.updateStats(); 

        // 3. Animate reels using the results from game.spin().
        await this.animateReels(spinResult.reels);

        // 4. Apply winnings AFTER animation.
        //    This updates the game instance's balance, totalWon, and lastWinAmount.
        const finalBalance = this.game.applyWinnings(spinResult.winResult.totalWin);
        
        // Update the UI's tracked total winnings based on the amount won in this spin.
        this.totalWinnings += spinResult.winResult.totalWin; 
        
        // 5. Update stats with the final balance and total winnings.
        this.updateStats(); 

        // 6. Handle win/loss display and highlighting.
        if (spinResult.winResult.totalWin > 0) {
            this.handleWin(spinResult.winResult);
        } else {
            this.handleLoss();
        }

        // 7. Reset spinning state.
        this.isSpinning = false;
    }

    async animateReels(finalSymbols) {
        const spinDuration = 2000;
        const staggerDelay = 300;
        const symbolHeight = 100;

        const promises = this.strips.map((strip, i) => {
            return new Promise(resolve => {
                // Prepare the strip for the end position
                // We want the result symbols at index 1 (middle of the 3 visible)
                // But our grid is 3x3, so symbols[i][0,1,2]
                // Let's place the results at the bottom of the strip
                const resultSymbols = finalSymbols[i];
                
                // Add the result symbols to the end of the strip
                const endSymbolsContainer = document.createElement('div');
                resultSymbols.forEach(s => {
                    const div = document.createElement('div');
                    div.className = 'symbol';
                    div.textContent = this.symbolIcons[s.id];
                    div.dataset.symbol = s.id;
                    strip.appendChild(div);
                });

                const totalSymbols = strip.children.length;
                const targetY = (totalSymbols - 3) * symbolHeight;

                setTimeout(() => {
                    strip.style.transition = `transform ${spinDuration / 1000}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                    strip.style.transform = `translateY(-${targetY}px)`;
                    
                    setTimeout(() => {
                        this.audio.playStop();
                        // Reset strip for next spin without transition
                        const lastThree = Array.from(strip.children).slice(-3);
                        strip.innerHTML = '';
                        lastThree.forEach(node => strip.appendChild(node));
                        strip.style.transition = 'none';
                        strip.style.transform = 'translateY(0)';
                        
                        // Fill up the strip for next time
                        for (let j = 0; j < 15; j++) {
                            const symbol = this.game.getRandomSymbol();
                            const div = document.createElement('div');
                            div.className = 'symbol';
                            div.textContent = this.symbolIcons[symbol.id];
                            strip.insertBefore(div, strip.firstChild);
                        }
                        resolve();
                    }, spinDuration);
                }, i * staggerDelay);
            });
        });

        return Promise.all(promises);
    }

    handleWin(winResult) {
        // This method now relies on this.totalWinnings being updated in handleSpin
        const winAmount = (winResult.totalWin / 100).toFixed(2);
        
        if (winResult.totalWin >= this.game.currentBet * 5) {
            this.winEl.textContent = `JACKPOT: $${winAmount}!!`;
            this.cabinet.classList.add('screen-shake');
            setTimeout(() => this.cabinet.classList.remove('screen-shake'), 1000);
        } else if (winResult.totalWin > this.game.currentBet) {
            this.winEl.textContent = `BIG WIN: $${winAmount}!`;
        } else {
            this.winEl.textContent = `WIN: $${winAmount}`;
        }

        this.winEl.style.color = 'var(--neon-green)';
        this.highlightWins(winResult.winningLines);
        this.audio.playWin();
    }

    handleLoss() {
        this.audio.playLoss();
        this.winEl.textContent = 'TRY AGAIN';
        this.winEl.style.color = 'var(--neon-pink)';
    }

    highlightWins(winningLines) {
        winningLines.forEach(win => {
            win.line.forEach(pos => {
                const col = pos[0];
                const row = pos[1];
                const strip = this.strips[col];
                // In our reset strip, symbols are indices 0, 1, 2
                const symbolEl = strip.children[row];
                if (symbolEl) symbolEl.classList.add('winning-symbol');
            });
        });
    }

    clearHighlights() {
        document.querySelectorAll('.winning-symbol').forEach(el => {
            el.classList.remove('winning-symbol');
        });
    }
}

window.UIController = UIController;
