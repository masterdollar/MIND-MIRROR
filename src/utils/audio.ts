// Web Audio API sound synthesizer for futuristic micro-interactions

class CyberAudioController {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.25;
  private activeOscillatorNode: OscillatorNode | null = null;
  private activeGainNode: GainNode | null = null;

  constructor() {
    // Lazily initialize on first interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopFrequency();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public play(type: 'click' | 'hover' | 'success' | 'mood' | 'ripple' | 'neon' | 'ai-ping') {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (type) {
        case 'click': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(620, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
          gain.gain.setValueAtTime(this.volume * 0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }
        case 'hover': {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(840, now);
          gain.gain.setValueAtTime(this.volume * 0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;
        }
        case 'success': {
          // Dual harmonic bell
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(this.ctx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.22); // C6
          gain.gain.setValueAtTime(this.volume * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(659.25, now + 0.06); // E5
          gain2.gain.setValueAtTime(this.volume * 0.22, now + 0.06);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.start(now);
          osc.stop(now + 0.28);
          osc2.start(now + 0.06);
          osc2.stop(now + 0.3);
          break;
        }
        case 'mood': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
          gain.gain.setValueAtTime(this.volume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }
        case 'ripple': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(500, now + 0.08);
          gain.gain.setValueAtTime(this.volume * 0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
        case 'neon': {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          gain.gain.setValueAtTime(this.volume * 0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
        case 'ai-ping': {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6
          gain.gain.setValueAtTime(this.volume * 0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }
      }
    } catch {
      // Ignore audio context error gracefully
    }
  }

  public playFrequency(baseFreq: number) {
    if (!this.soundEnabled) return;
    this.stopFrequency();
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.activeOscillatorNode = this.ctx.createOscillator();
      this.activeGainNode = this.ctx.createGain();

      this.activeOscillatorNode.type = 'sine';
      this.activeOscillatorNode.frequency.setValueAtTime(baseFreq, now);

      this.activeGainNode.gain.setValueAtTime(0.001, now);
      this.activeGainNode.gain.linearRampToValueAtTime(this.volume * 0.15, now + 1.2);

      this.activeOscillatorNode.connect(this.activeGainNode);
      this.activeGainNode.connect(this.ctx.destination);

      this.activeOscillatorNode.start(now);
    } catch {
      // Ignore
    }
  }

  public stopFrequency() {
    if (this.activeGainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.activeGainNode.gain.linearRampToValueAtTime(0.001, now + 0.5);
        setTimeout(() => {
          if (this.activeOscillatorNode) {
            this.activeOscillatorNode.stop();
            this.activeOscillatorNode.disconnect();
            this.activeOscillatorNode = null;
          }
          if (this.activeGainNode) {
            this.activeGainNode.disconnect();
            this.activeGainNode = null;
          }
        }, 550);
      } catch {
        this.activeOscillatorNode = null;
        this.activeGainNode = null;
      }
    }
  }
}

export const cyberAudio = new CyberAudioController();
