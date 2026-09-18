/**
 * Tiny synthesised sound effects for the runner. No assets: three oscillator
 * blips built on first use, after a user gesture, so autoplay policy is happy.
 */

export type SoundName = "jump" | "milestone" | "over";

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Note = { type: OscillatorType; from: number; to: number; at: number; dur: number; gain: number };

const SOUNDS: Record<SoundName, Note[]> = {
  jump: [{ type: "square", from: 320, to: 560, at: 0, dur: 0.09, gain: 0.05 }],
  milestone: [
    { type: "square", from: 660, to: 660, at: 0, dur: 0.07, gain: 0.04 },
    { type: "square", from: 880, to: 880, at: 0.09, dur: 0.09, gain: 0.04 },
  ],
  over: [{ type: "sawtooth", from: 220, to: 90, at: 0, dur: 0.38, gain: 0.05 }],
};

export function playSound(name: SoundName): void {
  const ac = context();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of SOUNDS[name]) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = n.type;
    osc.frequency.setValueAtTime(n.from, now + n.at);
    osc.frequency.linearRampToValueAtTime(n.to, now + n.at + n.dur);
    gain.gain.setValueAtTime(n.gain, now + n.at);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + n.at + n.dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(now + n.at);
    osc.stop(now + n.at + n.dur + 0.02);
  }
}
