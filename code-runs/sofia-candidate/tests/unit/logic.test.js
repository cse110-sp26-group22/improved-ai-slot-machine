import { GameState, SYMBOLS } from '../../js/game-logic.js';

/**
 * Basic test suite for 4x4 Game Logic
 */
function testBetting() {
    console.log('--- Testing Betting ---');
    const state = new GameState();
    console.assert(state.currentBet === 25, 'Default bet should be 25');
    
    state.increaseBet();
    console.assert(state.currentBet === 50, 'Bet should increase to 50');
    
    state.decreaseBet();
    console.assert(state.currentBet === 25, 'Bet should decrease back to 25');
    console.log('Betting tests passed!');
}

function testWinCalculation4x4() {
    console.log('--- Testing 4x4 Win Calculation ---');
    const state = new GameState();
    
    // Manual reels: 4 lions on top row
    const reels = [
        ['JACKPOT', 'LEAF', 'LEAF', 'LEAF'],
        ['JACKPOT', 'LEAF', 'LEAF', 'LEAF'],
        ['JACKPOT', 'LEAF', 'LEAF', 'LEAF'],
        ['JACKPOT', 'LEAF', 'LEAF', 'LEAF']
    ];
    
    const { totalWin, winDetails } = state.calculateWin(reels);
    const symbolDef = SYMBOLS.find(s => s.id === 'JACKPOT');
    const expected = symbolDef.payout * state.currentBet * 2; // Row payout multiplier
    
    console.assert(totalWin === expected, `Win should be ${expected}, got ${totalWin}`);
    console.assert(winDetails.length === 1, 'Should have exactly 1 win detail');
    console.log('4x4 Win calculation tests passed!');
}

function simulateRTP(spins = 100000) {
    console.log(`--- Simulating RTP over ${spins} spins (4x4 Grid) ---`);
    const state = new GameState();
    state.balance = 100000000; // 100 million credits
    const initialBalance = state.balance;
    let totalBet = 0;
    let totalWon_sim = 0;
    let winCount = 0;
    let specialWinCount = 0;
    
    for (let i = 0; i < spins; i++) {
        const bet = state.currentBet;
        totalBet += bet;
        const result = state.processSpin();
        totalWon_sim += result.totalWin;
        if (result.totalWin > 0) winCount++;
        if (result.isSpecialWin) specialWinCount++;
    }
    
    const rtp = (totalWon_sim / totalBet) * 100;
    
    console.log(`Total Bet: ${totalBet.toLocaleString()}`);
    console.log(`Total Won: ${totalWon_sim.toLocaleString()}`);
    console.log(`Hit Frequency: ${((winCount / spins) * 100).toFixed(2)}%`);
    console.log(`Special Win Frequency: ${((specialWinCount / spins) * 100).toFixed(2)}%`);
    console.log(`RTP: ${rtp.toFixed(2)}%`);
}

// Run tests
try {
    testBetting();
    testWinCalculation4x4();
    simulateRTP(200000);
} catch (e) {
    console.error('Tests failed:', e);
}
