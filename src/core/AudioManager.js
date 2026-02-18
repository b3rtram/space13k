export default class AudioManager {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.thrustNode = null;
    this.thrustGain = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.fuelWarningInterval = null;
    this.fuelWarningActive = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.initialized = true;
      this._setupAmbient();
    } catch {
      // Web Audio not supported
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _ensureContext() {
    if (!this.initialized) this.init();
    this.resume();
    return this.ctx;
  }

  // Ambient drone - low frequency hum
  _setupAmbient() {
    const ctx = this.ctx;
    if (!ctx) return;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0.03;
    this.ambientGain.connect(ctx.destination);

    this.ambientNode = ctx.createOscillator();
    this.ambientNode.type = 'sine';
    this.ambientNode.frequency.value = 55;
    this.ambientNode.connect(this.ambientGain);
    this.ambientNode.start();
  }

  // Thrust sound - filtered white noise
  startThrust() {
    const ctx = this._ensureContext();
    if (!ctx || this.thrustNode) return;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.thrustNode = ctx.createBufferSource();
    this.thrustNode.buffer = noiseBuffer;
    this.thrustNode.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1.5;

    this.thrustGain = ctx.createGain();
    this.thrustGain.gain.value = 0;
    this.thrustGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);

    this.thrustNode.connect(filter);
    filter.connect(this.thrustGain);
    this.thrustGain.connect(ctx.destination);
    this.thrustNode.start();
  }

  stopThrust() {
    if (!this.thrustNode || !this.ctx) return;

    try {
      this.thrustGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
      const node = this.thrustNode;
      setTimeout(() => {
        try { node.stop(); } catch { /* already stopped */ }
      }, 150);
    } catch { /* ignore */ }

    this.thrustNode = null;
    this.thrustGain = null;
  }

  // Collision - noise burst with fast decay
  playCollision() {
    const ctx = this._ensureContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.3);
  }

  // Wormhole entry - frequency sweep
  playWormholeEntry() {
    const ctx = this._ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  // Fuel warning beep - gets faster as fuel decreases
  updateFuelWarning(fuel) {
    const ctx = this._ensureContext();
    if (!ctx) return;

    if (fuel < 1 && fuel > 0) {
      if (!this.fuelWarningActive) {
        this.fuelWarningActive = true;
        this._playFuelBeep();
      }
    } else {
      this.fuelWarningActive = false;
      if (this.fuelWarningInterval) {
        clearTimeout(this.fuelWarningInterval);
        this.fuelWarningInterval = null;
      }
    }
  }

  _playFuelBeep() {
    if (!this.fuelWarningActive || !this.ctx) return;

    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 880;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);

    // Schedule next beep (faster when less fuel)
    this.fuelWarningInterval = setTimeout(() => this._playFuelBeep(), 400);
  }

  // Fuel pickup sound
  playPickup() {
    const ctx = this._ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  destroy() {
    this.stopThrust();
    this.fuelWarningActive = false;
    if (this.fuelWarningInterval) {
      clearTimeout(this.fuelWarningInterval);
    }
    if (this.ambientNode) {
      try { this.ambientNode.stop(); } catch { /* ignore */ }
    }
    if (this.ctx) {
      this.ctx.close();
    }
  }
}
