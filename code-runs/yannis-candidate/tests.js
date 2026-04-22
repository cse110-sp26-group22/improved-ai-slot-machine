/**
 * Slot Machine Core Logic Tests
 * Run these by copying into the browser console or 
 * by adding <script src="tests.js"></script> to index.html temporarily.
 */

(function runTests() {
    console.log("--- Starting Slot Machine Tests ---");

    let passed = 0;
    let failed = 0;

    // Store initial state to restore later
    const originalBalance = balance;
    const originalWinStreak = winStreak;

    function assert(condition, message) {
        if (!condition) {
            console.error("❌ FAILED: " + message);
            failed++;
        } else {
            console.log("✅ PASSED: " + message);
            passed++;
        }
    }

    /**
     * 1. Test Weighted Random returns a valid symbol
     */
    function testWeightedRandom() {
        console.log("\nTesting: getRandomSymbol()");
        const iterations = 100;
        let results = new Set();
        
        for (let i = 0; i < iterations; i++) {
            const symbol = getRandomSymbol();
            results.add(symbol.name);
        }
        
        const validNames = SYMBOLS.map(s => s.name);
        let allValid = Array.from(results).every(name => validNames.includes(name));

        assert(allValid, "getRandomSymbol returns symbols defined in SYMBOLS array.");
        assert(results.size > 1, `getRandomSymbol returns a variety of symbols over ${iterations} runs.`);
    }

    /**
     * 2. Test Payout Calculation
     */
    function testCalculateWin() {
        console.log("\nTesting: calculateWin()");
        
        const cherry = SYMBOLS.find(s => s.name === 'Cherry');
        const lemon = SYMBOLS.find(s => s.name === 'Lemon');
        const seven = SYMBOLS.find(s => s.name === 'Seven');
        const betAmount = 10;

        // Match case
        const winMatch = calculateWin([cherry, cherry, cherry], betAmount);
        const expectedCherryWin = betAmount * cherry.multiplier;
        assert(winMatch === expectedCherryWin, `3 Cherries with $${betAmount} bet should pay $${expectedCherryWin} (actual: $${winMatch})`);

        const smallBet = 1;
        const winJackpot = calculateWin([seven, seven, seven], smallBet);
        const expectedSevenWin = smallBet * seven.multiplier;
        assert(winJackpot === expectedSevenWin, `3 Sevens with $${smallBet} bet should pay $${expectedSevenWin} (actual: $${winJackpot})`);

        // No match cases
        const noMatch1 = calculateWin([cherry, lemon, cherry], betAmount);
        assert(noMatch1 === 0, "Non-matching symbols (ABA) should pay $0");

        const noMatch2 = calculateWin([cherry, cherry, lemon], betAmount);
        assert(noMatch2 === 0, "Non-matching symbols (AAB) should pay $0");
    }

    /**
     * 3. Test Balance Updates
     */
    function testUpdateBalance() {
        console.log("\nTesting: updateBalance()");
        
        // Reset to known state for testing
        balance = 100;
        updateUI(); // Ensure DOM is synced
        
        updateBalance(50);
        assert(balance === 150, "updateBalance(50) correctly increments balance (expected 150, actual " + balance + ")");
        
        updateBalance(-20);
        assert(balance === 130, "updateBalance(-20) correctly decrements balance (expected 130, actual " + balance + ")");

        // Check if DOM updated (assuming test is run in browser)
        const displayVal = document.getElementById('balance-amount').textContent;
        assert(displayVal === `$${balance}`, `Balance display in DOM (${displayVal}) matches state ($${balance})`);
        
        // Test edge cases
        updateBalance(NaN);
        assert(balance === 130, "updateBalance(NaN) should not change balance");
        
        updateBalance("invalid");
        assert(balance === 130, "updateBalance with non-number should not change balance");
    }

    /**
     * 4. Test Game Reset
     */
    function testResetGame() {
        console.log("\nTesting: resetGame()");
        
        balance = 0;
        winStreak = 5;
        resetGame();
        
        assert(balance === GAME_CONFIG.INITIAL_BALANCE, "resetGame() restores initial balance");
        assert(winStreak === 0, "resetGame() resets win streak");
    }

    // Execute tests
    try {
        testWeightedRandom();
        testCalculateWin();
        testUpdateBalance();
        testResetGame();
        
        console.log("\n--- Test Summary ---");
        console.log(`Total: ${passed + failed}`);
        console.log(`Passed: ${passed}`);
        if (failed > 0) {
            console.error(`Failed: ${failed}`);
        } else {
            console.log("All tests passed successfully!");
        }
    } catch (e) {
        console.error("Test execution interrupted by error:", e);
    } finally {
        // Restore original state
        balance = originalBalance;
        winStreak = originalWinStreak;
        updateUI();
        console.log("\n--- Game State Restored ---");
    }
})();

