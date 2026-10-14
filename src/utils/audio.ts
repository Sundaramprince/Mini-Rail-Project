/**
 * Synthesizes the authentic Indian Railways chime using Web Audio API.
 * Tri-tone melodic chime: G4 -> C5 -> E5
 */
export function playRailwayChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [
      { freq: 392.00, time: 0.0, dur: 0.45 }, // G4
      { freq: 523.25, time: 0.35, dur: 0.5 }, // C5
      { freq: 659.25, time: 0.75, dur: 0.8 }, // E5
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + note.time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    });
  } catch (err) {
    console.warn('Audio playback unsupported or blocked:', err);
  }
}
