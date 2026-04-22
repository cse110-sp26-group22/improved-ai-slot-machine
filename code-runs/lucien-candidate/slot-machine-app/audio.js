// Audio Context for Web Audio API
let audioCtx;
let isMuted = false;

// DOM Elements
const muteToggleBtn = document.getElementById('mute-toggle');

// Helper to create oscillators for sounds since we don't have external assets
function createSound(freq, type, duration, volume = 0.1) {
    if (isMuted || !audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playClickSound() {
    initAudio();
    createSound(800, 'sine', 0.1, 0.05);
}

function playSpinSound() {
    initAudio();
    // Simulate a spinning mechanical sound with short noise bursts or low frequency pulses
    const duration = 1.5;
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            if (!isSpinning) return;
            createSound(100 + (Math.random() * 50), 'triangle', 0.05, 0.02);
        }, i * 100);
    }
}

function playWinSound(isBigWin) {
    initAudio();
    if (isBigWin) {
        // Arpeggio for big win
        [440, 554, 659, 880].forEach((freq, i) => {
            setTimeout(() => createSound(freq, 'square', 0.4, 0.05), i * 100);
        });
    } else {
        // Simple ding for small win
        createSound(600, 'sine', 0.3, 0.1);
        setTimeout(() => createSound(800, 'sine', 0.3, 0.1), 100);
    }
}

// Toggle Mute
muteToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteToggleBtn.textContent = isMuted ? '🔇' : '🔊';
});

// User must interact to start AudioContext
document.body.addEventListener('click', () => {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });
