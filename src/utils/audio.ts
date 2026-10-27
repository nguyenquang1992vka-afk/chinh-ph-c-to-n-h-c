// Audio synthesizer using Web Audio API and Speech Synthesis for Vietnamese EdTech

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  try {
    localStorage.setItem("sound_enabled", enabled ? "1" : "0");
  } catch {}
}

export function isSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem("sound_enabled");
    if (val !== null) return val === "1";
  } catch {}
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Play Star Earned Sparkle
export function playStarSound() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
  });
}

// 2. Play Correct Answer Ding
export function playCorrectSound() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.45);
}

// 3. Play Gentle Try-Again Sound
export function playIncorrectSound() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
  osc.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 0.25); // C4

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

// 4. Play Fanfare / Level Complete
export function playFanfareSound() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 523.25, time: 0, dur: 0.15 },
    { freq: 659.25, time: 0.15, dur: 0.15 },
    { freq: 783.99, time: 0.30, dur: 0.2 },
    { freq: 1046.5, time: 0.55, dur: 0.45 },
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

    gain.gain.setValueAtTime(0.2, ctx.currentTime + note.time);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + note.time);
    osc.stop(ctx.currentTime + note.time + note.dur + 0.05);
  });
}

// 5. Vietnamese Text-to-Speech for Robot "Sao Sáng AI"
export function speakVietnamese(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!isSoundEnabled() || !text) {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = text.replace(/[*#_`]/g, " ").trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Find Vietnamese voice if available
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find((v) => v.lang.includes("vi") || v.lang.includes("VN"));
  if (viVoice) {
    utterance.voice = viVoice;
  }
  utterance.lang = "vi-VN";
  utterance.rate = 1.0;
  utterance.pitch = 1.1; // slightly cheerful / child-friendly pitch

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
