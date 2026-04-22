/**
 * Slot Machine Core Logic Tests
 * Run these by copying into the browser console or 
 * by adding <script src="tests.js"></script> to index.html temporarily.
 */

(function runTests() {
    console.log("--- Starting Slot Machine Tests ---");

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (!condition) {
            console.error("❌ FAILED: " + message);
            failed++;
        } else {
            console.log("✅ PASSED: " + message);
            passed++;
        }
    }

    // 1. Test Weighted Random returns a valid symbol
    function testWeightedRandom() {
        console.log("\nTesting: getRandomSymbol()");
        let results = new Set();
        for (let i = 0; i < 100; i++) {
            const symbol = getRandomSymbol();
            results.add(symbol.name);
        }
        
        const validNames = SYMBOLS.map(s => s.name);
        let allValid = true;
        results.forEach(name => {
            if (!validNames.includes(name)) allValid = false;
        });

        assert(allValid, "getRandomSymbol returns symbols defined in SYMBOLS array.");
        assert(results.size > 1, "getRandomSymbol returns a variety of symbols over 100 runs.");
    }

    // 2. Test Payout Calculation
    function testCalculateWin() {
        console.log("\nTesting: calculateWin()");
        
        const cherry = SYMBOLS.find(s => s.name === 'Cherry');
        const lemon = SYMBOLS.find(s => s.name === 'Lemon');
        const seven = SYMBOLS.find(s => s.name === 'Seven');

        // Match case
        const winMatch = calculateWin([cherry, cherry, cherry], 10);
        assert(winMatch === 50, `3 Cherries with $10 bet should pay $50 (actual: $${winMatch})`);

        const winJackpot = calculateWin([seven, seven, seven], 1);
        assert(winJackpot === 5000, `3 Sevens with $1 bet should pay $5000 (actual: $${winJackpot})`);

        // No match cases
        const noMatch1 = calculateWin([cherry, lemon, cherry], 10);
        assert(noMatch1 === 0, "Non-matching symbols (ABA) should pay $0");

        const noMatch2 = calculateWin([cherry, cherry, lemon], 10);
        assert(noMatch2 === 0, "Non-matching symbols (AAB) should pay $0");
    }

    // 3. Test Balance Updates
    function testUpdateBalance() {
        console.log("\nTesting: updateBalance()");
        
        const initialBalance = balance;
        
        updateBalance(50);
        assert(balance === initialBalance + 50, "updateBalance(50) correctly increments global balance variable.");
        
        updateBalance(-20);
        assert(balance === initialBalance + 30, "updateBalance(-20) correctly decrements global balance variable.");

        // Check if DOM updated (assuming test is run in browser)
        const displayVal = document.getElementById('balance-amount').textContent;
        assert(displayVal === `$${balance}`, `Balance display in DOM (${displayVal}) matches state ($${balance})`);
    }

    // Execute tests
    try {
        testWeightedRandom();
        testCalculateWin();
        testUpdateBalance();
        
        console.log("\n--- Test Summary ---");
        console.log(`Total: ${passed + failed}`);
        console.log(`Passed: ${passed}`);
        if (failed > 0) {
            console.log(`Failed: ${failed}`);
        } else {
            console.log("All tests passed successfully!");
        }
    } catch (e) {
        console.error("Test execution interrupted by error:", e);
    }
})();
