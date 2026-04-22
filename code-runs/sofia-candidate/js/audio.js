/**
 * Audio module for handling sounds and BGM
 */

export class AudioController {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterGain = null;
        this.bgmOsc = null;
    }

    init() {
        if (this.ctx) return;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.startBgm();
        } catch (e) {
            console.error('Web Audio API not supported');
        }
    }

    startBgm() {
        if (!this.ctx || this.bgmOsc) return;

        const bgmGain = this.ctx.createGain();
        bgmGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        bgmGain.connect(this.masterGain);

        const playNote = (freq, time, duration) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            g.gain.setValueAtTime(0.3, time);
            g.gain.exponentialRampToValueAtTime(0.001, time + duration);
            osc.connect(g);
            g.connect(bgmGain);
            osc.start(time);
            osc.stop(time + duration);
        };

        const sequence = [
            261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
            349.23, 440.00, 523.25, 698.46  // F4, A4, C5, F5
        ];

        let nextNoteTime = this.ctx.currentTime;
        const loop = () => {
            sequence.forEach((freq, i) => {
                playNote(freq, nextNoteTime + i * 0.25, 0.2);
            });
            nextNoteTime += sequence.length * 0.25;
            this.bgmTimeout = setTimeout(loop, sequence.length * 250);
        };

        loop();
        this.bgmOsc = true; // Flag to prevent multiple loops
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 1;
        }
        return this.isMuted;
    }

    /**
     * Synthesizes a simple beep/sound if we don't have external assets.
     * Keeps it self-contained for the prototype.
     */
    playSfx(type) {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        
        osc.connect(env);
        env.connect(this.masterGain);

        const now = this.ctx.currentTime;

        switch(type) {
            case 'tweet':
                for (let i = 0; i < 3; i++) {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'sine';
                    const startTime = now + (i * 0.1);
                    osc.frequency.setValueAtTime(1500, startTime);
                    osc.frequency.exponentialRampToValueAtTime(3000, startTime + 0.05);
                    g.gain.setValueAtTime(0, startTime);
                    g.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
                    g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
                    osc.connect(g);
                    g.connect(this.masterGain);
                    osc.start(startTime);
                    osc.stop(startTime + 0.08);
                }
                break;
            case 'spin':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
                env.gain.setValueAtTime(0.1, now);
                env.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'win':
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554.37, now + 0.1);
                osc.frequency.setValueAtTime(659.25, now + 0.2);
                env.gain.setValueAtTime(0.1, now);
                env.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'bigwin':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
                env.gain.setValueAtTime(0.2, now);
                env.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
                osc.start(now);
                osc.stop(now + 1.0);
                this.playRoar(); // Trigger roar on big win
                break;
        }
    }

    playRoar() {
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        
        // Noise for the breath/texture
        const bufferSize = this.ctx.sampleRate * 1.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(1000, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 1.5);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        // Sub oscillator for the rumble
        const sub = this.ctx.createOscillator();
        sub.type = 'sawtooth';
        sub.frequency.setValueAtTime(80, now);
        sub.frequency.exponentialRampToValueAtTime(40, now + 1.5);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        sub.connect(subGain);
        subGain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 1.5);
        sub.start(now);
        sub.stop(now + 1.5);
    }
}
