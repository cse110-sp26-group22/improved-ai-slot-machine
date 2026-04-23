/**
 * Analysis of Slot Machine Mechanics
 */

function calculateStats() {
    const totalWeight = SYMBOLS.reduce((sum, s) => {
        // Exclude the Key because its weight is dynamic (based on escapeChance)
        return s.isJackpot ? sum : sum + s.weight;
    }, 0);

    console.log("--- Symbol Probabilities (Excluding Key) ---");
    SYMBOLS.forEach(s => {
        if (s.isJackpot) return;
        const probability = (s.weight / totalWeight) * 100;
        console.log(`${s.char} ${s.name}: ${probability.toFixed(2)}%`);
    });

    console.log("\n--- Expected Return per Spin (Base, 3-of-a-kind) ---");
    let baseReturn = 0;
    SYMBOLS.forEach(s => {
        if (s.multiplier > 0) {
            // P(3-of-a-kind) = (weight / totalWeight)^3
            const prob = Math.pow(s.weight / totalWeight, 3);
            baseReturn += prob * s.multiplier;
        }
    });
    console.log(`Base Return: ${baseReturn.toFixed(4)}x bet`);
    console.log("Note: This does not account for the Escape Chance (Key) logic or the Escape Chance roll (Victory).");
}

calculateStats();
