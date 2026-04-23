/**
 * Final validation tests for the Slot Machine logic v9.
 * Proving the 1.6x+ Expected Return (ER) and Progress Victory logic.
 */

const tests = {
    testExpectedReturnV9: () => {
        console.log("--- Expected Return (ER) Analysis v9 ---");
        let totalER = 0;
        let totalWinRate = 0;
        
        SYMBOLS.forEach(s => {
            const contribution = s.winRate * s.multiplier;
            totalER += contribution;
            totalWinRate += s.winRate;
            if (s.multiplier > 0) {
                console.log(`${s.char} ${s.name}:`);
                console.log(` - Target Win Rate: ${(s.winRate * 100).toFixed(2)}%`);
                console.log(` - Multiplier: ${s.multiplier}x`);
                console.log(` - ER Contribution: ${contribution.toFixed(4)}`);
            }
        });
        
        console.log(`-----------------------------------`);
        console.log(`TOTAL WIN FREQUENCY: ${(totalWinRate * 100).toFixed(2)}%`);
        console.log(`TOTAL GOLD EXPECTED RETURN: ${totalER.toFixed(4)}x`);
        
        if (totalER >= 1.6) {
            console.log("✅ Economy targets (1.6x ER) met.");
        } else {
            console.error("❌ Economy targets missed.");
        }
    },

    testProgressVictory: () => {
        console.log("--- Progress Victory Analysis ---");
        gameState.escapeProgress = 99.9;
        
        // Mock a win that pushes it over 100
        const rock = SYMBOLS.find(s => s.char === '⛰️');
        const grid = [[], [rock, rock, rock], []];
        gameState.currentTurnBet = 1000; // Big bet for big boost
        evaluateGrid(grid);
        
        if (gameState.escapeProgress === 100.0) {
            console.log("✅ Escape Progress correctly capped at 100% OK");
        }
        
        if (!dom.victoryOverlay.classList.contains('hidden')) {
            console.log("✅ 100% Progress triggered Victory OK");
        } else {
            console.error("❌ 100% Progress failed to trigger victory");
        }
        gameState.escapeProgress = 0.0;
    },

    testInstantWinKey: () => {
        console.log("--- Instant Win Key Analysis ---");
        const key = SYMBOLS.find(s => s.isJackpot);
        const grid = [[], [key, key, key], []];
        evaluateGrid(grid);
        
        if (!dom.victoryOverlay.classList.contains('hidden')) {
            console.log("✅ Matching 3 Golden Keys triggered Victory OK");
        } else {
            console.error("❌ Golden Key Match failed to trigger victory");
        }
    }
};

if (window.location.search.includes('test')) {
    console.log("--- STARTING FINAL VALIDATION V9 ---");
    Object.values(tests).forEach(t => t());
    console.log("--- VALIDATION COMPLETE ---");
}
