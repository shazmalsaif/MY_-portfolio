/**
 * Audio Engine for Theme Switching & UI Interactions
 * Uses Web Audio API for zero-latency, high-fidelity subtle chimes
 * with graceful fallback to local audio files.
 */
class SoundEngine {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    this.lightAudio = null;
    this.darkAudio = null;
    this._initAudioElements();
  }

  _initAudioElements() {
    try {
      if (typeof Audio !== 'undefined') {
        this.lightAudio = new Audio(CONFIG.AUDIO.lightSoundPath);
        this.lightAudio.volume = CONFIG.AUDIO.volume;
        this.darkAudio = new Audio(CONFIG.AUDIO.darkSoundPath);
        this.darkAudio.volume = CONFIG.AUDIO.volume;
      }
    } catch (e) {
      console.warn('Audio element initialization skipped:', e);
    }
  }

  _getAudioContext() {
    if (!this.audioContext && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Synthesizes an organic, crystalline chime using Web Audio API
   * @param {number} primaryFreq - Fundamental frequency
   * @param {number} harmonicFreq - Overtone frequency
   * @param {number} duration - Duration in seconds (0.25 - 0.4s)
   */
  _synthesizeChime(primaryFreq, harmonicFreq, duration = 0.3) {
    const ctx = this._getAudioContext();
    if (!ctx) return false;

    const now = ctx.currentTime;
    
    // Master gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(CONFIG.AUDIO.volume, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Primary Oscillator (Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(primaryFreq, now);

    // Harmonic Oscillator (Soft Triangle/Sine)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(harmonicFreq, now);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.3, now);

    // Connect routing
    osc1.connect(masterGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Play & clean up
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    return true;
  }

  /**
   * Play Dark -> Light transition chime (Bright, uplifting, crisp)
   */
  playThemeLight() {
    if (!this.soundEnabled) return;
    
    // Try Web Audio synthesis first (659.25Hz E5, 987.77Hz B5)
    try {
      const synthesized = this._synthesizeChime(659.25, 987.77, 0.28);
      if (!synthesized && this.lightAudio) {
        this.lightAudio.currentTime = 0;
        this.lightAudio.play().catch(() => {});
      }
    } catch (e) {
      if (this.lightAudio) {
        this.lightAudio.currentTime = 0;
        this.lightAudio.play().catch(() => {});
      }
    }
  }

  /**
   * Play Light -> Dark transition chime (Warm, deeper, calming)
   */
  playThemeDark() {
    if (!this.soundEnabled) return;

    // Try Web Audio synthesis first (220.00Hz A3, 329.63Hz E4)
    try {
      const synthesized = this._synthesizeChime(220.00, 329.63, 0.32);
      if (!synthesized && this.darkAudio) {
        this.darkAudio.currentTime = 0;
        this.darkAudio.play().catch(() => {});
      }
    } catch (e) {
      if (this.darkAudio) {
        this.darkAudio.currentTime = 0;
        this.darkAudio.play().catch(() => {});
      }
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem('sound_enabled', enabled ? 'true' : 'false');
  }

  toggleSound() {
    this.setSoundEnabled(!this.soundEnabled);
    return this.soundEnabled;
  }
}

window.soundEngine = new SoundEngine();
