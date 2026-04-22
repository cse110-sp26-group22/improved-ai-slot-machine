import crypto from 'node:crypto';
import fs from 'node:fs';

// Mock window for Node environment
global.window = {
    crypto: {
        getRandomValues: (arr) => crypto.randomFillSync(arr)
    }
};

// Use dynamic import for the test file
import('./tests/unit/logic.test.js')
    .then(() => console.log('✅ Unit Tests Completed'))
    .catch(err => {
        console.error('❌ Unit Tests Failed:', err);
        process.exit(1);
    });
