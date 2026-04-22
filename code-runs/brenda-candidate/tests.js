console.log("Running Slot Machine Tests...");

function runTests() {
    let winResult = calculatePayout(['🍒', '🍒', '🍒'], 25);
    console.assert(winResult === 250, `Test Failed: Expected 250, got ${winResult}`);

    let loseResult1 = calculatePayout(['🍒', '🍋', '🍒'], 50);
    console.assert(loseResult1 === 0, `Test Failed: Expected 0, got ${loseResult1}`);

    let loseResult2 = calculatePayout(['💎', '💎', '7️⃣'], 100);
    console.assert(loseResult2 === 0, `Test Failed: Expected 0, got ${loseResult2}`);

    let canAfford1 = canAffordBet(100, 25);
    console.assert(canAfford1 === true, "Test Failed: Expected true");

    let canAfford2 = canAffordBet(50, 50);
    console.assert(canAfford2 === true, "Test Failed: Expected true");

    let canAfford3 = canAffordBet(10, 25);
    console.assert(canAfford3 === false, "Test Failed: Expected false");

    console.log("Tests complete. If no assertion errors appeared, all tests passed.");
}

runTests();