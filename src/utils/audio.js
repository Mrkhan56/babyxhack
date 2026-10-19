// Web Audio API Synthesizer & Ambient Lullaby Engine for Pip the Skull Baby's Nursery
// Built-in pentatonic tuning and rich acoustic-modeled sound effects (music box celesta,
// tactile wood blocks, parchment page turns, starlight sparkles, and celestial chords).

let audioCtx = null;
const soundListeners = [];

// LocalStorage persistence key
const STORAGE_KEY = 'pip_ambient_sound_enabled';

// Initialize state from localStorage (defaults to false until user interacts or explicitly enables)
function getInitialSoundState() {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  } catch {
    return false;
  }
}

let isSoundActive = getInitialSoundState();

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return isSoundActive;
}

export function isAudioMuted() {
  return !isSoundActive;
}

export function onSoundChange(listener) {
  soundListeners.push(listener);
  return () => {
    const idx = soundListeners.indexOf(listener);
    if (idx > -1) soundListeners.splice(idx, 1);
  };
}

export function onMuteChange(listener) {
  const wrapped = (enabled) => listener(!enabled);
  return onSoundChange(wrapped);
}

export function setSoundEnabled(enabled) {
  isSoundActive = enabled;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Non-fatal
  }

  if (enabled) {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    startAmbientLullaby();
  } else {
    stopAmbientLullaby();
  }

  soundListeners.forEach((fn) => fn(enabled));
}

export function setAudioMuted(muted) {
  setSoundEnabled(!muted);
}

// -------------------------------------------------------------
// PENTATONIC FREQUENCIES (C Major Pentatonic & Extended Harmonics)
// -------------------------------------------------------------
export const PENTATONIC_FREQUENCIES = {
  C3: 130.81,
  G3: 196.0,
  A3: 220.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  G6: 1567.98,
};

// -------------------------------------------------------------
// AMBIENT LULLABY BACKGROUND MUSIC GENERATOR
// -------------------------------------------------------------
let ambientTimerId = null;
let droneGainNode = null;
let droneOsc1 = null;
let droneOsc2 = null;
let ambientNoteIndex = 0;

// Dreamy music box melody sequence (C major pentatonic lullaby)
const LULLABY_SEQUENCE = [
  { note: 'C4', dur: 1.1, rest: 900 },
  { note: 'E4', dur: 1.0, rest: 900 },
  { note: 'G4', dur: 1.3, rest: 1050 },
  { note: 'A4', dur: 0.9, rest: 900 },
  { note: 'G4', dur: 1.4, rest: 1250 },
  { note: 'E4', dur: 0.9, rest: 900 },
  { note: 'D4', dur: 0.9, rest: 900 },
  { note: 'C4', dur: 1.6, rest: 1450 },
  { note: 'E4', dur: 0.9, rest: 900 },
  { note: 'G4', dur: 1.1, rest: 900 },
  { note: 'C5', dur: 1.5, rest: 1350 },
  { note: 'A4', dur: 0.9, rest: 900 },
  { note: 'G4', dur: 1.2, rest: 1050 },
  { note: 'E4', dur: 0.9, rest: 900 },
  { note: 'D4', dur: 1.2, rest: 1150 },
  { note: 'C4', dur: 1.8, rest: 1900 },
];

function playAmbientNote(noteName, duration = 1.0) {
  if (!isSoundActive) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  try {
    const freq = PENTATONIC_FREQUENCIES[noteName] || 440;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.002, now);

    const pluck = ctx.createOscillator();
    const pluckGain = ctx.createGain();
    pluck.type = 'sine';
    pluck.frequency.setValueAtTime(freq * 3.98, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.055, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.018, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    pluckGain.gain.setValueAtTime(0.0001, now);
    pluckGain.gain.exponentialRampToValueAtTime(0.012, now + 0.003);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    pluck.connect(pluckGain);
    pluckGain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + duration);

    osc2.start(now);
    osc2.stop(now + duration * 0.7);

    pluck.start(now);
    pluck.stop(now + 0.05);
  } catch {
    // Non-fatal
  }
}

function startAmbientDrone() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;
  if (droneOsc1 || droneOsc2) return;

  try {
    const now = ctx.currentTime;
    droneGainNode = ctx.createGain();
    droneGainNode.gain.setValueAtTime(0.0001, now);
    droneGainNode.gain.exponentialRampToValueAtTime(0.014, now + 2.5);

    droneOsc1 = ctx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(PENTATONIC_FREQUENCIES.C3, now);

    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(PENTATONIC_FREQUENCIES.G3, now);

    droneOsc1.connect(droneGainNode);
    droneOsc2.connect(droneGainNode);
    droneGainNode.connect(ctx.destination);

    droneOsc1.start(now);
    droneOsc2.start(now);
  } catch {
    // Non-fatal
  }
}

function stopAmbientDrone() {
  if (droneGainNode && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      droneGainNode.gain.setValueAtTime(droneGainNode.gain.value, now);
      droneGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    } catch {
      // Non-fatal
    }
  }

  setTimeout(() => {
    if (droneOsc1) {
      try {
        droneOsc1.stop();
        droneOsc1.disconnect();
      } catch {}
      droneOsc1 = null;
    }
    if (droneOsc2) {
      try {
        droneOsc2.stop();
        droneOsc2.disconnect();
      } catch {}
      droneOsc2 = null;
    }
    if (droneGainNode) {
      try {
        droneGainNode.disconnect();
      } catch {}
      droneGainNode = null;
    }
  }, 650);
}

export function startAmbientLullaby() {
  if (!isSoundActive) return;
  if (ambientTimerId !== null) return;

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  startAmbientDrone();

  const step = () => {
    if (!isSoundActive) {
      stopAmbientLullaby();
      return;
    }

    const currentItem = LULLABY_SEQUENCE[ambientNoteIndex % LULLABY_SEQUENCE.length];
    playAmbientNote(currentItem.note, currentItem.dur);
    ambientNoteIndex = (ambientNoteIndex + 1) % LULLABY_SEQUENCE.length;

    ambientTimerId = window.setTimeout(step, currentItem.rest);
  };

  step();
}

export function stopAmbientLullaby() {
  if (ambientTimerId !== null) {
    clearTimeout(ambientTimerId);
    ambientTimerId = null;
  }
  stopAmbientDrone();
}

export function isAmbientLullabyPlaying() {
  return isSoundActive && ambientTimerId !== null;
}

// -------------------------------------------------------------
// CORE SOUND EFFECTS ENGINE
// -------------------------------------------------------------

export function playTone(freq, type = 'sine', duration = 0.5, volume = 0.18) {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Non-fatal
  }
}

export function playChimeNote(noteName, duration = 0.85, volume = 0.22) {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freq = PENTATONIC_FREQUENCIES[noteName] || 440;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.003, now);

    const tick = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tick.type = 'sine';
    tick.frequency.setValueAtTime(freq * 3.99, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(volume * 0.35, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.65);

    tickGain.gain.setValueAtTime(0.0001, now);
    tickGain.gain.exponentialRampToValueAtTime(volume * 0.25, now + 0.003);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    pluckConnect(tick, tickGain, ctx);

    osc1.start(now);
    osc1.stop(now + duration);

    osc2.start(now);
    osc2.stop(now + duration * 0.65);

    tick.start(now);
    tick.stop(now + 0.045);
  } catch {
    // Non-fatal
  }
}

function pluckConnect(tick, tickGain, ctx) {
  tick.connect(tickGain);
  tickGain.connect(ctx.destination);
}

export function playWoodBlockSound(baseFreq = 260) {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.07);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
}

export function playBubblePopSound(highPitch = false) {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startFreq = highPitch ? 520 : 380;
    const endFreq = highPitch ? 980 : 720;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

export function playPageTurnSound() {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.16;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.06);
    filter.frequency.exponentialRampToValueAtTime(350, now + 0.16);
    filter.Q.setValueAtTime(1.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch {}
}

export function playStarCatchSound() {
  if (!isSoundActive) return;
  const notes = [
    { n1: PENTATONIC_FREQUENCIES.G5, n2: PENTATONIC_FREQUENCIES.C6 },
    { n1: PENTATONIC_FREQUENCIES.A5, n2: PENTATONIC_FREQUENCIES.E6 },
    { n1: PENTATONIC_FREQUENCIES.C6, n2: PENTATONIC_FREQUENCIES.G6 },
  ];
  const pair = notes[Math.floor(Math.random() * notes.length)];

  playTone(pair.n1, 'triangle', 0.22, 0.18);
  setTimeout(() => {
    playTone(pair.n2, 'sine', 0.42, 0.2);
  }, 50);
}

export function playMoonCatchSound() {
  if (!isSoundActive) return;
  const chord = [
    { f: PENTATONIC_FREQUENCIES.C5, delay: 0 },
    { f: PENTATONIC_FREQUENCIES.E5, delay: 60 },
    { f: PENTATONIC_FREQUENCIES.G5, delay: 120 },
    { f: PENTATONIC_FREQUENCIES.C6, delay: 180 },
  ];

  chord.forEach((item) => {
    setTimeout(() => {
      playTone(item.f, 'sine', 0.7, 0.22);
    }, item.delay);
  });
}

export function playHurtSound() {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {}
}

export function playPowerUpSound(type) {
  if (!isSoundActive) return;
  if (type === 'slowmo') {
    const cascade = [
      PENTATONIC_FREQUENCIES.C6,
      PENTATONIC_FREQUENCIES.A5,
      PENTATONIC_FREQUENCIES.G5,
      PENTATONIC_FREQUENCIES.E5,
    ];
    cascade.forEach((f, idx) => {
      setTimeout(() => playTone(f, 'sine', 0.45, 0.16), idx * 80);
    });
  } else {
    const rising = [
      PENTATONIC_FREQUENCIES.C4,
      PENTATONIC_FREQUENCIES.E4,
      PENTATONIC_FREQUENCIES.G4,
      PENTATONIC_FREQUENCIES.C5,
      PENTATONIC_FREQUENCIES.E5,
    ];
    rising.forEach((f, idx) => {
      setTimeout(() => playTone(f, 'triangle', 0.35, 0.18), idx * 60);
    });
  }
}

export function playGameOverSound() {
  if (!isSoundActive) return;
  const notes = [
    { f: PENTATONIC_FREQUENCIES.A4, d: 350 },
    { f: PENTATONIC_FREQUENCIES.G4, d: 450 },
    { f: PENTATONIC_FREQUENCIES.E4, d: 550 },
    { f: PENTATONIC_FREQUENCIES.C4, d: 850 },
  ];

  notes.forEach((item, idx) => {
    setTimeout(() => {
      playTone(item.f, 'sine', item.d / 1000, 0.18);
    }, idx * 240);
  });
}

export function playVictoryFanfare() {
  if (!isSoundActive) return;
  const arpeggio = [
    PENTATONIC_FREQUENCIES.C5,
    PENTATONIC_FREQUENCIES.E5,
    PENTATONIC_FREQUENCIES.G5,
    PENTATONIC_FREQUENCIES.C6,
    PENTATONIC_FREQUENCIES.E6,
  ];
  arpeggio.forEach((f, idx) => {
    setTimeout(() => {
      playTone(f, 'sine', 0.55, 0.2);
    }, idx * 75);
  });
}

export function playHeartPopSound() {
  if (!isSoundActive) return;
  playTone(PENTATONIC_FREQUENCIES.G5, 'sine', 0.16, 0.22);
  setTimeout(() => {
    playTone(PENTATONIC_FREQUENCIES.C6, 'sine', 0.38, 0.25);
  }, 70);
}

export function playStickerStampSound() {
  if (!isSoundActive) return;
  playWoodBlockSound(220);
  setTimeout(() => {
    playPageTurnSound();
  }, 40);
}

export function playTabChime() {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.03);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
}

export function playLanternResonance(warmthPercent) {
  if (!isSoundActive) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFreq = 180 + (warmthPercent / 100) * 240;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  } catch {}
}

export function playEasterEggChime() {
  if (!isSoundActive) return;
  playChimeNote('C5', 0.65, 0.22);
  setTimeout(() => playChimeNote('E5', 0.65, 0.24), 110);
  setTimeout(() => playChimeNote('G5', 0.85, 0.26), 220);
  setTimeout(() => playChimeNote('C6', 1.1, 0.28), 330);
}

export function playMelody(notes, onComplete) {
  let isCancelled = false;
  let delay = 0;
  const timeoutIds = [];

  notes.forEach((item, index) => {
    const tId = window.setTimeout(() => {
      if (isCancelled) return;
      playChimeNote(item.note, item.d / 1000);
      if (index === notes.length - 1 && onComplete) {
        window.setTimeout(() => {
          if (!isCancelled) onComplete();
        }, item.d);
      }
    }, delay);
    timeoutIds.push(tId);
    delay += item.d;
  });

  return () => {
    isCancelled = true;
    timeoutIds.forEach((id) => clearTimeout(id));
  };
}
