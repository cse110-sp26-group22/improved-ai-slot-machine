import { getWeightedRandom } from './rng.js';

export const SYMBOLS = [
    { id: 'JACKPOT', char: '🦁', weight: 15, payout: 50 },
    { id: 'MONKEY', char: '🐒', weight: 22, payout: 20 },
    { id: 'TOUCAN', char: '🦜', weight: 30, payout: 10 },
    { id: 'FLOWER', char: '🌺', weight: 38, payout: 5 },
    { id: 'LEAF', char: '🍃', weight: 45, payout: 2 },
    { id: 'EMPTY', char: '🌵', weight: 30, payout: 0 }
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
     * Generate 4x4 grid of symbols
     * Returns 2D array: reels[reelIndex][row]
     */
    generateReels() {
        const symbolIds = SYMBOLS.map(s => s.id);
        const weights = SYMBOLS.map(s => s.weight);
        
        const result = [];
        for (let reel = 0; reel < 4; reel++) {
            const column = [];
            for (let row = 0; row < 4; row++) {
                column.push(getWeightedRandom(symbolIds, weights));
            }
            result.push(column);
        }
        return result;
    }

    /**
     * Calculate wins based on 4x4 reels.
     * Check 4 rows, 4 columns, and 2 diagonals.
     */
    calculateWin(reels) {
        let totalWin = 0;
        const winDetails = [];
        const bet = this.currentBet;
        
        // Check Rows (Horizontal)
        for (let row = 0; row < 4; row++) {
            const s1 = reels[0][row], s2 = reels[1][row], s3 = reels[2][row], s4 = reels[3][row];
            if (s1 === s2 && s2 === s3 && s3 === s4 && s1 !== 'EMPTY') {
                const symbolDef = SYMBOLS.find(s => s.id === s1);
                const amount = symbolDef.payout * bet * 2; // Extra multiplier for 4-in-a-row
                totalWin += amount;
                winDetails.push({ line: `row-${row}`, amount, symbol: s1 });
            }
        }

        // Check Columns (Vertical)
        for (let col = 0; col < 4; col++) {
            const s1 = reels[col][0], s2 = reels[col][1], s3 = reels[col][2], s4 = reels[col][3];
            if (s1 === s2 && s2 === s3 && s3 === s4 && s1 !== 'EMPTY') {
                const symbolDef = SYMBOLS.find(s => s.id === s1);
                const amount = symbolDef.payout * bet * 2;
                totalWin += amount;
                winDetails.push({ line: `col-${col}`, amount, symbol: s1 });
            }
        }

        // Check Diagonals
        // Main diagonal (\)
        const d1_1 = reels[0][0], d1_2 = reels[1][1], d1_3 = reels[2][2], d1_4 = reels[3][3];
        if (d1_1 === d1_2 && d1_2 === d1_3 && d1_3 === d1_4 && d1_1 !== 'EMPTY') {
            const symbolDef = SYMBOLS.find(s => s.id === d1_1);
            const amount = symbolDef.payout * bet * 5; // Big bonus for diagonals
            totalWin += amount;
            winDetails.push({ line: 'diag-1', amount, symbol: d1_1 });
        }

        // Anti-diagonal (/)
        const d2_1 = reels[0][3], d2_2 = reels[1][2], d2_3 = reels[2][1], d2_4 = reels[3][0];
        if (d2_1 === d2_2 && d2_2 === d2_3 && d2_3 === d2_4 && d2_1 !== 'EMPTY') {
            const symbolDef = SYMBOLS.find(s => s.id === d2_1);
            const amount = symbolDef.payout * bet * 5;
            totalWin += amount;
            winDetails.push({ line: 'diag-2', amount, symbol: d2_1 });
        }

        const isSpecialWin = winDetails.length > 1;
        if (isSpecialWin) {
            totalWin *= 2; // Double total win for multiple lines!
        }

        return { totalWin, winDetails, isSpecialWin };
    }

    processSpin() {
        if (!this.canSpin()) return null;

        this.balance -= this.currentBet;
        this.isSpinning = true;
        
        const reels = this.generateReels();
        const { totalWin, winDetails, isSpecialWin } = this.calculateWin(reels);
        
        this.balance += totalWin;
        this.lastWin = totalWin;
        this.totalWon += totalWin;
        this.isSpinning = false;
        
        return { reels, totalWin, winDetails, isSpecialWin };
    }
}
