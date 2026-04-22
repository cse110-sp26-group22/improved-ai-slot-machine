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
                break;
        }
    }
}
