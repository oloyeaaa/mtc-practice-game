let audioCtx: AudioContext | null = null;

export function ensureAudio(): void {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', vol = 0.1): void {
  ensureAudio();
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + duration);
}

export function sfxCorrect(): void {
  playTone(523, 0.1);
  setTimeout(() => playTone(659, 0.1), 80);
  setTimeout(() => playTone(784, 0.15), 160);
}

export function sfxWrong(): void {
  playTone(200, 0.2, 'sawtooth', 0.07);
  setTimeout(() => playTone(160, 0.3, 'sawtooth', 0.05), 150);
}

export function sfxHit(): void {
  playTone(300, 0.08, 'sawtooth', 0.09);
}

export function sfxDefeat(): void {
  playTone(523, 0.12);
  setTimeout(() => playTone(659, 0.12), 100);
  setTimeout(() => playTone(784, 0.12), 200);
  setTimeout(() => playTone(1047, 0.2), 300);
}

export function sfxLevelUp(): void {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.15, 'square', 0.09), i * 120)
  );
}

export function sfxPress(): void {
  playTone(440, 0.03, 'square', 0.03);
}

export function sfxHatch(): void {
  [400, 500, 600, 700, 800, 1000].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.12, 'square', 0.07), i * 100)
  );
}

export function sfxAchievement(): void {
  [659, 784, 1047, 1319].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.15, 'square', 0.08), i * 100)
  );
}
