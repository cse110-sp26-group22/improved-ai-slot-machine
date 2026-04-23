/**
 * @fileoverview Manages all audio for the slot machine game using the Web Audio API,
 * generating pirate-themed sounds and music.
 */

let audioContext;
let masterGain;
let isInitialized = false;
let musicLoop;

const sounds = {};

/**
 * Initializes the AudioContext after a user interaction.
 */
export function initAudio() {
    if (isInitialized) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        isInitialized = true;
        createAllSounds();
        playBackgroundMusic(); // Start music loop on init
    } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
    }
}

/**
 * Toggles the master volume on or off.
 * @param {boolean} isMuted - Whether the audio should be muted.
 */
export function toggleMute(isMuted) {
    if (!isInitialized) return;
    masterGain.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
}

/**
 * Creates all the sound effects used in the game.
 */
function createAllSounds() {
    // --- MECHANICAL SOUNDS ---

    sounds['spin'] = () => {
        // Lever pull sound
        const lever = audioContext.createOscillator();
        const leverGain = audioContext.createGain();
        lever.type = 'sawtooth';
        lever.frequency.setValueAtTime(120, audioContext.currentTime);
        lever.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.2);
        leverGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        leverGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
        lever.connect(leverGain);
        leverGain.connect(masterGain);
        lever.start();
        lever.stop(audioContext.currentTime + 0.2);
    };
    
    sounds['reel-stop'] = () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, audioContext.currentTime);
        gain.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(audioContext.currentTime + 0.1);
    };

    // --- WIN SOUNDS ---

    const createCannonBoom = (time, volume) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, time);
        osc.frequency.exponentialRampToValueAtTime(20, time + 0.8);
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01 * volume, time + 0.8);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.8);
    };

    sounds['small-win'] = () => {
        // Coin clinks
        for (let i = 0; i < 3; i++) {
            const time = audioContext.currentTime + i * 0.05;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200 + i * 150, time);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.15);
        }
    };

    sounds['big-win'] = () => {
        // Brass fanfare
        const notes = [392, 494, 587]; // G, B, D
        notes.forEach((note, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note, audioContext.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0.25, audioContext.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(audioContext.currentTime + i * 0.1);
            osc.stop(audioContext.currentTime + 0.5);
        });
        // Cannon
        createCannonBoom(audioContext.currentTime + 0.2, 0.8);
    };

    sounds['jackpot'] = () => {
        sounds['big-win']();
        // Shimmering arpeggio
        for (let i = 0; i < 8; i++) {
            const time = audioContext.currentTime + 0.3 + i * 0.08;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880 * Math.pow(2, i/12), time);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.2);
        }
        // Multiple cannons
        createCannonBoom(audioContext.currentTime + 0.5, 0.9);
        createCannonBoom(audioContext.currentTime + 0.8, 0.7);
    };
}

/**
 * Plays a sound by its name.
 * @param {string} soundName - The name of the sound to play.
 */
export function playSound(soundName) {
    if (!isInitialized || !sounds[soundName]) return;
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    sounds[soundName]();
}

/**
 * Plays a looping pirate-themed background music track.
 */
function playBackgroundMusic() {
    if (!isInitialized) return;
    
    // 6/8 time signature sea shanty feel
    const tempo = 140;
    const eighthNote = 60 / tempo / 2;
    const sequence = [
        { note: 587.33, duration: 2 }, // D5
        { note: 698.46, duration: 1 }, // F5
        { note: 698.46, duration: 2 }, // F5
        { note: 783.99, duration: 1 }, // G5
        { note: 783.99, duration: 2 }, // G5
        { note: 880.00, duration: 1 }, // A5
        { note: 783.99, duration: 2 }, // G5
        { note: 698.46, duration: 4 }, // F5
    ];
    let nextNoteTime = audioContext.currentTime + 0.1;

    const scheduleNote = () => {
        const isMuted = masterGain.gain.value === 0;

        for (const item of sequence) {
            if (!isMuted) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.15, nextNoteTime);
                gain.gain.exponentialRampToValueAtTime(0.01, nextNoteTime + item.duration * eighthNote - 0.05);
                osc.frequency.setValueAtTime(item.note, nextNoteTime);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(nextNoteTime);
                osc.stop(nextNoteTime + item.duration * eighthNote);
            }
            nextNoteTime += item.duration * eighthNote;
        }
    };
    
    const loop = () => {
        const now = audioContext.currentTime;
        while (nextNoteTime < now + 0.1) {
            scheduleNote();
        }
        musicLoop = setTimeout(loop, 100);
    };

    loop();
}
