/**
 * Web Audio API synthesizer for Birthday Music Box & Sound Effects.
 * Reliable, zero external audio asset dependencies, crisp & charming!
 */

// Happy Birthday melody notes and durations (in beats)
// Key of C major / G major
export interface MelodyNote {
  note: string;
  freq: number;
  duration: number; // in beats
}

// Standard frequencies for notes
export const NOTE_FREQS: Record<string, number> = {
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.33,
  'E5': 659.25,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'A5': 880.00,
  'B5': 987.77,
  'C6': 1046.50,
};

// "Happy Birthday to you" song notes
export const HAPPY_BIRTHDAY_MELODY: MelodyNote[] = [
  { note: 'G4', freq: 392.00, duration: 0.75 },
  { note: 'G4', freq: 392.00, duration: 0.25 },
  { note: 'A4', freq: 440.00, duration: 1.0 },
  { note: 'G4', freq: 392.00, duration: 1.0 },
  { note: 'C5', freq: 523.25, duration: 1.0 },
  { note: 'B4', freq: 493.88, duration: 2.0 },

  { note: 'G4', freq: 392.00, duration: 0.75 },
  { note: 'G4', freq: 392.00, duration: 0.25 },
  { note: 'A4', freq: 440.00, duration: 1.0 },
  { note: 'G4', freq: 392.00, duration: 1.0 },
  { note: 'D5', freq: 587.33, duration: 1.0 },
  { note: 'C5', freq: 523.25, duration: 2.0 },

  { note: 'G4', freq: 392.00, duration: 0.75 },
  { note: 'G4', freq: 392.00, duration: 0.25 },
  { note: 'G5', freq: 783.99, duration: 1.0 },
  { note: 'E5', freq: 659.25, duration: 1.0 },
  { note: 'C5', freq: 523.25, duration: 1.0 },
  { note: 'B4', freq: 493.88, duration: 1.0 },
  { note: 'A4', freq: 440.00, duration: 1.5 },

  { note: 'F5', freq: 698.46, duration: 0.75 },
  { note: 'F5', freq: 698.46, duration: 0.25 },
  { note: 'E5', freq: 659.25, duration: 1.0 },
  { note: 'C5', freq: 523.25, duration: 1.0 },
  { note: 'D5', freq: 587.33, duration: 1.0 },
  { note: 'C5', freq: 523.25, duration: 2.5 },
];

class SoundManager {
  private ctx: AudioContext | null = null;
  private isPlayingMelody: boolean = false;
  private currentTimeout: number | null = null;
  private currentNoteIndex: number = 0;
  private tempoBpm: number = 100;
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getPlaying(): boolean {
    return this.isPlayingMelody;
  }

  // Play a music box chime note
  public playMusicBoxNote(freq: number, durationSec: number = 0.6) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Primary bell tone (sine)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Harmonic bell shimmer (sine 2x)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.005, now);

    // Envelope for dreamy music box: immediate strike, gentle decay
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.0005, now + (durationSec * 0.7));

    osc1.connect(gain1);
    gain1.connect(this.masterGain);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + durationSec);
    osc2.stop(now + durationSec);
  }

  // Start playing the Happy Birthday melody in loop
  public startMelody() {
    this.initContext();
    if (this.isPlayingMelody) return;
    this.isPlayingMelody = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  public stopMelody() {
    this.isPlayingMelody = false;
    if (this.currentTimeout !== null) {
      window.clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public toggleMelody(): boolean {
    if (this.isPlayingMelody) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  private scheduleNextNote() {
    if (!this.isPlayingMelody) return;

    const note = HAPPY_BIRTHDAY_MELODY[this.currentNoteIndex];
    const beatSec = 60 / this.tempoBpm;
    const noteDurationSec = note.duration * beatSec;

    this.playMusicBoxNote(note.freq, Math.max(0.4, noteDurationSec * 1.2));

    this.currentNoteIndex = (this.currentNoteIndex + 1) % HAPPY_BIRTHDAY_MELODY.length;

    // Pause slightly longer at end of verse before repeating
    const delay = this.currentNoteIndex === 0 
      ? (noteDurationSec + 1.2) * 1000 
      : noteDurationSec * 1000;

    this.currentTimeout = window.setTimeout(() => {
      this.scheduleNextNote();
    }, delay);
  }

  // Sound Effect: Confetti Cannon Pop
  public playConfettiPop() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Pop thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.15);

    // Glitter shimmer
    setTimeout(() => {
      this.playChimeSparkle();
    }, 120);
  }

  // Sound Effect: Chime Sparkle (Celesta/Glockenspiel burst)
  public playChimeSparkle() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const chimes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chimes.forEach((f, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(f, 0.45);
      }, idx * 70);
    });
  }

  // Sound Effect: Candle blow out (breath / wind swoosh)
  public playBlowCandle() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);
    filter.Q.setValueAtTime(2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.4);

    // After blow, play magical sparkle
    setTimeout(() => {
      this.playChimeSparkle();
    }, 380);
  }

  // Sound Effect: Love Heart / Like pop
  public playHeartSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }
}

export const soundManager = new SoundManager();
