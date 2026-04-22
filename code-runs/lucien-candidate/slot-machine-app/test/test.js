/**
 * 🎰 Slot Machine RTP Simulation Test
 * Run this with Node.js: `node test.js`
 */

const SYMBOLS = [
    { name: 'CHERRY', weight: 45, payout: 80 },
    { name: 'LEMON', weight: 35, payout: 150 },
    { name: 'ORANGE', weight: 25, payout: 250 },
    { name: 'PLUM', weight: 15, payout: 500 },
    { name: 'BAR', weight: 8, payout: 1500 },
    { name: 'SEVEN', weight: 4, payout: 3500 },
    { name: 'JACKPOT', weight: 1, payout: 15000 }
];

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

function calculateWin(outcomes, bet) {
    const scale = bet / 25;
    let win = 0;

    // 1. Check for 3 of a kind
    if (outcomes[0].name === outcomes[1].name && outcomes[1].name === outcomes[2].name) {
        win = outcomes[0].payout * scale;
    } 
    // 2. Check for 2 of a kind (First two)
    else if (outcomes[0].name === outcomes[1].name) {
        win = Math.floor(outcomes[0].payout * 0.4 * scale);
    }
    
    // 3. Special Case: Cherry (Anywhere)
    const cherryCount = outcomes.filter(o => o.name === 'CHERRY').length;
    if (cherryCount > 0 && outcomes[0].name !== 'CHERRY') {
        const cherryWin = cherryCount * 2 * scale;
        win += cherryWin;
    }

    return Math.floor(win);
}

function runSimulation(spinCount = 1000000, bet = 25) {
    let totalBet = 0;
    let totalWin = 0;
    let winCount = 0;

    console.log(`--- Starting RTP Simulation for ${spinCount.toLocaleString()} spins ---`);
    console.time('Simulation Time');

    for (let i = 0; i < spinCount; i++) {
        const outcomes = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        const win = calculateWin(outcomes, bet);
        
        totalBet += bet;
        totalWin += win;
        if (win > 0) winCount++;
    }

    console.timeEnd('Simulation Time');

    const rtp = (totalWin / totalBet) * 100;
    const winFrequency = (winCount / spinCount) * 100;

    console.log(`Total Bet: ${totalBet.toLocaleString()} credits`);
    console.log(`Total Win: ${totalWin.toLocaleString()} credits`);
    console.log(`Win Frequency: ${winFrequency.toFixed(2)}%`);
    console.log(`Calculated RTP: ${rtp.toFixed(2)}%`);
    console.log('----------------------------------------------------');
}

// Run the simulation
runSimulation();
