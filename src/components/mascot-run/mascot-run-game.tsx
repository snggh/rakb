"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { playSound } from "./audio";
import {
  FIELD,
  RUNNER,
  SPEED,
  createState,
  formatScore,
  obstacleTop,
  runnerTop,
  start,
  step,
  type GameEvent,
  type GameState,
  type Obstacle,
  type Phase,
} from "./engine";
import { ObstacleArt } from "./obstacles";
import { MascotRunner } from "./runner";
import { hiScore, soundOn } from "./storage";

/**
 * The world advances in fixed sub-steps regardless of frame rate, so a slow
 * frame (a paint hitch, a new obstacle mounting) plays out as a small skip
 * rather than a slow-motion frame. Elapsed time beyond `MAX_DT` is dropped
 * so a tab switch never teleports the runner into an obstacle.
 */
const STEP = 1 / 120;
const MAX_DT = 0.1;
/** A jump pressed this soon after a crash was meant for the crash, not for a restart. */
const RESTART_COOLDOWN_MS = 350;
/** Must match `background-size` of `.run-ground`. */
const GROUND_PATTERN = 480;

/** How long the score blinks at a milestone; matches the `run-flash` animation. */
const FLASH_MS = 800;

const JUMP_KEYS = new Set(["Space", "ArrowUp", "KeyW", " ", "w", "W"]);
const DUCK_KEYS = new Set(["ArrowDown", "KeyS", "s", "S"]);

/** Physical `code` first; `key` as a fallback for keyboards that report no code. */
function isKey(e: KeyboardEvent, keys: Set<string>): boolean {
  return keys.has(e.code) || keys.has(e.key);
}

function shadowTransform(): string {
  return `translate3d(0, ${FIELD.groundY - 4}px, 0)`;
}

function obstacleTransform(o: Obstacle): string {
  return `translate3d(${o.x.toFixed(2)}px, ${obstacleTop(o)}px, 0)`;
}

/** Keys pressed while a control has focus belong to that control. */
function isControl(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest("input, textarea, select, button, a, [contenteditable]") !== null;
}

function Cloud({ left, top }: { left: string; top: number }) {
  return (
    <svg className="run-cloud" style={{ left, top }} width="46" height="16" viewBox="0 0 46 16" aria-hidden="true">
      <path d="M9 16a7 7 0 0 1 2-13.6A9 9 0 0 1 28 4a6.5 6.5 0 0 1 9 12z" fill="currentColor" />
    </svg>
  );
}

function CloudStrip() {
  return (
    <div className="run-clouds-strip">
      <Cloud left="8%" top={26} />
      <Cloud left="38%" top={54} />
      <Cloud left="61%" top={20} />
      <Cloud left="86%" top={44} />
    </div>
  );
}

type MascotRunGameProps = {
  /** Focus the field on mount. The overlay does; the 404 page leaves focus alone. */
  autoFocus?: boolean;
  className?: string;
};

/**
 * The runner, dino-style. The engine (`./engine`) owns the rules; this
 * component owns the clock, input and drawing. Per-frame work writes
 * transforms straight to the DOM through refs; React state only changes when
 * the phase changes or an obstacle enters or leaves.
 */
export function MascotRunGame({ autoFocus = false, className }: MascotRunGameProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const obstacleEls = useRef(new Map<number, HTMLDivElement>());
  const stateRef = useRef<GameState>(createState());
  const inputRef = useRef({ jump: false, duck: false });
  const widthRef = useRef(640);
  const apiRef = useRef<{ begin: () => void; press: () => void } | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const hi = useSyncExternalStore(hiScore.subscribe, hiScore.get, () => 0);
  const sound = useSyncExternalStore(soundOn.subscribe, soundOn.get, () => false);
  const [inverted, setInverted] = useState(false);
  const [flash, setFlash] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    widthRef.current = field.clientWidth;
    const ro = new ResizeObserver(() => {
      widthRef.current = field.clientWidth;
    });
    ro.observe(field);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (autoFocus) fieldRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  /**
   * The loop, input and drawing live in one effect so they can call each
   * other freely; React only sees the state setters. Event handlers reach it
   * through `apiRef`.
   */
  useEffect(() => {
    let raf = 0;
    let last = 0;
    let overAt = 0;
    let obstacleKey = "";
    let flashTimer = 0;
    let stride = "";

    const draw = (s: GameState) => {
      const runner = runnerRef.current;
      if (runner) {
        runner.style.transform = `translate3d(0, ${runnerTop(s).toFixed(2)}px, 0)`;
        // Shorter strides as the world speeds up. Written only on change: it
        // restyles the whole runner subtree.
        const next = `${((SPEED.base / s.speed) * 0.5).toFixed(2)}s`;
        if (next !== stride) {
          stride = next;
          runner.style.setProperty("--run-stride", next);
        }
        runner.classList.toggle("is-jumping", s.y > 0);
        runner.classList.toggle("is-ducking", s.ducking);
      }
      const shadow = shadowRef.current;
      if (shadow) {
        const k = Math.max(0.4, 1 - s.y / 160);
        shadow.style.transform = `${shadowTransform()} scale(${k.toFixed(3)})`;
        shadow.style.opacity = (0.28 * k).toFixed(3);
      }
      for (const o of s.obstacles) {
        const el = obstacleEls.current.get(o.id);
        if (el) el.style.transform = obstacleTransform(o);
      }
      if (groundRef.current) {
        // One pattern width wider than the field; slides from -pattern to flush.
        groundRef.current.style.transform = `translate3d(${((s.distance % GROUND_PATTERN) - GROUND_PATTERN).toFixed(2)}px, 0, 0)`;
      }
      if (cloudsRef.current) {
        const w = widthRef.current;
        // Two strips wide; slide from one strip left of the field to flush.
        cloudsRef.current.style.transform = `translate3d(${(((s.distance * 0.25) % w) - w).toFixed(2)}px, 0, 0)`;
      }
      if (scoreRef.current) scoreRef.current.textContent = formatScore(s.score);
    };

    const onEvents = (s: GameState, events: GameEvent[]) => {
      for (const e of events) {
        switch (e) {
          case "jump":
            if (soundOn.get()) playSound("jump");
            break;
          case "milestone":
            if (soundOn.get()) playSound("milestone");
            setFlash(true);
            window.clearTimeout(flashTimer);
            flashTimer = window.setTimeout(() => setFlash(false), FLASH_MS);
            break;
          case "invert":
            setInverted(s.inverted);
            break;
          case "over":
            if (soundOn.get()) playSound("over");
            overAt = performance.now();
            hiScore.set(s.hi);
            setPhase("over");
            runnerRef.current?.classList.remove("is-running");
            runnerRef.current?.classList.add("is-dead");
            setAnnounce(`Game over. Score ${Math.floor(s.score)}, best ${s.hi}. Press space or tap to run again.`);
            break;
          default:
            break;
        }
      }
    };

    const frame = (now: number) => {
      const s = stateRef.current;
      let remaining = Math.min(MAX_DT, Math.max(0, (now - last) / 1000));
      last = now;

      // The jump is edge-triggered: only the first sub-step sees it.
      const input = { jump: inputRef.current.jump, duck: inputRef.current.duck };
      inputRef.current.jump = false;
      const events: GameEvent[] = [];
      while (remaining > 0 && s.phase === "running") {
        const dt = Math.min(STEP, remaining);
        remaining -= dt;
        events.push(...step(s, dt, input, widthRef.current));
        input.jump = false;
      }

      // Only re-render when an obstacle enters or leaves; positions are imperative.
      const key = s.obstacles.map((o) => o.id).join(",");
      if (key !== obstacleKey) {
        obstacleKey = key;
        setObstacles(s.obstacles.slice());
      }
      if (events.length) onEvents(s, events);
      draw(s);

      raf = s.phase === "running" ? requestAnimationFrame(frame) : 0;
    };

    const run = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const begin = () => {
      const s = stateRef.current;
      s.hi = Math.max(s.hi, hiScore.get());
      start(s, widthRef.current);
      obstacleKey = "";
      inputRef.current.jump = false;
      setObstacles([]);
      setInverted(false);
      setPhase("running");
      setAnnounce("");
      const runner = runnerRef.current;
      if (runner) {
        runner.classList.remove("is-dead");
        runner.classList.add("is-running");
      }
      draw(s);
      run();
    };

    const pause = () => {
      const s = stateRef.current;
      if (s.phase !== "running") return;
      s.phase = "paused";
      setPhase("paused");
      runnerRef.current?.classList.remove("is-running");
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const resume = () => {
      const s = stateRef.current;
      if (s.phase !== "paused") return;
      s.phase = "running";
      setPhase("running");
      runnerRef.current?.classList.add("is-running");
      run();
    };

    /** The one "go" input: starts, restarts, resumes, or jumps. */
    const press = () => {
      switch (stateRef.current.phase) {
        case "idle":
          begin();
          break;
        case "over":
          if (performance.now() - overAt > RESTART_COOLDOWN_MS) begin();
          break;
        case "paused":
          resume();
          break;
        case "running":
          inputRef.current.jump = true;
          break;
      }
    };

    apiRef.current = { begin, press };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isControl(e.target)) return;
      if (isKey(e, JUMP_KEYS)) {
        e.preventDefault();
        if (!e.repeat) press();
      } else if (isKey(e, DUCK_KEYS)) {
        e.preventDefault();
        inputRef.current.duck = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (isKey(e, DUCK_KEYS)) inputRef.current.duck = false;
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") pause();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(flashTimer);
      if (raf) cancelAnimationFrame(raf);
      apiRef.current = null;
    };
  }, []);

  const onFieldPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest("button")) return;
    e.preventDefault();
    fieldRef.current?.focus({ preventScroll: true });
    apiRef.current?.press();
  };

  const duckOn = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current.duck = true;
  };
  const duckOff = () => {
    inputRef.current.duck = false;
  };

  const toggleSound = () => {
    const next = !sound;
    soundOn.set(next);
    if (next) playSound("milestone");
  };

  return (
    <div
      ref={fieldRef}
      className={`run-field${className ? ` ${className}` : ""}`}
      data-phase={phase}
      data-inverted={inverted ? "" : undefined}
      role="application"
      aria-label="Mascot run. Space, up arrow or tap to jump; down arrow to duck."
      tabIndex={0}
      onPointerDown={onFieldPointerDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="run-sky" aria-hidden="true">
        <div ref={cloudsRef} className="run-clouds">
          <CloudStrip />
          <CloudStrip />
        </div>
      </div>
      <div className="run-ground-line" aria-hidden="true">
        <div ref={groundRef} className="run-ground" />
      </div>
      <div ref={shadowRef} className="run-shadow" aria-hidden="true" style={{ transform: shadowTransform() }} />

      {obstacles.map((o) => (
        <div
          key={o.id}
          ref={(el) => {
            if (el) obstacleEls.current.set(o.id, el);
            else obstacleEls.current.delete(o.id);
          }}
          className="run-obstacle"
          style={{ transform: obstacleTransform(o) }}
        >
          <ObstacleArt kind={o.kind} legend={o.legend} />
        </div>
      ))}

      <div
        ref={runnerRef}
        className="run-runner"
        style={{ transform: `translate3d(0, ${FIELD.groundY - RUNNER.height}px, 0)` }}
      >
        <div className="run-runner-pose">
          <MascotRunner />
        </div>
      </div>

      <div className="run-hud">
        <span className="run-hud-scores" aria-hidden="true">
          {hi > 0 ? <span className="run-hi">HI {formatScore(hi)}</span> : null}
          <span ref={scoreRef} className={`run-score${flash ? " is-flash" : ""}`}>
            {formatScore(0)}
          </span>
        </span>
        <button type="button" className="run-sound" aria-pressed={sound} onClick={toggleSound}>
          Sound {sound ? "on" : "off"}
        </button>
      </div>

      {phase === "idle" ? (
        <div className="run-prompt">
          <span className="run-prompt-text run-only-fine">Press space or tap to run</span>
          <span className="run-prompt-text run-only-coarse">Tap to run</span>
        </div>
      ) : null}
      {phase === "paused" ? (
        <div className="run-prompt">
          <span className="run-prompt-text">Paused · press space or tap to continue</span>
        </div>
      ) : null}
      {phase === "over" ? (
        <div className="run-prompt">
          <span className="run-prompt-title">Game over</span>
          <button type="button" className="run-restart" onClick={() => apiRef.current?.begin()} aria-label="Play again">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M14.5 9a5.5 5.5 0 1 1-1.6-3.9M14.5 2.5v3.2h-3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className="run-duck"
        aria-label="Hold to duck"
        onPointerDown={duckOn}
        onPointerUp={duckOff}
        onPointerCancel={duckOff}
        onPointerLeave={duckOff}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
