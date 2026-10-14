/**
 * Procedural Audio Engine for Fanculometro using Web Audio API
 * No external sound files needed!
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.tensionOsc = null;
    this.tensionGain = null;
  }

  init() {
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

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTick(pitchModifier = 1) {
    if (!this.enabled || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 * pitchModifier, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Audio fail silent
    }
  }

  startTension() {
    if (!this.enabled || !this.ctx) return;

    try {
      this.stopTension();

      this.tensionOsc = this.ctx.createOscillator();
      this.tensionGain = this.ctx.createGain();

      this.tensionOsc.type = 'sawtooth';
      this.tensionOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
      // Rise in frequency over 5 seconds
      this.tensionOsc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 4.8);

      // Low pass filter to make it rumble then hiss
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 4.8);

      this.tensionGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.tensionGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 4.5);
      this.tensionGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4.9);

      this.tensionOsc.connect(filter);
      filter.connect(this.tensionGain);
      this.tensionGain.connect(this.ctx.destination);

      this.tensionOsc.start();
    } catch (e) {
      // silent
    }
  }

  stopTension() {
    if (this.tensionOsc) {
      try {
        this.tensionOsc.stop();
        this.tensionOsc.disconnect();
      } catch (e) {}
      this.tensionOsc = null;
    }
  }

  playResultFanfare(level) {
    if (!this.enabled || !this.ctx) return;
    this.stopTension();

    try {
      const now = this.ctx.currentTime;

      if (level < 30) {
        // Zen Chime (peaceful major triad)
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.12, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 1.3);
        });
      } else if (level <= 60) {
        // Warning double chime
        [440, 554.37, 659.25].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.14, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.9);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 1.0);
        });
      } else {
        // Dramatic Alarm / Horn (DEFCON 1)
        // Two emergency buzzer blasts + gong
        const tones = [
          { f: 880, start: 0, dur: 0.18, type: 'sawtooth' },
          { f: 700, start: 0.22, dur: 0.18, type: 'sawtooth' },
          { f: 880, start: 0.44, dur: 0.25, type: 'sawtooth' },
          { f: 1046.5, start: 0.72, dur: 1.2, type: 'triangle' },
        ];

        tones.forEach(t => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = t.type;
          osc.frequency.setValueAtTime(t.f, now + t.start);
          gain.gain.setValueAtTime(0.15, now + t.start);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + t.start);
          osc.stop(now + t.start + t.dur + 0.05);
        });
      }
    } catch (e) {}
  }
}

if (typeof window !== 'undefined') {
  window.soundEngine = new SoundEngine();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SoundEngine };
}
