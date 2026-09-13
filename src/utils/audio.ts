// Web Audio Synthesizer for Vietnamese Traditional Bronze Bell & Ambient Soundscape

let audioCtx: AudioContext | null = null;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChime(freq = 432) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2.02, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 3.3);
    osc2.stop(now + 2.1);
  } catch (err) {
    console.warn("Audio chime error:", err);
  }
}

export function toggleAmbient(on: boolean) {
  try {
    const ctx = getAudioContext();
    if (!on) {
      if (ambientGain) {
        ambientGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
      }
      return false;
    }

    if (!ambientOscillator) {
      ambientOscillator = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      ambientGain = ctx.createGain();

      ambientOscillator.type = "sine";
      ambientOscillator.frequency.setValueAtTime(108, ctx.currentTime);

      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(216, ctx.currentTime);

      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambientGain.gain.setTargetAtTime(0.045, ctx.currentTime, 1.2);

      ambientOscillator.connect(ambientGain);
      oscHarmonic.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOscillator.start();
      oscHarmonic.start();
    } else if (ambientGain) {
      ambientGain.gain.setTargetAtTime(0.045, ctx.currentTime, 0.6);
    }
    return true;
  } catch (err) {
    console.warn("Audio ambient error:", err);
    return false;
  }
}
