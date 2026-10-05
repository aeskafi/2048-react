// Web Audio API Synthesizer for 2048 sound effects
// Zero external asset dependencies, zero network latency, 100% offline

class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = false;
        try {
            const saved = localStorage.getItem('2048_sound_muted');
            if (saved !== null) {
                this.muted = JSON.parse(saved);
            }
        } catch (e) {
            this.muted = false;
        }
    }

    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        try {
            localStorage.setItem('2048_sound_muted', JSON.stringify(this.muted));
        } catch (e) {}
        if (!this.muted) {
            this.playClick();
        }
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }

    playMove() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playMerge(value = 4) {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Pitch scales smoothly with higher merged values
        const power = Math.min(11, Math.max(1, Math.log2(value)));
        const baseFreq = 220 * Math.pow(1.08, power * 1.5);

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

        osc2.frequency.setValueAtTime(baseFreq * 2, now);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 3, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
    }

    playWin() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const start = now + idx * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.25);
        });
    }

    playGameOver() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [330, 294, 261, 196];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const start = now + idx * 0.14;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.15, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.22);
        });
    }

    playClick() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    }
}

export const sound = new SoundController();
