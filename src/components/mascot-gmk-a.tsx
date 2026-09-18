"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MASCOT_VIEWBOX, mascotParts } from "@/components/mascot-gmk-a-paths";
import { MascotPaths } from "@/components/mascot-gmk-a-parts";

/**
 * Eye geometry, measured from the artwork in public/mascot/rakb-mascot-gmk-a.svg
 * (viewBox 0 0 312 380).
 *
 * - `cx`/`cy` is the centre of the iris ring.
 * - `rx`/`ry` is how far the pupil centre may travel from that centre before the
 *   pupil would spill past the dark rim (rim half-size minus pupil half-size).
 * - `restX`/`restY` is where the exported artwork already parks the pupil: it looks
 *   slightly to the right, so a zero translate must reproduce that pose exactly.
 */
const EYES = {
  left: { cx: 106.55, cy: 190.63, rx: 6.7, ry: 7.6, restX: 6.65, restY: -0.45 },
  right: { cx: 133.2, cy: 188.38, rx: 6.7, ry: 7.6, restX: 6.83, restY: -0.48 },
} as const;

/**
 * The easter egg: this many clicks or taps on the mascot inside this window
 * fires `onSecret`. Five quick taps is deliberate enough not to happen by
 * accident, and short enough to find by playing with the wave.
 */
const SECRET_TAPS = 5;
const SECRET_WINDOW_MS = 2500;

/** Distance (in viewBox units) at which the gaze reaches full deflection. */
const SATURATION = 220;

/** Per-frame easing toward the target, and the delta below which we stop animating. */
const EASE = 0.18;
const EPSILON = 0.01;

type Vec = { x: number; y: number };
type Gaze = { left: Vec; right: Vec };

const REST: Gaze = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };

type Eye = (typeof EYES)[keyof typeof EYES];

/** Translate to apply to a pupil so it looks at (px, py), relative to its rest pose. */
function gazeFor(eye: Eye, px: number, py: number): Vec {
  const dx = px - eye.cx;
  const dy = py - eye.cy;
  const dist = Math.hypot(dx, dy);
  if (dist < EPSILON) return { x: -eye.restX, y: -eye.restY };

  // Full deflection only once the cursor is well clear of the face.
  const reach = Math.min(1, dist / SATURATION);
  const ux = dx / dist;
  const uy = dy / dist;

  return {
    x: ux * eye.rx * reach - eye.restX,
    y: uy * eye.ry * reach - eye.restY,
  };
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number): Vec | null {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const local = point.matrixTransform(matrix.inverse());
  return { x: local.x, y: local.y };
}

type MascotGmkAProps = {
  className?: string;
  "aria-label"?: string;
  /** Fired after a burst of quick clicks or taps: the hook for the hidden mini game. */
  onSecret?: () => void;
};

export function MascotGmkA({
  className,
  "aria-label": ariaLabel = "RAKB mascot",
  onSecret,
}: MascotGmkAProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const targetRef = useRef<Gaze>(REST);
  const currentRef = useRef<Gaze>(REST);
  const rafRef = useRef(0);
  const tapsRef = useRef<number[]>([]);
  const [waving, setWaving] = useState(false);

  const wave = useCallback(() => {
    setWaving(true);
    if (!onSecret) return;
    const now = performance.now();
    const taps = tapsRef.current.filter((t) => now - t < SECRET_WINDOW_MS);
    taps.push(now);
    tapsRef.current = taps;
    if (taps.length >= SECRET_TAPS) {
      tapsRef.current = [];
      onSecret();
    }
  }, [onSecret]);
  const stopWaving = useCallback(() => setWaving(false), []);

  const apply = useCallback((gaze: Gaze) => {
    leftPupilRef.current?.setAttribute("transform", `translate(${gaze.left.x} ${gaze.left.y})`);
    rightPupilRef.current?.setAttribute("transform", `translate(${gaze.right.x} ${gaze.right.y})`);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Cursor tracking is meaningless without a cursor, and unwelcome when the
    // reader has asked for less motion.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches || !fine.matches) return;

    const settled = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      return (
        Math.abs(t.left.x - c.left.x) < EPSILON &&
        Math.abs(t.left.y - c.left.y) < EPSILON &&
        Math.abs(t.right.x - c.right.x) < EPSILON &&
        Math.abs(t.right.y - c.right.y) < EPSILON
      );
    };

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;

      const next: Gaze = {
        left: {
          x: c.left.x + (t.left.x - c.left.x) * EASE,
          y: c.left.y + (t.left.y - c.left.y) * EASE,
        },
        right: {
          x: c.right.x + (t.right.x - c.right.x) * EASE,
          y: c.right.y + (t.right.y - c.right.y) * EASE,
        },
      };

      currentRef.current = next;
      apply(next);

      // Idle when the pupils have caught up, so we don't hold a frame loop open.
      if (settled()) {
        currentRef.current = t;
        apply(t);
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafRef.current || settled()) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const point = clientToSvg(svg, event.clientX, event.clientY);
      if (!point) return;
      targetRef.current = {
        left: gazeFor(EYES.left, point.x, point.y),
        right: gazeFor(EYES.right, point.x, point.y),
      };
      start();
    };

    const onLeave = () => {
      targetRef.current = REST;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [apply]);

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={ariaLabel}
      className={`mascot-gmk-a${waving ? " is-waving" : ""}${className ? ` ${className}` : ""}`}
      onClick={wave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          wave();
        }
      }}
      tabIndex={0}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={MASCOT_VIEWBOX}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <MascotPaths list={mascotParts.shadow} />
      <MascotPaths list={mascotParts.bubble} />
      {/* Right hand (raised, open) - waves when the mascot is clicked. */}
      <g className="mascot-hand" onAnimationEnd={stopWaving}>
        <MascotPaths list={mascotParts.handOpen} />
      </g>
      <MascotPaths list={mascotParts.body} />
      <MascotPaths list={mascotParts.legBack} />
      <MascotPaths list={mascotParts.legFront} />
      <MascotPaths list={mascotParts.eyeLeft} />
      <g ref={leftPupilRef}>
        <MascotPaths list={mascotParts.pupilLeft} />
      </g>
      <MascotPaths list={mascotParts.eyeRight} />
      <g ref={rightPupilRef}>
        <MascotPaths list={mascotParts.pupilRight} />
      </g>
      <MascotPaths list={mascotParts.face} />
      <MascotPaths list={mascotParts.armFist} />
      <MascotPaths list={mascotParts.text} />
      <MascotPaths list={mascotParts.tail} />
      <g className="mascot-spark">
        <MascotPaths list={mascotParts.spark} />
      </g>
    </svg>
  );
}
