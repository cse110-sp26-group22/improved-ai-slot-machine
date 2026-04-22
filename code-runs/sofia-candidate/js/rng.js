/**
 * Cryptographically secure RNG module
 */

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 * Uses window.crypto for better unpredictability.
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function getRandomInt(min, max) {
    const range = max - min;
    if (range <= 0) return min;

    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    
    // Scale the random value to our range using floating point for simplicity in this prototype
    // (In a production financial app, rejection sampling would be preferred)
    return min + Math.floor((array[0] / (0xffffffff + 1)) * range);
}

/**
 * Returns a random element from an array based on weights.
 * 
 * @param {Array} items - Array of items to choose from.
 * @param {Array} weights - Corresponding weights for each item.
 * @returns {*} The chosen item.
 */
export function getWeightedRandom(items, weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let random = getRandomInt(0, totalWeight);
    
    let cumulativeWeight = 0;
    for (let i = 0; i < items.length; i++) {
        cumulativeWeight += weights[i];
        if (random < cumulativeWeight) {
            return items[i];
        }
    }
    
    return items[items.length - 1];
}
