/**
 * Pure rules for the mascot runner: no DOM, no React, no timers.
 *
 * The component owns the clock and the drawing; this module owns the world.
 * Everything is in "field pixels": the field is `FIELD.height` tall, the ground
 * line sits at `FIELD.groundY` from the top, and the runner stands with its
 * feet on that line. The field is as wide as its container.
 */

export const FIELD = { height: 240, groundY: 210 } as const;

/**
 * The runner's box on the field. It stands `inset` px from the right edge
 * (the mascot faces left, so the world scrolls left to right) with its feet
 * on the ground line.
 */
export const RUNNER = { inset: 24, width: 120, height: 96 } as const;

export function runnerLeft(fieldWidth: number): number {
  return fieldWidth - RUNNER.inset - RUNNER.width;
}

export const PHYSICS = {
  /** px/s² */
  gravity: 2400,
  /**
   * px/s upward at take-off: apex ≈ v²/2g ≈ 99px, ~0.58s in the air, which
   * at base speed is ~196px of ground: enough to clear the widest obstacle
   * plus the runner's own feet with a fair timing window, without floating.
   */
  jumpVelocity: 690,
  /** px/s downward when the player ducks mid-air (dino's "speed drop"). */
  dropVelocity: 900,
} as const;

export const SPEED = { base: 340, max: 720, perPoint: 0.25 } as const;

/** ≈ 10 points per second at base speed, like the original. */
export const SCORE_PER_PX = 0.028;
export const MILESTONE = 100;
export const INVERT_EVERY = 500;

export type Box = { x: number; y: number; w: number; h: number };

/**
 * Hit boxes relative to the runner's top-left, measured off the artwork and
 * inset generously so brushing an obstacle with the open hand, the fist or
 * a shoe tip is forgiven, as in the original.
 */
export const RUNNER_BOXES: Record<"standing" | "ducking", readonly Box[]> = {
  standing: [
    { x: 40, y: 8, w: 48, h: 60 },
    { x: 30, y: 72, w: 56, h: 20 },
  ],
  // The duck squashes the runner to 60% height and 110% width about its feet.
  ducking: [
    { x: 38, y: 43, w: 53, h: 36 },
    { x: 27, y: 82, w: 62, h: 12 },
  ],
};

export type ObstacleKind = "cap1" | "cap2" | "cap3" | "stack" | "bar" | "switch" | "puller";

export type Obstacle = {
  id: number;
  kind: ObstacleKind;
  /** Left edge on screen, in field px. Obstacles enter at the left and travel right. */
  x: number;
  /** Bottom edge, in px above the ground line. */
  bottom: number;
  w: number;
  h: number;
  /** Extra scroll speed on top of the world speed (flying things drift). */
  vx: number;
  /** Keycap legends, one per cap, so the art can be deterministic. */
  legend: string;
  boxes: readonly Box[];
};

type ObstacleSpec = {
  w: number;
  h: number;
  /** Score before this kind can appear. */
  minScore: number;
  weight: number;
  boxes: readonly Box[];
};

const inset = (w: number, h: number, i: number): Box => ({ x: i, y: i, w: w - i * 2, h: h - i * 2 });

export const OBSTACLES: Record<ObstacleKind, ObstacleSpec> = {
  cap1: { w: 34, h: 34, minScore: 0, weight: 5, boxes: [inset(34, 34, 3)] },
  cap2: { w: 70, h: 34, minScore: 0, weight: 4, boxes: [inset(70, 34, 3)] },
  bar: { w: 80, h: 22, minScore: 0, weight: 3, boxes: [inset(80, 22, 3)] },
  switch: { w: 34, h: 40, minScore: 0, weight: 4, boxes: [{ x: 3, y: 14, w: 28, h: 23 }, { x: 12, y: 2, w: 10, h: 14 }] },
  cap3: { w: 106, h: 34, minScore: 250, weight: 3, boxes: [inset(106, 34, 3)] },
  stack: { w: 34, h: 66, minScore: 150, weight: 3, boxes: [inset(34, 66, 3)] },
  puller: { w: 48, h: 28, minScore: 300, weight: 4, boxes: [{ x: 6, y: 6, w: 36, h: 16 }] },
};

/**
 * Where a puller can fly, in px above the ground: low (jump over it), mid
 * (duck under it) and high (just keep running).
 */
export const PULLER_HEIGHTS = [14, 66, 104] as const;

const LEGENDS = "RAKB";

export type Phase = "idle" | "running" | "paused" | "over";

export type GameState = {
  phase: Phase;
  /** Seconds spent running this round. */
  t: number;
  /** World px scrolled this round. */
  distance: number;
  speed: number;
  score: number;
  hi: number;
  /** Runner height above the ground line, px (>= 0). */
  y: number;
  /** Runner vertical velocity, px/s, positive is up. */
  vy: number;
  ducking: boolean;
  inverted: boolean;
  obstacles: Obstacle[];
  nextSpawnAt: number;
  nextId: number;
  lastMilestone: number;
};

export type GameEvent = "start" | "jump" | "milestone" | "invert" | "over";

/** What the player is asking for this frame. Edge-triggered flags are consumed. */
export type Input = {
  jump: boolean;
  duck: boolean;
};

export function createState(hi = 0): GameState {
  return {
    phase: "idle",
    t: 0,
    distance: 0,
    speed: SPEED.base,
    score: 0,
    hi,
    y: 0,
    vy: 0,
    ducking: false,
    inverted: false,
    obstacles: [],
    nextSpawnAt: 0,
    nextId: 1,
    lastMilestone: 0,
  };
}

export function start(s: GameState, fieldWidth: number): void {
  const hi = Math.max(s.hi, Math.floor(s.score));
  Object.assign(s, createState(hi), { phase: "running" as Phase });
  // A short grace run before the first obstacle, like the original.
  s.nextSpawnAt = Math.max(fieldWidth * 0.6, 260) + 80;
}

export function onGround(s: GameState): boolean {
  return s.y <= 0;
}

function pickKind(s: GameState, rng: () => number): ObstacleKind {
  const pool = (Object.keys(OBSTACLES) as ObstacleKind[]).filter((k) => OBSTACLES[k].minScore <= s.score);
  const total = pool.reduce((sum, k) => sum + OBSTACLES[k].weight, 0);
  let r = rng() * total;
  for (const k of pool) {
    r -= OBSTACLES[k].weight;
    if (r <= 0) return k;
  }
  return pool[pool.length - 1];
}

function spawn(s: GameState, fieldWidth: number, rng: () => number): void {
  const kind = pickKind(s, rng);
  const spec = OBSTACLES[kind];
  const id = s.nextId++;
  const caps = kind === "cap2" ? 2 : kind === "cap3" ? 3 : kind === "stack" ? 2 : 1;
  const first = Math.floor(rng() * LEGENDS.length);
  let legend = "";
  for (let i = 0; i < caps; i++) legend += LEGENDS[(first + i) % LEGENDS.length];

  s.obstacles.push({
    id,
    kind,
    x: -spec.w - 12,
    bottom: kind === "puller" ? PULLER_HEIGHTS[Math.floor(rng() * PULLER_HEIGHTS.length)] : 0,
    w: spec.w,
    h: spec.h,
    vx: kind === "puller" ? 40 : 0,
    legend,
    boxes: spec.boxes,
  });

  // The gap scales with speed so reaction time stays roughly constant.
  const gap = spec.w + 60 + s.speed * (0.75 + rng() * 0.75);
  s.nextSpawnAt = s.distance + gap;
}

function overlaps(a: Box, ax: number, ay: number, b: Box, bx: number, by: number): boolean {
  return (
    ax + a.x < bx + b.x + b.w &&
    ax + a.x + a.w > bx + b.x &&
    ay + a.y < by + b.y + b.h &&
    ay + a.y + a.h > by + b.y
  );
}

export function runnerTop(s: GameState): number {
  return FIELD.groundY - RUNNER.height - s.y;
}

export function obstacleTop(o: Obstacle): number {
  return FIELD.groundY - o.bottom - o.h;
}

function collides(s: GameState, fieldWidth: number): boolean {
  const boxes = s.ducking ? RUNNER_BOXES.ducking : RUNNER_BOXES.standing;
  const rx = runnerLeft(fieldWidth);
  const ry = runnerTop(s);
  for (const o of s.obstacles) {
    // Cheap reject on the whole obstacle before the box pairs.
    if (o.x > rx + RUNNER.width || o.x + o.w < rx) continue;
    const oy = obstacleTop(o);
    for (const a of boxes) {
      for (const b of o.boxes) {
        if (overlaps(a, rx, ry, b, o.x, oy)) return true;
      }
    }
  }
  return false;
}

/**
 * Advance the world by `dt` seconds. Returns the events that happened, in
 * order, so the caller can play sounds and flash the HUD.
 */
export function step(
  s: GameState,
  dt: number,
  input: Input,
  fieldWidth: number,
  rng: () => number = Math.random,
): GameEvent[] {
  const events: GameEvent[] = [];
  if (s.phase !== "running") return events;

  s.t += dt;
  const scroll = s.speed * dt;
  s.distance += scroll;
  s.score += scroll * SCORE_PER_PX;
  s.speed = SPEED.base + Math.min(SPEED.max - SPEED.base, s.score * SPEED.perPoint);

  // Runner.
  if (input.jump && onGround(s)) {
    s.vy = PHYSICS.jumpVelocity;
    s.y = 0.01;
    s.ducking = false;
    events.push("jump");
  }
  if (onGround(s)) {
    s.ducking = input.duck;
  } else {
    s.ducking = false;
    if (input.duck) s.vy = Math.min(s.vy, -PHYSICS.dropVelocity);
    s.y += s.vy * dt;
    s.vy -= PHYSICS.gravity * dt;
    if (s.y <= 0) {
      s.y = 0;
      s.vy = 0;
      s.ducking = input.duck;
    }
  }

  // World.
  for (const o of s.obstacles) o.x += (s.speed + o.vx) * dt;
  s.obstacles = s.obstacles.filter((o) => o.x < fieldWidth + 20);
  if (s.distance >= s.nextSpawnAt) spawn(s, fieldWidth, rng);

  // Score beats.
  const score = Math.floor(s.score);
  const milestone = Math.floor(score / MILESTONE) * MILESTONE;
  if (milestone > s.lastMilestone) {
    s.lastMilestone = milestone;
    events.push("milestone");
    const inverted = Math.floor(score / INVERT_EVERY) % 2 === 1;
    if (inverted !== s.inverted) {
      s.inverted = inverted;
      events.push("invert");
    }
  }

  if (collides(s, fieldWidth)) {
    s.phase = "over";
    s.hi = Math.max(s.hi, score);
    events.push("over");
  }

  return events;
}

export function formatScore(n: number): string {
  return String(Math.min(99999, Math.floor(n))).padStart(5, "0");
}
