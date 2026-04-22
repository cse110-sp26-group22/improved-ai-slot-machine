import { GameState, SYMBOLS } from '../../js/game-logic.js';

/**
 * Basic test suite for Game Logic
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

function testWinCalculation() {
    console.log('--- Testing Win Calculation ---');
    const state = new GameState();
    
    // Manual reels: 3 lions on center row
    const reels = [
        ['LEAF', 'JACKPOT', 'LEAF'],
        ['LEAF', 'JACKPOT', 'LEAF'],
        ['LEAF', 'JACKPOT', 'LEAF']
    ];
    
    const { totalWin } = state.calculateWin(reels);
    const expected = SYMBOLS.find(s => s.id === 'JACKPOT').payout * state.currentBet;
    
    console.assert(totalWin === expected, `Win should be ${expected}, got ${totalWin}`);
    console.log('Win calculation tests passed!');
}

function simulateRTP(spins = 10000) {
    console.log(`--- Simulating RTP over ${spins} spins ---`);
    const state = new GameState();
    state.balance = 10000000; // 10 million credits
    const initialBalance = state.balance;
    let totalBet = 0;
    
    let totalWon_sim = 0;
    for (let i = 0; i < spins; i++) {
        const bet = state.currentBet;
        totalBet += bet;
        const result = state.processSpin();
        totalWon_sim += result.totalWin;
    }
    
    const finalBalance = state.balance;
    const totalWon = finalBalance - initialBalance + totalBet;
    console.log(`Simulated Win Total: ${totalWon_sim}`);
    const rtp = (totalWon / totalBet) * 100;
    
    console.log(`Total Bet: ${totalBet}`);
    console.log(`Total Won: ${totalWon}`);
    console.log(`RTP: ${rtp.toFixed(2)}%`);
    
    console.assert(rtp > 85 && rtp < 105, `RTP ${rtp.toFixed(2)}% is outside expected range (95% target)`);
}

// Run tests
try {
    testBetting();
    testWinCalculation();
    simulateRTP(100000);
} catch (e) {
    console.error('Tests failed:', e);
}
