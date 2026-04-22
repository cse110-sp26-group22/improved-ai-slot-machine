/**
 * SlotMachine Engine v2.0
 * Handles game state, RNG, and win logic.
 * Optimized for accuracy and fairness.
 */

class SlotMachine {
    constructor(initialBalance = 1000) {
        this.balance = initialBalance; // Credits (1 credit = $0.01)
        this.allowedBets = [25, 50, 75, 100, 200, 500, 1000, 2000];
        this.currentBet = 25;
        this.totalWagered = 0;
        this.totalWon = 0;
        this.lastWinAmount = 0;
        
        // Symbols with weights and multipliers
        // RTP target ~95%
        this.symbols = [
            { id: 'glitch', name: 'GLITCH', weight: 650, payout: 2 },      
            { id: 'disk', name: 'DISK', weight: 220, payout: 10 },    
            { id: 'laser', name: 'LASER', weight: 90, payout: 50 },   
            { id: 'heart', name: 'HEART', weight: 30, payout: 200 }, 
            { id: 'skull', name: 'SKULL', weight: 10, payout: 1000 }  
        ];

        this.reels = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // 5 standard paylines
        this.paylines = [
            [[0, 1], [1, 1], [2, 1]], // Middle horizontal
            [[0, 0], [1, 0], [2, 0]], // Top horizontal
            [[0, 2], [1, 2], [2, 2]], // Bottom horizontal
            [[0, 0], [1, 1], [2, 2]], // Diagonal down
            [[0, 2], [1, 1], [2, 0]]  // Diagonal up
        ];
    }

    setBet(amount) {
        if (this.allowedBets.includes(amount)) {
            this.currentBet = amount;
            return true;
        }
        return false;
    }

    getRandomSymbol() {
        const totalWeight = this.symbols.reduce((sum, s) => sum + s.weight, 0);
        let rand = Math.random() * totalWeight;
        for (const symbol of this.symbols) {
            rand -= symbol.weight;
            if (rand <= 0) return symbol;
        }
        return this.symbols[0];
    }

    spin() {
        if (this.balance < this.currentBet) {
            throw new Error("INSUFFICIENT CREDITS");
        }

        // 1. Deduct bet immediately
        this.balance -= this.currentBet;
        this.totalWagered += this.currentBet;

        // 2. Generate 3x3 grid results
        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                this.reels[col][row] = this.getRandomSymbol();
            }
        }

        // 3. Calculate wins
        const winResult = this.calculateWins();
        
        // Winnings will be applied separately after animation

        return {
            reels: this.reels,
            winResult: winResult,
            balanceBeforeWinnings: this.balance, // Balance after deduction, before winnings
            currentBet: this.currentBet
        };
    }

    calculateWins() {
        let totalWin = 0;
        let winningLines = [];

        for (const line of this.paylines) {
            const s1 = this.reels[line[0][0]][line[0][1]];
            const s2 = this.reels[line[1][0]][line[1][1]];
            const s3 = this.reels[line[2][0]][line[2][1]];

            if (s1.id === s2.id && s2.id === s3.id) {
                // Win calculation: Multiplier * (Total Bet / Lines)
                // We use 5 lines
                const linePayout = s1.payout * (this.currentBet / 5);
                totalWin += linePayout;
                winningLines.push({
                    line: line,
                    symbol: s1,
                    amount: linePayout
                });
            }
        }

        return {
            totalWin: Math.floor(totalWin),
            winningLines: winningLines
        };
    }

    /**
     * Applies the winnings to the balance and updates game state.
     * This method should be called after the spin animation and win display.
     * @param {number} winAmount The total amount won in this spin.
     * @returns {number} The updated balance.
     */
    applyWinnings(winAmount) {
        if (winAmount > 0) {
            this.balance += winAmount;
            this.totalWon += winAmount;
            this.lastWinAmount = winAmount;
        } else {
            this.lastWinAmount = 0; // Ensure last win is 0 if no win
        }
        return this.balance; // Return updated balance
    }

    getGameState() {
        return {
            balance: this.balance,
            currentBet: this.currentBet,
            lastWinAmount: this.lastWinAmount,
            totalWon: this.totalWon
        };
    }

}

if (typeof window !== 'undefined') {
    window.SlotMachine = SlotMachine;
}
