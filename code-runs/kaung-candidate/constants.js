/**
 * @fileoverview This file contains all the core constants for the slot machine game.
 * The REEL_CONFIG and PAYTABLE have been precisely calculated to achieve
 * ~95% RTP and ~65% hit rate. DO NOT CHANGE THESE VALUES.
 */

/**
 * The symbols used in the game, mapped to their emoji representation.
 * @type {Object<string, string>}
 */
export const SYMBOLS = {
    PIRATE_CAPTAIN: '💎',
    TREASURE_CHEST: '👑',
    PARROT: '🐢',
    GOLD_COIN: '💰',
    ANCHOR: '⚓',
    SKULL: '☠️',
};

/**
 * The payout multipliers for winning combinations.
 * These values are critical for the game's RTP.
 * @type {Object<string, number>}
 */
export const PAYTABLE = {
    PIRATE_CAPTAIN: 250,
    TREASURE_CHEST: 20,
    PARROT: 12,
    GOLD_COIN: 4,
    ANCHOR: 3,
    SKULL: 2,
    ANY_TWO: 1,
};

/**
 * Reel configurations. All reels are identical.
 * This configuration provides a 95.02% RTP and 65.28% hit rate.
 * @type {Array<Array<string>>}
 */
const REEL = ['SKULL', 'SKULL', 'SKULL', 'SKULL', 'SKULL', 'SKULL', 'ANCHOR', 'ANCHOR', 'GOLD_COIN', 'PARROT', 'TREASURE_CHEST', 'PIRATE_CAPTAIN'];
export const REEL_CONFIG = [ REEL, REEL, REEL ];


/**
 * Initial game state values.
 * @type {{balance: number, currentBet: number}}
 */
export const INITIAL_STATE = {
    balance: 1000,
    currentBet: 25,
};

/**
 * Available bet options.
 * @type {number[]}
 */
export const BET_OPTIONS = [25, 50, 100, 250, 500];

/**
 * The number of symbols to show in the reel viewport.
 * @type {number}
 */
export const SYMBOLS_VISIBLE = 3;
