import { getWeightedRandom } from './rng.js';

export const SYMBOLS = [
    { id: 'JACKPOT', char: '🦁', weight: 32, payout: 50 },
    { id: 'MONKEY', char: '🐒', weight: 42, payout: 20 },
    { id: 'TOUCAN', char: '🦜', weight: 52, payout: 10 },
    { id: 'FLOWER', char: '🌺', weight: 62, payout: 5 },
    { id: 'LEAF', char: '🍃', weight: 72, payout: 2 },
    { id: 'EMPTY', char: '🌵', weight: 25, payout: 0 }
];

export const VALID_BETS = [25, 50, 75, 100, 200, 500, 1000, 2000];

export class GameState {
    constructor() {
        this.balance = 1000;
        this.currentBetIndex = 0;
        this.isSpinning = false;
        this.lastWin = 0;
        this.totalWon = 0;
    }

    get currentBet() {
        return VALID_BETS[this.currentBetIndex];
    }

    increaseBet() {
        if (this.currentBetIndex < VALID_BETS.length - 1) {
            this.currentBetIndex++;
            return true;
        }
        return false;
    }

    decreaseBet() {
        if (this.currentBetIndex > 0) {
            this.currentBetIndex--;
            return true;
        }
        return false;
    }

    canSpin() {
        return !this.isSpinning && this.balance >= this.currentBet;
    }

    /**
     * Generate 3x3 grid of symbols
     * Returns 2D array: reels[reelIndex][row]
     */
    generateReels() {
        const symbolIds = SYMBOLS.map(s => s.id);
        const weights = SYMBOLS.map(s => s.weight);
        
        const result = [];
        for (let reel = 0; reel < 3; reel++) {
            const column = [];
            for (let row = 0; row < 3; row++) {
                column.push(getWeightedRandom(symbolIds, weights));
            }
            result.push(column);
        }
        return result;
    }

    /**
     * Calculate wins based on reels and current bet.
     * Center line is always active.
     * Top and Bottom lines active if bet >= 200.
     */
    calculateWin(reels) {
        let totalWin = 0;
        const winDetails = [];
        const bet = this.currentBet;
        
        const checkLine = (row, lineName) => {
            const s1 = reels[0][row];
            const s2 = reels[1][row];
            const s3 = reels[2][row];
            
            const symbolDef = SYMBOLS.find(s => s.id === s1);
            let multiplier = 0;

            if (s1 === s2 && s2 === s3) {
                multiplier = symbolDef.payout; // 3 of a kind
            } else if (s1 === s2 || s2 === s3) {
                multiplier = symbolDef.payout * 0.2; // 2 of a kind (adjacent)
            }
            
            if (multiplier > 0) {
                const winAmount = Math.floor(multiplier * bet);
                totalWin += winAmount;
                winDetails.push({ line: lineName, amount: winAmount, symbol: s1 });
            }
        };

        // Center row is always active (index 1)
        checkLine(1, 'center');

        // Optional lines if bet is high enough
        if (bet >= 200) {
            checkLine(0, 'top');
            checkLine(2, 'bottom');
        }

        return { totalWin, winDetails };
    }

    processSpin() {
        if (!this.canSpin()) return null;

        this.balance -= this.currentBet;
        this.isSpinning = true;
        
        const reels = this.generateReels();
        const { totalWin, winDetails } = this.calculateWin(reels);
        
        this.balance += totalWin;
        this.lastWin = totalWin;
        this.totalWon += totalWin;
        this.isSpinning = false;
        
        return { reels, totalWin, winDetails };
    }
}
