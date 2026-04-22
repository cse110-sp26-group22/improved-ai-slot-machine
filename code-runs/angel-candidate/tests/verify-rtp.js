const SlotMachine = require('../js/slot-machine.js');

function runSimulation(spins = 1000000) {
    const game = new SlotMachine(0);
    const betPerSpin = 100; // Constant bet for simulation
    game.setBet(betPerSpin);

    let totalWagered = 0;
    let totalWon = 0;

    console.log(`Simulating ${spins.toLocaleString()} spins...`);

    for (let i = 0; i < spins; i++) {
        totalWagered += betPerSpin;
        
        // Generate grid
        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                game.reels[col][row] = game.getRandomSymbol();
            }
        }

        const result = game.calculateWins();
        totalWon += result.totalWin;
    }

    const rtp = (totalWon / totalWagered) * 100;
    console.log('--- Simulation Results ---');
    console.log(`Total Wagered: ${totalWagered.toLocaleString()} credits`);
    console.log(`Total Won: ${totalWon.toLocaleString()} credits`);
    console.log(`Calculated RTP: ${rtp.toFixed(2)}%`);
    console.log(`Target RTP: 95.00%`);
    
    if (rtp > 93 && rtp < 97) {
        console.log('SUCCESS: RTP is within acceptable range (93-97%)');
    } else {
        console.log('FAILURE: RTP is outside acceptable range');
    }
}

runSimulation();
