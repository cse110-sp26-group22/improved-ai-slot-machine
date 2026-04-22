import { GameState } from './game-logic.js';
import { UI } from './ui.js';
import { AudioController } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState();
    const ui = new UI(gameState);
    const audio = new AudioController();

    // Init UI with initial state
    ui.updateStats();

    // Event Listeners
    ui.spinButton.addEventListener('click', async () => {
        // Init audio context on first user interaction
        audio.init();

        if (gameState.isSpinning) return;

        if (!gameState.canSpin()) {
            ui.showError('Insufficient balance!');
            return;
        }

        audio.playSfx('spin');
        const results = gameState.processSpin();
        
        ui.updateStats(); // Subtract bet immediately
        
        await ui.animateSpin(results);
        
        ui.updateStats(); // Add win amount

        if (results.totalWin > 0) {
            const multiplier = results.totalWin / gameState.currentBet;
            if (multiplier >= 10) {
                audio.playSfx('bigwin');
            } else {
                audio.playSfx('win');
            }
            ui.showWin(results.totalWin, results);
        }
    });

    ui.betIncrease.addEventListener('click', () => {
        if (gameState.isSpinning) return;
        if (gameState.increaseBet()) {
            ui.updateStats();
        }
    });

    ui.betDecrease.addEventListener('click', () => {
        if (gameState.isSpinning) return;
        if (gameState.decreaseBet()) {
            ui.updateStats();
        }
    });

    ui.muteToggle.addEventListener('click', () => {
        audio.init();
        const isMuted = audio.toggleMute();
        ui.muteToggle.textContent = isMuted ? '🔇' : '🔊';
    });
});
